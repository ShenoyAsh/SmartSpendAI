"""
Anomaly Detection Service for SmartSpend AI.
Utilizes Scikit-learn Isolation Forest with domain feature engineering
(category-relative z-scores, log-scale amount, temporal signals) to detect
unusual transactions without false accusations of fraud.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def detect_anomalies(df: pd.DataFrame, contamination: float = 0.03) -> Dict[str, Any]:
    """
    Identifies unusual transactions using an Isolation Forest model.
    Returns:
        Dict containing total_anomalies, anomaly_percentage, and structured list of anomalies.
    """
    if df.empty or len(df) < 5:
        return {
            "total_anomalies": 0,
            "total_transactions": len(df),
            "anomaly_percentage": 0.0,
            "anomalies": [],
            "methodology": "Isolation Forest (Requires at least 5 transactions)"
        }

    df_features = df.copy()
    
    # 1. Feature Engineering: Log-transformed amount
    df_features["Log_Amount"] = np.log1p(df_features["Amount"])
    
    # 2. Feature Engineering: Category-relative Z-score
    cat_stats = df_features.groupby("Category")["Amount"].agg(["mean", "std"]).reset_index()
    cat_stats["std"] = cat_stats["std"].fillna(1.0).replace(0.0, 1.0)
    
    df_features = df_features.merge(cat_stats, on="Category", how="left")
    df_features["Category_ZScore"] = (df_features["Amount"] - df_features["mean"]) / df_features["std"]
    
    # 3. Feature Engineering: Day of week
    df_features["DayOfWeek"] = pd.to_datetime(df_features["Date"]).dt.dayofweek

    # Feature matrix for Isolation Forest
    X = df_features[["Amount", "Log_Amount", "Category_ZScore", "DayOfWeek"]].values

    # Determine safe contamination rate
    eff_contamination = min(0.05, max(0.015, 3.0 / len(df)))

    # Fit Isolation Forest
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=eff_contamination,
        random_state=42,
        max_samples="auto"
    )
    
    predictions = iso_forest.fit_predict(X)  # -1 for anomaly, 1 for normal
    raw_scores = iso_forest.decision_function(X)  # Lower is more abnormal

    # Normalize anomaly score: 0 (normal) to 1 (highly anomalous)
    min_s, max_s = raw_scores.min(), raw_scores.max()
    norm_scores = 1.0 - (raw_scores - min_s) / ((max_s - min_s) if max_s > min_s else 1.0)

    overall_median = float(df["Amount"].median())
    anomalies_list = []

    for idx, (pred, score) in enumerate(zip(predictions, norm_scores)):
        if pred == -1:
            row = df_features.iloc[idx]
            amt = float(row["Amount"])
            cat = str(row["Category"])
            cat_mean = float(row["mean"])
            z_score = float(row["Category_ZScore"])
            desc = str(row.get("Description", "Expense"))
            pmode = str(row.get("Payment_Mode", "UPI"))

            # Construct human-friendly explainable reason (NEVER call it fraud)
            if z_score >= 2.5 and cat_mean > 0:
                multiple = round(amt / cat_mean, 1)
                reason = f"Transaction amount (₹{amt:,.2f}) is {multiple}x higher than typical {cat} average (₹{cat_mean:,.2f})."
            elif amt > 3 * overall_median:
                reason = f"High-value expenditure (₹{amt:,.2f}) significantly exceeds user median spending (₹{overall_median:,.2f})."
            else:
                reason = f"Unusual combination of amount (₹{amt:,.2f}) and timing relative to normal category habits."

            anomalies_list.append({
                "id": int(row.get("id", idx + 1)),
                "date": str(row["Date"]),
                "category": cat,
                "amount": round(amt, 2),
                "payment_mode": pmode,
                "description": desc,
                "anomaly_score": round(float(score), 3),
                "reason": reason
            })

    # Sort anomalies by amount / severity descending
    anomalies_list.sort(key=lambda x: x["amount"], reverse=True)

    total_anomalies = len(anomalies_list)
    total_tx = len(df)
    anomaly_pct = round((total_anomalies / total_tx) * 100, 2) if total_tx > 0 else 0.0

    return {
        "total_anomalies": total_anomalies,
        "total_transactions": total_tx,
        "anomaly_percentage": anomaly_pct,
        "anomalies": anomalies_list,
        "methodology": "Scikit-Learn Isolation Forest with Category-Relative Z-Score Decomposition"
    }
