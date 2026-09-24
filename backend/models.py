"""
SQLAlchemy ORM models for SmartSpend AI.
Defines tables for Datasets, Transactions, Anomalies, and Predictions.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class DatasetUpload(Base):
    __tablename__ = "dataset_uploads"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    total_rows = Column(Integer, default=0)
    valid_rows = Column(Integer, default=0)
    duplicates_removed = Column(Integer, default=0)
    missing_handled = Column(Integer, default=0)
    total_amount = Column(Float, default=0.0)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)

    # Relationships
    transactions = relationship("Transaction", back_populates="dataset", cascade="all, delete-orphan")
    anomalies = relationship("AnomalyRecord", back_populates="dataset", cascade="all, delete-orphan")
    predictions = relationship("PredictionRecord", back_populates="dataset", cascade="all, delete-orphan")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("dataset_uploads.id"), nullable=False)
    date = Column(String(20), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    payment_mode = Column(String(50), nullable=False, index=True)
    description = Column(String(255), nullable=True)
    is_anomaly = Column(Boolean, default=False)
    anomaly_score = Column(Float, nullable=True)
    anomaly_reason = Column(String(255), nullable=True)

    # Relationship
    dataset = relationship("DatasetUpload", back_populates="transactions")

class AnomalyRecord(Base):
    __tablename__ = "anomaly_records"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("dataset_uploads.id"), nullable=False)
    transaction_id = Column(Integer, nullable=True)
    date = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    payment_mode = Column(String(50), nullable=False)
    anomaly_score = Column(Float, nullable=False)
    reason = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=datetime.utcnow)

    dataset = relationship("DatasetUpload", back_populates="anomalies")

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("dataset_uploads.id"), nullable=False)
    target_period = Column(String(50), nullable=False)
    predicted_amount = Column(Float, nullable=False)
    historical_avg_amount = Column(Float, nullable=False)
    percentage_change = Column(Float, nullable=True)
    r2_score = Column(Float, nullable=True)
    mae = Column(Float, nullable=True)
    rmse = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    dataset = relationship("DatasetUpload", back_populates="predictions")
