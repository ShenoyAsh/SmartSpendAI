"""
SmartSpend AI - Comprehensive Test Suite.
Tests CSV parsing, missing values, duplicates, validation errors,
analytics calculations, Isolation Forest anomaly detection,
Random Forest expenditure forecasting, and API endpoints.
"""

import io
import pytest
from fastapi.testclient import TestClient
import pandas as pd
from backend.main import app
from backend.services.preprocessing import preprocess_csv
from backend.services.analytics_service import (
    compute_overall_stats,
    compute_category_analysis,
    compute_monthly_analysis,
    compute_payment_mode_analysis,
    compute_daily_analysis
)
from backend.services.anomaly_service import detect_anomalies
from backend.services.prediction_service import predict_future_spending
from backend.services.insight_service import generate_rule_based_insights

client = TestClient(app)

# --- 1. Test CSV Preprocessing with Valid CSV ---
def test_valid_csv_preprocessing():
    csv_data = (
        "Date,Category,Amount,Payment_Mode,Description\n"
        "2025-01-05,Food & Dining,350.00,UPI,Lunch\n"
        "2025-01-10,Groceries,1200.50,Debit Card,Supermarket\n"
        "2025-01-15,Transportation,150.00,Cash,Metro Pass\n"
        "2025-02-01,Shopping,2500.00,Credit Card,Apparel\n"
    ).encode("utf-8")

    df, meta = preprocess_csv(csv_data, filename="valid.csv")
    assert len(df) == 4
    assert meta["valid_rows"] == 4
    assert meta["duplicates_removed"] == 0
    assert "Amount" in df.columns
    assert "Category" in df.columns
    assert "Date" in df.columns
    assert round(df["Amount"].sum(), 2) == 4200.50

# --- 2. Test Invalid CSV Header (Missing Required Columns) ---
def test_missing_required_columns():
    csv_data = (
        "Item,Cost,User\n"
        "Burger,200,Alice\n"
    ).encode("utf-8")

    with pytest.raises(Exception) as excinfo:
        preprocess_csv(csv_data, filename="bad.csv")
    assert "Required column" in str(excinfo.value)

# --- 3. Test Missing Values & Negative Amounts Handling ---
def test_missing_values_and_negative_amounts():
    csv_data = (
        "Date,Category,Amount,Payment_Mode,Description\n"
        "2025-01-01,Food,250.00,UPI,Good Tx\n"
        "2025-01-02,Transport,,UPI,Missing Amount\n"  # Missing amount -> filtered
        "2025-01-03,Food,-50.00,Cash,Negative Amount\n"  # Negative amount -> filtered
        "2025-01-04,Shopping,0.00,UPI,Zero Amount\n"  # Zero amount -> filtered
        "2025-01-05,,400.00,Debit Card,Missing Category\n"  # Missing category -> imputed to 'Miscellaneous'
    ).encode("utf-8")

    df, meta = preprocess_csv(csv_data, filename="test_missing.csv")
    assert len(df) == 2  # Only 2 valid positive rows remain
    assert "Miscellaneous" in df["Category"].values
    assert meta["missing_handled"] > 0

# --- 4. Test Duplicate Row Elimination ---
def test_duplicate_rows_removal():
    csv_data = (
        "Date,Category,Amount,Payment_Mode,Description\n"
        "2025-03-10,Entertainment,500.00,UPI,Movie\n"
        "2025-03-10,Entertainment,500.00,UPI,Movie\n"  # Exact Duplicate
        "2025-03-10,Entertainment,500.00,UPI,Movie\n"  # Exact Duplicate
        "2025-03-11,Entertainment,500.00,UPI,Movie 2\n"
    ).encode("utf-8")

    df, meta = preprocess_csv(csv_data, filename="duplicates.csv")
    assert len(df) == 2
    assert meta["duplicates_removed"] == 2

# --- 5. Test Analytics Calculation ---
def test_analytics_calculations():
    data = {
        "Date": ["2025-01-01", "2025-01-15", "2025-02-01", "2025-02-15"],
        "Category": ["Food", "Food", "Transport", "Shopping"],
        "Amount": [200.0, 400.0, 100.0, 1300.0],
        "Payment_Mode": ["UPI", "UPI", "Cash", "Credit Card"],
        "Description": ["A", "B", "C", "D"]
    }
    df = pd.DataFrame(data)

    stats = compute_overall_stats(df)
    assert stats["total_spending"] == 2000.0
    assert stats["transaction_count"] == 4
    assert stats["average_transaction"] == 500.0
    assert stats["median_transaction"] == 300.0
    assert stats["unique_categories"] == 3
    assert stats["unique_payment_methods"] == 3

    cat_res = compute_category_analysis(df)
    assert cat_res["highest_category"] == "Shopping"
    assert cat_res["highest_amount"] == 1300.0

    monthly_res = compute_monthly_analysis(df)
    assert len(monthly_res["monthly"]) == 2
    assert monthly_res["monthly"][0]["total_amount"] == 600.0
    assert monthly_res["monthly"][1]["total_amount"] == 1400.0
    assert monthly_res["monthly"][1]["mom_change_amount"] == 800.0

    pmode_res = compute_payment_mode_analysis(df)
    assert pmode_res["preferred_mode"] == "Shopping" or len(pmode_res["payment_modes"]) == 3

    daily_res = compute_daily_analysis(df)
    assert daily_res["average_daily_spending"] == 500.0

