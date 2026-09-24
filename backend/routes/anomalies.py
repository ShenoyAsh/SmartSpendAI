"""
Anomaly detection API endpoint for SmartSpend AI.
Executes Isolation Forest to surface unusual transactions with explainable reasoning.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import AnomalyResponse
from backend.routes.common import get_dataset_dataframe
from backend.services.anomaly_service import detect_anomalies

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])

@router.get("", response_model=AnomalyResponse)
def get_anomalies(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    contamination: float = Query(0.03, ge=0.01, le=0.15, description="Expected outlier ratio"),
    db: Session = Depends(get_db)
):
    """
    Detects unusual transactions from the active dataset using Scikit-Learn Isolation Forest.
    Returns anomaly scores, labels, and plain-English explainable reasons.
    """
    df = get_dataset_dataframe(db, dataset_id)
    return detect_anomalies(df, contamination=contamination)
