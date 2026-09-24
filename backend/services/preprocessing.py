"""
Data Preprocessing Service for SmartSpend AI.
Handles CSV parsing, flexible column name resolution, data cleaning,
duplicate removal, missing value imputation/filtering, and format standardization.
"""

import io
import re
from typing import Tuple, Dict, Any
import pandas as pd
import numpy as np
from fastapi import HTTPException

# Common variations of column names
COLUMN_MAPPINGS = {
    "date": [
        "date", "transaction_date", "tx_date", "txn_date", "trans_date", 
        "expense_date", "timestamp", "datetime", "posting_date"
    ],
    "category": [
        "category", "expense_category", "cat", "transaction_category",
        "category_name", "type", "expense_type", "tag"
    ],
    "amount": [
        "amount", "transaction_amount", "amt", "spent", "value", 
        "cost", "expense_amount", "debit", "price"
    ],
    "payment_mode": [
        "payment_mode", "payment_method", "mode", "payment", 
        "method", "paid_via", "channel", "trans_type", "type_of_payment"
    ],
    "description": [
        "description", "desc", "notes", "remark", "remarks", 
        "details", "narration", "merchant", "payee", "title"
    ]
}

PAYMENT_MODE_STANDARDIZATION = {
    "upi": "UPI",
    "gpay": "UPI",
    "phonepe": "UPI",
    "paytm": "UPI",
    "credit": "Credit Card",
    "credit card": "Credit Card",
    "cc": "Credit Card",
    "debit": "Debit Card",
    "debit card": "Debit Card",
    "dc": "Debit Card",
    "net banking": "Net Banking",
    "netbanking": "Net Banking",
    "internet banking": "Net Banking",
    "neft": "Net Banking",
    "imps": "Net Banking",
    "rtgs": "Net Banking",
    "cash": "Cash",
    "wallet": "Digital Wallet",
    "cheque": "Cheque",
    "check": "Cheque"
}

def clean_amount_value(val: Any) -> float:
    """Extracts numeric float from text amounts like '₹1,200.50' or '$45.00'."""
    if pd.isna(val):
        return np.nan
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).strip()
    # Remove currency symbols and commas
    cleaned = re.sub(r"[^\d.-]", "", val_str)
    try:
        return float(cleaned)
    except (ValueError, TypeError):
        return np.nan

def standardize_payment_mode(mode: Any) -> str:
    """Standardizes varied payment mode strings to consistent labels."""
    if pd.isna(mode):
        return "Other"
    m_str = str(mode).strip().lower()
    for key, standardized in PAYMENT_MODE_STANDARDIZATION.items():
        if key == m_str or key in m_str:
            return standardized
    return str(mode).strip().title()

def preprocess_csv(file_bytes: bytes, filename: str = "dataset.csv") -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Parses, cleans, and standardizes uploaded CSV bytes into a uniform DataFrame.
    Returns: (cleaned_df, preprocessing_metadata)
    """
    # Try different encodings
    encodings = ["utf-8", "latin1", "iso-8859-1", "cp1252"]
    raw_df = None
    
    for enc in encodings:
        try:
            raw_df = pd.read_csv(io.BytesIO(file_bytes), encoding=enc)
            break
        except Exception:
            continue
            
    if raw_df is None:
        raise HTTPException(
            status_code=400,
            detail="Unable to decode CSV file. Please ensure it is saved in UTF-8 or standard CSV format."
        )

    if raw_df.empty:
        raise HTTPException(
            status_code=400,
            detail="The uploaded CSV file is empty. Please provide a file containing transaction records."
        )

    initial_row_count = len(raw_df)
    messages = []

    # Map column headers to canonical names
    matched_cols = {}
    normalized_headers = {col.strip().lower().replace(" ", "_"): col for col in raw_df.columns}

    for canonical, variations in COLUMN_MAPPINGS.items():
        found = False
        for var in variations:
            if var in normalized_headers:
                matched_cols[canonical] = normalized_headers[var]
                found = True
                break
        if not found and canonical in ["date", "category", "amount"]:
            raise HTTPException(
                status_code=400,
                detail=f"Required column '{canonical}' could not be identified. Expected headers: {', '.join(variations[:3])}"
            )

    # Rename to canonical columns
    rename_dict = {matched_cols[k]: k.title() if k != "payment_mode" else "Payment_Mode" for k in matched_cols}
    df = raw_df[list(matched_cols.values())].rename(columns=rename_dict).copy()

    # Fill default values for optional columns if not present in input
    if "Payment_Mode" not in df.columns:
        df["Payment_Mode"] = "UPI"
        messages.append("Payment mode column not provided; defaulted to 'UPI'.")
    if "Description" not in df.columns:
        df["Description"] = "Personal Expense"

    # Track missing values
    missing_before = df[["Date", "Category", "Amount"]].isna().sum().sum()
    
    # 1. Clean Amount
    df["Amount"] = df["Amount"].apply(clean_amount_value)
    
    # Filter non-positive amounts
    invalid_amounts = (df["Amount"].isna()) | (df["Amount"] <= 0)
    invalid_amount_count = int(invalid_amounts.sum())
    if invalid_amount_count > 0:
        df = df[~invalid_amounts].copy()
        messages.append(f"Filtered out {invalid_amount_count} transactions with missing or zero/negative amounts.")

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid positive expense transactions remain after filtering missing and zero amounts."
        )

    # 2. Clean & Standardize Dates
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    invalid_dates = df["Date"].isna()
    invalid_date_count = int(invalid_dates.sum())
    if invalid_date_count > 0:
        df = df[~invalid_dates].copy()
        messages.append(f"Filtered out {invalid_date_count} records with unparseable dates.")

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="No valid transactions remain after date parsing."
        )

    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")

    # 3. Clean & Standardize Category
    df["Category"] = df["Category"].fillna("Miscellaneous").astype(str).str.strip().str.title()
    df.loc[df["Category"] == "", "Category"] = "Miscellaneous"

    # 4. Standardize Payment Mode
    df["Payment_Mode"] = df["Payment_Mode"].apply(standardize_payment_mode)

    # 5. Clean Description
    df["Description"] = df["Description"].fillna("Expense").astype(str).str.strip()

    # 6. Duplicate detection & removal
    before_dedup = len(df)
    df = df.drop_duplicates(subset=["Date", "Category", "Amount", "Payment_Mode", "Description"]).copy()
    duplicates_removed = before_dedup - len(df)
    if duplicates_removed > 0:
        messages.append(f"Detected and eliminated {duplicates_removed} duplicate transaction records.")

    # Sort chronologically
    df = df.sort_values(by="Date", ascending=True).reset_index(drop=True)

    metadata = {
        "initial_rows": initial_row_count,
        "valid_rows": len(df),
        "duplicates_removed": duplicates_removed,
        "missing_handled": int(missing_before),
        "total_amount": round(float(df["Amount"].sum()), 2),
        "start_date": df["Date"].min() if not df.empty else None,
        "end_date": df["Date"].max() if not df.empty else None,
        "messages": messages
    }

    return df, metadata
