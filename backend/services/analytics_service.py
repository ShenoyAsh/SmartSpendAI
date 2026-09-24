"""
Data Analytics Service for SmartSpend AI.
Performs descriptive, categorical, temporal, and payment channel aggregations.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np

def compute_overall_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates summary distribution statistics for transactions."""
    if df.empty:
        return {
            "total_spending": 0.0,
            "transaction_count": 0,
            "average_transaction": 0.0,
            "median_transaction": 0.0,
            "max_transaction": 0.0,
            "min_transaction": 0.0,
            "std_deviation": 0.0,
            "unique_categories": 0,
            "unique_payment_methods": 0,
            "start_date": None,
            "end_date": None
        }

    amounts = df["Amount"]
    return {
        "total_spending": round(float(amounts.sum()), 2),
        "transaction_count": int(len(df)),
        "average_transaction": round(float(amounts.mean()), 2),
        "median_transaction": round(float(amounts.median()), 2),
        "max_transaction": round(float(amounts.max()), 2),
        "min_transaction": round(float(amounts.min()), 2),
        "std_deviation": round(float(amounts.std(ddof=0)), 2) if len(amounts) > 1 else 0.0,
        "unique_categories": int(df["Category"].nunique()),
        "unique_payment_methods": int(df["Payment_Mode"].nunique()),
        "start_date": str(df["Date"].min()),
        "end_date": str(df["Date"].max())
    }

def compute_category_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates spending breakdown and metrics grouped by expense category."""
    if df.empty:
        return {"categories": [], "highest_category": "None", "highest_amount": 0.0}

    total_spend = float(df["Amount"].sum())
    grouped = df.groupby("Category").agg(
        total_amount=("Amount", "sum"),
        transaction_count=("Amount", "count"),
        average_amount=("Amount", "mean")
    ).reset_index()

    grouped["percentage"] = (grouped["total_amount"] / (total_spend if total_spend > 0 else 1.0)) * 100
    grouped = grouped.sort_values(by="total_amount", ascending=False).reset_index(drop=True)

    items = []
    for _, row in grouped.iterrows():
        items.append({
            "category": str(row["Category"]),
            "total_amount": round(float(row["total_amount"]), 2),
            "percentage": round(float(row["percentage"]), 2),
            "average_amount": round(float(row["average_amount"]), 2),
            "transaction_count": int(row["transaction_count"])
        })

    highest = items[0] if items else {"category": "None", "total_amount": 0.0}
    return {
        "categories": items,
        "highest_category": highest["category"],
        "highest_amount": highest["total_amount"]
    }

def compute_monthly_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates month-by-month spending, transaction counts, and month-over-month shifts."""
    if df.empty:
        return {"monthly": [], "highest_month": "None", "highest_amount": 0.0, "lowest_month": "None", "lowest_amount": 0.0}

    df_copy = df.copy()
    df_copy["Month"] = pd.to_datetime(df_copy["Date"]).dt.to_period("M").astype(str)

    monthly_grp = df_copy.groupby("Month").agg(
        total_amount=("Amount", "sum"),
        transaction_count=("Amount", "count"),
        average_amount=("Amount", "mean")
    ).reset_index().sort_values(by="Month", ascending=True)

    monthly_items = []
    prev_total = None

    for _, row in monthly_grp.iterrows():
        total = float(row["total_amount"])
        m_str = str(row["Month"])
        
        # Human-friendly label (e.g., '2025-01' -> 'Jan 2025')
        try:
            m_dt = pd.to_datetime(m_str + "-01")
            label = m_dt.strftime("%b %Y")
        except Exception:
            label = m_str

        mom_change_amount = 0.0
        mom_change_pct = 0.0

        if prev_total is not None and prev_total > 0:
            mom_change_amount = round(total - prev_total, 2)
            mom_change_pct = round(((total - prev_total) / prev_total) * 100, 2)

        monthly_items.append({
            "month": m_str,
            "month_label": label,
            "total_amount": round(total, 2),
            "transaction_count": int(row["transaction_count"]),
            "average_amount": round(float(row["average_amount"]), 2),
            "mom_change_amount": mom_change_amount,
            "mom_change_pct": mom_change_pct
        })
        prev_total = total

    if monthly_items:
        sorted_by_spend = sorted(monthly_items, key=lambda x: x["total_amount"], reverse=True)
        highest = sorted_by_spend[0]
        lowest = sorted_by_spend[-1]
    else:
        highest = {"month_label": "None", "total_amount": 0.0}
        lowest = {"month_label": "None", "total_amount": 0.0}

    return {
        "monthly": monthly_items,
        "highest_month": highest["month_label"],
        "highest_amount": highest["total_amount"],
        "lowest_month": lowest["month_label"],
        "lowest_amount": lowest["total_amount"]
    }

def compute_payment_mode_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates expenditure and volume grouped by payment channels (UPI, Card, Net Banking, etc.)."""
    if df.empty:
        return {"payment_modes": [], "preferred_mode": "None"}

    total_spend = float(df["Amount"].sum())
    grouped = df.groupby("Payment_Mode").agg(
        total_amount=("Amount", "sum"),
        transaction_count=("Amount", "count"),
        average_amount=("Amount", "mean")
    ).reset_index().sort_values(by="total_amount", ascending=False)

    items = []
    for _, row in grouped.iterrows():
        pct = (float(row["total_amount"]) / (total_spend if total_spend > 0 else 1.0)) * 100
        items.append({
            "payment_mode": str(row["Payment_Mode"]),
            "total_amount": round(float(row["total_amount"]), 2),
            "percentage": round(pct, 2),
            "transaction_count": int(row["transaction_count"]),
            "average_amount": round(float(row["average_amount"]), 2)
        })

    preferred = items[0]["payment_mode"] if items else "None"
    return {
        "payment_modes": items,
        "preferred_mode": preferred
    }

def compute_daily_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    """Calculates day-by-day expenditure trend and peaks."""
    if df.empty:
        return {"daily": [], "average_daily_spending": 0.0, "highest_spending_day": "None", "highest_day_amount": 0.0}

    daily_grp = df.groupby("Date").agg(
        total_amount=("Amount", "sum"),
        transaction_count=("Amount", "count")
    ).reset_index().sort_values(by="Date", ascending=True)

    daily_items = []
    for _, row in daily_grp.iterrows():
        daily_items.append({
            "date": str(row["Date"]),
            "total_amount": round(float(row["total_amount"]), 2),
            "transaction_count": int(row["transaction_count"])
        })

    avg_daily = round(float(daily_grp["total_amount"].mean()), 2)
    max_row = daily_grp.loc[daily_grp["total_amount"].idxmax()]

    return {
        "daily": daily_items,
        "average_daily_spending": avg_daily,
        "highest_spending_day": str(max_row["Date"]),
        "highest_day_amount": round(float(max_row["total_amount"]), 2)
    }
