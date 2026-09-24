"""
Pydantic schemas for request validation and API response serialization.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

# --- Transaction Schemas ---
class TransactionBase(BaseModel):
    date: str
    category: str
    amount: float
    payment_mode: str
    description: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: int
    dataset_id: int
    is_anomaly: bool = False
    anomaly_score: Optional[float] = None
    anomaly_reason: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

# --- Dataset Upload Response ---
class DatasetUploadResponse(BaseModel):
    dataset_id: int
    filename: str
    total_rows: int
    valid_rows: int
    duplicates_removed: int
    missing_handled: int
    total_amount: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    message: str

# --- Analytics Schemas ---
class OverallStats(BaseModel):
    total_spending: float
    transaction_count: int
    average_transaction: float
    median_transaction: float
    max_transaction: float
    min_transaction: float
    std_deviation: float
    unique_categories: int
    unique_payment_methods: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class CategorySummaryItem(BaseModel):
    category: str
    total_amount: float
    percentage: float
    average_amount: float
    transaction_count: int

class CategoryAnalysisResponse(BaseModel):
    categories: List[CategorySummaryItem]
    highest_category: str
    highest_amount: float

class MonthlySummaryItem(BaseModel):
    month: str
    month_label: str
    total_amount: float
    transaction_count: int
    average_amount: float
    mom_change_amount: Optional[float] = 0.0
    mom_change_pct: Optional[float] = 0.0

class MonthlyAnalysisResponse(BaseModel):
    monthly: List[MonthlySummaryItem]
    highest_month: str
    highest_amount: float
    lowest_month: str
    lowest_amount: float

class PaymentModeItem(BaseModel):
    payment_mode: str
    total_amount: float
    percentage: float
    transaction_count: int
    average_amount: float

class PaymentModeResponse(BaseModel):
    payment_modes: List[PaymentModeItem]
    preferred_mode: str

class DailySummaryItem(BaseModel):
    date: str
    total_amount: float
    transaction_count: int

class DailyAnalysisResponse(BaseModel):
    daily: List[DailySummaryItem]
    average_daily_spending: float
    highest_spending_day: str
    highest_day_amount: float

# --- Anomaly Schemas ---
class AnomalyItem(BaseModel):
    id: Optional[int] = None
    date: str
    category: str
    amount: float
    payment_mode: str
    description: Optional[str] = None
    anomaly_score: float
    reason: str

class AnomalyResponse(BaseModel):
    total_anomalies: int
    total_transactions: int
    anomaly_percentage: float
    anomalies: List[AnomalyItem]
    methodology: str = "Isolation Forest with Category-Relative Z-Score Decomposition"

# --- Prediction Schemas ---
class MonthlyHistoryPoint(BaseModel):
    month: str
    actual_amount: float
    predicted_amount: Optional[float] = None

class PredictionResponse(BaseModel):
    target_period: str
    predicted_amount: float
    historical_avg_amount: float
    percentage_change: Optional[float] = None
    r2_score: Optional[float] = None
    mae: Optional[float] = None
    rmse: Optional[float] = None
    status: str  # "success" or "insufficient_data"
    message: str
    monthly_history: List[Dict[str, Any]] = []

# --- AI Insight Schemas ---
class AIInsightsResponse(BaseModel):
    provider: str
    summary: str
    key_findings: List[str]
    recommendations: List[str]
    risk_alerts: List[str]
    budget_health_score: int  # 0 to 100

# --- Health Check ---
class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str
    database_status: str