# --- 6. Test Isolation Forest Anomaly Detection ---
def test_isolation_forest_anomaly_detection():
    # Build synthetic baseline with one extreme outlier
    records = []
    for d in range(1, 30):
        records.append({"Date": f"2025-01-{d:02d}", "Category": "Food", "Amount": 200.0 + (d % 5) * 20, "Payment_Mode": "UPI", "Description": "Meal"})
    # Outlier
    records.append({"Date": "2025-01-15", "Category": "Shopping", "Amount": 45000.0, "Payment_Mode": "Credit Card", "Description": "High End Jewelry"})

    df = pd.DataFrame(records)
    res = detect_anomalies(df, contamination=0.04)
    assert res["total_anomalies"] >= 1
    anom_amounts = [a["amount"] for a in res["anomalies"]]
    assert 45000.0 in anom_amounts
    assert "higher" in res["anomalies"][0]["reason"] or "exceeds" in res["anomalies"][0]["reason"] or "deviation" in res["anomalies"][0]["reason"]

# --- 7. Test Random Forest Spending Prediction ---
def test_spending_prediction():
    # Test with insufficient history (< 3 months)
    short_df = pd.DataFrame([
        {"Date": "2025-01-10", "Category": "Food", "Amount": 1000.0, "Payment_Mode": "UPI", "Description": "A"},
        {"Date": "2025-02-10", "Category": "Food", "Amount": 1200.0, "Payment_Mode": "UPI", "Description": "B"}
    ])
    short_pred = predict_future_spending(short_df)
    assert short_pred["status"] == "insufficient_data"
    assert "At least 3 months" in short_pred["message"]

    # Test with 6 months of data
    long_records = []
    for m in range(1, 7):
        for _ in range(5):
            long_records.append({
                "Date": f"2025-{m:02d}-10",
                "Category": "Groceries",
                "Amount": 1500.0 + m * 50,
                "Payment_Mode": "UPI",
                "Description": "Grocery"
            })
    long_df = pd.DataFrame(long_records)
    pred_res = predict_future_spending(long_df)
    assert pred_res["status"] == "success"
    assert pred_res["predicted_amount"] > 0
    assert pred_res["r2_score"] is not None
    assert pred_res["mae"] is not None

# --- 8. Test AI Insights Engine ---
def test_ai_insights_engine():
    data = {
        "Date": ["2025-01-01", "2025-01-15", "2025-02-01", "2025-02-15"],
        "Category": ["Food", "Food", "Transport", "Shopping"],
        "Amount": [200.0, 400.0, 100.0, 1300.0],
        "Payment_Mode": ["UPI", "UPI", "Cash", "Credit Card"],
        "Description": ["A", "B", "C", "D"]
    }
    df = pd.DataFrame(data)
    stats = compute_overall_stats(df)
    cats = compute_category_analysis(df)
    monthly = compute_monthly_analysis(df)
    pmodes = compute_payment_mode_analysis(df)
    anoms = detect_anomalies(df)
    pred = predict_future_spending(df)

    insights = generate_rule_based_insights(stats, cats, monthly, anoms, pred, pmodes)
    assert len(insights["key_findings"]) > 0
    assert len(insights["recommendations"]) > 0
    assert 0 <= insights["budget_health_score"] <= 100

# --- 9. Test API Endpoints via TestClient ---
def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "SmartSpend" in data["app_name"]

def test_api_analytics_endpoints():
    res_summary = client.get("/api/analytics/summary")
    assert res_summary.status_code == 200

    res_cats = client.get("/api/analytics/categories")
    assert res_cats.status_code == 200

    res_monthly = client.get("/api/analytics/monthly")
    assert res_monthly.status_code == 200

    res_anomalies = client.get("/api/anomalies")
    assert res_anomalies.status_code == 200

    res_pred = client.get("/api/prediction")
    assert res_pred.status_code == 200

    res_insights = client.get("/api/insights")
    assert res_insights.status_code == 200
