"""
Dataset upload API route.
Validates uploaded CSV file, standardizes columns, detects anomalies,
and persists records into the database.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import DatasetUpload, Transaction, AnomalyRecord
from backend.schemas import DatasetUploadResponse
from backend.utils.validators import validate_csv_upload
from backend.services.preprocessing import preprocess_csv
from backend.services.anomaly_service import detect_anomalies

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("", response_model=DatasetUploadResponse)
async def upload_csv_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts CSV file upload, validates structure, performs preprocessing,
    stores transactions and pre-detected anomalies into PostgreSQL/SQLite database.
    """
    validate_csv_upload(file)

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Preprocess dataset
    df, meta = preprocess_csv(content, filename=file.filename)

    # Detect anomalies immediately
    anomaly_res = detect_anomalies(df)
    anom_lookup = {a["date"] + str(a["amount"]) + a["category"]: a for a in anomaly_res["anomalies"]}

    # Create dataset record
    dataset_rec = DatasetUpload(
        filename=file.filename,
        total_rows=meta["initial_rows"],
        valid_rows=meta["valid_rows"],
        duplicates_removed=meta["duplicates_removed"],
        missing_handled=meta["missing_handled"],
        total_amount=meta["total_amount"],
        start_date=meta["start_date"],
        end_date=meta["end_date"]
    )
    db.add(dataset_rec)
    db.commit()
    db.refresh(dataset_rec)

    # Bulk insert transactions
    tx_objects = []
    for _, row in df.iterrows():
        key = str(row["Date"]) + str(row["Amount"]) + str(row["Category"])
        is_anom = key in anom_lookup
        score = anom_lookup[key]["anomaly_score"] if is_anom else None
        reason = anom_lookup[key]["reason"] if is_anom else None

        tx = Transaction(
            dataset_id=dataset_rec.id,
            date=str(row["Date"]),
            category=str(row["Category"]),
            amount=float(row["Amount"]),
            payment_mode=str(row["Payment_Mode"]),
            description=str(row.get("Description", "")),
            is_anomaly=is_anom,
            anomaly_score=score,
            anomaly_reason=reason
        )
        tx_objects.append(tx)

    db.bulk_save_objects(tx_objects)
    db.commit()

    # Save anomalies to AnomalyRecord table
    anom_objects = []
    for anom in anomaly_res["anomalies"]:
        anom_rec = AnomalyRecord(
            dataset_id=dataset_rec.id,
            date=anom["date"],
            category=anom["category"],
            amount=anom["amount"],
            payment_mode=anom["payment_mode"],
            anomaly_score=anom["anomaly_score"],
            reason=anom["reason"]
        )
        anom_objects.append(anom_rec)

    if anom_objects:
        db.bulk_save_objects(anom_objects)
        db.commit()

    msg_summary = f"{meta['valid_rows']} transactions successfully processed."
    if meta["duplicates_removed"] > 0:
        msg_summary += f" ({meta['duplicates_removed']} duplicates removed)"

    return DatasetUploadResponse(
        dataset_id=dataset_rec.id,
        filename=dataset_rec.filename,
        total_rows=dataset_rec.total_rows,
        valid_rows=dataset_rec.valid_rows,
        duplicates_removed=dataset_rec.duplicates_removed,
        missing_handled=dataset_rec.missing_handled,
        total_amount=dataset_rec.total_amount,
        start_date=dataset_rec.start_date,
        end_date=dataset_rec.end_date,
        message=msg_summary
    )
