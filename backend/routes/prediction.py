"""
Spending prediction API endpoint for SmartSpend AI.
Forecasts future monthly spending using Random Forest Regression on historical trends.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.schemas import PredictionResponse
from backend.routes.common import get_dataset_dataframe
from backend.services.prediction_service import predict_future_spending

router = APIRouter(prefix="/prediction", tags=["Prediction"])

@router.get("", response_model=PredictionResponse)
def get_spending_prediction(
    dataset_id: Optional[int] = Query(None, description="Dataset ID to analyze"),
    db: Session = Depends(get_db)
):
    """
    Predicts next month's spending based on historical transactions using Random Forest Regression.
    Includes honest evaluation metrics (MAE, RMSE, R²) and intuitive explanation.
    """
    df = get_dataset_dataframe(db, dataset_id)
    return predict_future_spending(df)
