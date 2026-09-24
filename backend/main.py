"""
SmartSpend AI - Main FastAPI Application Server.
Provides intelligent personal expense analytics, Isolation Forest anomaly detection,
Random Forest expenditure forecasting, and automated financial insights.
"""

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import init_db
from backend.routes import upload, analytics, anomalies, prediction, insights, health

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("smartspend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes tables on startup."""
    logger.info("Initializing SmartSpend AI Database Schema...")
    init_db()
    logger.info("SmartSpend AI Database Schema Ready.")
    yield
    logger.info("Shutting down SmartSpend AI Backend.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent Personal Expense Analytics & Anomaly Detection API",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(upload.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(anomalies.router, prefix=settings.API_PREFIX)
app.include_router(prediction.router, prefix=settings.API_PREFIX)
app.include_router(insights.router, prefix=settings.API_PREFIX)
app.include_router(health.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "project": "SmartSpend AI — Intelligent Personal Expense Analytics & Anomaly Detection",
        "internship": "IBM SkillsBuild Data Analytics with AI Academic Internship",
        "status": "operational",
        "docs_url": "/docs",
        "api_prefix": settings.API_PREFIX
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
