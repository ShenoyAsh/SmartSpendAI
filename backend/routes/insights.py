"""
AI Financial Insights API endpoint for SmartSpend AI.
Synthesizes analytics, anomaly detections, and ML forecasts into narrative financial guidance.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import AIInsightsResponse
from backend.routes.common import get_dataset_dataframe
from backend.services.analytics_service import (
    compute_overall_stats,
    compute_category_analysis,
    compute_monthly_analysis,
    compute_payment_mode_analysis
)
from backend.services.anomaly_service import detect_anomalies
from backend.services.prediction_service import predict_future_spending
from backend.services.insight_service import generate_insights

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("", response_model=AIInsightsResponse)
def get_financial_insights(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """
    Produces actionable AI spending insights, budgeting recommendations, and risk alerts.
    Works deterministically out-of-the-box without requiring an external paid LLM key.
    """
    df = get_dataset_dataframe(db, dataset_id)
    
    stats = compute_overall_stats(df)
    categories = compute_category_analysis(df)
    monthly = compute_monthly_analysis(df)
    payment_modes = compute_payment_mode_analysis(df)
    anomalies = detect_anomalies(df)
    prediction = predict_future_spending(df)

    return generate_insights(
        stats=stats,
        categories=categories,
        monthly=monthly,
        anomalies=anomalies,
        prediction=prediction,
        payment_modes=payment_modes
    )
