"""
Common helper functions for API routes.
Retrieves transaction records for a given dataset ID or falls back to latest/sample dataset.
"""

import os
from typing import Optional
import pandas as pd
from sqlalchemy.orm import Session
from backend.models import DatasetUpload, Transaction
from backend.services.preprocessing import preprocess_csv

def get_dataset_dataframe(db: Session, dataset_id: Optional[int] = None) -> pd.DataFrame:
    """
    Returns a pandas DataFrame of transactions for the requested dataset_id,
    or the latest uploaded dataset. If database has no uploads, automatically
    loads the bundled sample dataset.
    """
    query = db.query(Transaction)
    
    if dataset_id:
        query = query.filter(Transaction.dataset_id == dataset_id)
    else:
        latest = db.query(DatasetUpload).order_by(DatasetUpload.id.desc()).first()
        if latest:
            query = query.filter(Transaction.dataset_id == latest.id)
        else:
            # Seed from sample dataset if available
            sample_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "sample_transactions.csv")
            if os.path.exists(sample_path):
                with open(sample_path, "rb") as f:
                    content = f.read()
                df_clean, meta = preprocess_csv(content, filename="sample_transactions.csv")
                
                # Persist sample dataset
                d_rec = DatasetUpload(
                    filename="sample_transactions.csv",
                    total_rows=meta["initial_rows"],
                    valid_rows=meta["valid_rows"],
                    duplicates_removed=meta["duplicates_removed"],
                    missing_handled=meta["missing_handled"],
                    total_amount=meta["total_amount"],
                    start_date=meta["start_date"],
                    end_date=meta["end_date"]
                )
                db.add(d_rec)
                db.commit()
                db.refresh(d_rec)
                
                tx_objs = [
                    Transaction(
                        dataset_id=d_rec.id,
                        date=str(r["Date"]),
                        category=str(r["Category"]),
                        amount=float(r["Amount"]),
                        payment_mode=str(r["Payment_Mode"]),
                        description=str(r.get("Description", ""))
                    )
                    for _, r in df_clean.iterrows()
                ]
                db.bulk_save_objects(tx_objs)
                db.commit()
                return df_clean

    records = query.all()
    if not records:
        return pd.DataFrame(columns=["Date", "Category", "Amount", "Payment_Mode", "Description"])

    data = [
        {
            "id": r.id,
            "Date": r.date,
            "Category": r.category,
            "Amount": r.amount,
            "Payment_Mode": r.payment_mode,
            "Description": r.description,
            "is_anomaly": r.is_anomaly,
            "anomaly_score": r.anomaly_score,
            "anomaly_reason": r.anomaly_reason
        }
        for r in records
    ]
    return pd.DataFrame(data)
