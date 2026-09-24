"""
Configuration module for SmartSpend AI backend.
Loads settings from environment variables with sensible defaults.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "SmartSpend AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api"
    
    # Database URL: PostgreSQL default, automatic SQLite fallback for simple zero-config local runs
    DATABASE_URL: str = "sqlite:///./smartspend.db"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Upload constraints (5MB max for CSV dataset)
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024
    
    # Optional AI LLM Integration
    AI_API_KEY: str = ""
    AI_API_PROVIDER: str = "rule_based"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
