"""
Health check and system diagnostics endpoint for SmartSpend AI.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.database import get_db
from backend.config import settings
from backend.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    """Validates API responsiveness and database connectivity."""
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unreachable: {str(e)}"

    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        database_status=db_status
    )
