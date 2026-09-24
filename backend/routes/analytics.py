"""
Analytics API endpoints for SmartSpend AI.
Serves summary statistics, categorical breakdown, monthly trends, payment modes, and daily distribution.
"""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import DatasetUpload
from backend.schemas import (
    OverallStats,
    CategoryAnalysisResponse,
    MonthlyAnalysisResponse,
    PaymentModeResponse,
    DailyAnalysisResponse
)
from backend.routes.common import get_dataset_dataframe
from backend.services.analytics_service import (
    compute_overall_stats,
    compute_category_analysis,
    compute_monthly_analysis,
    compute_payment_mode_analysis,
    compute_daily_analysis
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=OverallStats)
def get_summary_stats(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """Returns high-level distribution statistics and totals for the active dataset."""
    df = get_dataset_dataframe(db, dataset_id)
    return compute_overall_stats(df)

@router.get("/categories", response_model=CategoryAnalysisResponse)
def get_category_breakdown(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """Returns spending breakdown, transaction counts, and percentages grouped by category."""
    df = get_dataset_dataframe(db, dataset_id)
    return compute_category_analysis(df)

@router.get("/monthly", response_model=MonthlyAnalysisResponse)
def get_monthly_trends(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """Returns chronological monthly spending, transaction volume, and MoM percent change."""
    df = get_dataset_dataframe(db, dataset_id)
    return compute_monthly_analysis(df)

@router.get("/payment-modes", response_model=PaymentModeResponse)
def get_payment_modes(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """Returns spending and volume grouped by payment channel (UPI, Cards, Net Banking, Cash)."""
    df = get_dataset_dataframe(db, dataset_id)
    return compute_payment_mode_analysis(df)

@router.get("/daily", response_model=DailyAnalysisResponse)
def get_daily_trends(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """Returns day-by-day spending trend, daily average, and highest spending single day."""
    df = get_dataset_dataframe(db, dataset_id)
    return compute_daily_analysis(df)

@router.get("/datasets")
def list_uploaded_datasets(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """Returns a list of all uploaded datasets for switching in the UI."""
    datasets = db.query(DatasetUpload).order_by(DatasetUpload.id.desc()).all()
    return [
        {
            "id": d.id,
            "filename": d.filename,
            "uploaded_at": d.uploaded_at.strftime("%Y-%m-%d %H:%M:%S") if d.uploaded_at else "",
            "valid_rows": d.valid_rows,
            "total_amount": d.total_amount,
            "start_date": d.start_date,
            "end_date": d.end_date
        }
        for d in datasets
    ]
