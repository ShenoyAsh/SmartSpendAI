"""
Database management for SmartSpend AI.
Supports PostgreSQL (production) with automatic SQLite fallback for simple zero-config local runs.
"""

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

logger = logging.getLogger(__name__)

# Determine database engine
db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(db_url, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
    logger.info(f"Database connected successfully with URL: {db_url.split('@')[-1] if '@' in db_url else db_url}")
except Exception as e:
    logger.warning(f"Could not connect to configured DATABASE_URL ({db_url}): {e}")
    logger.info("Falling back to local SQLite database: sqlite:///./smartspend.db")
    db_url = "sqlite:///./smartspend.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency that provides a database session per request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)
