import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

logger = logging.getLogger("app.database.session")

database_url = settings.DATABASE_URL
if not database_url:
    logger.warning("DATABASE_URL is not configured in settings. Falling back to an in-memory database for syntax compiling.")
    database_url = "sqlite://"

# Connect parameters. connect_args check_same_thread is only required for SQLite
connect_args = {}
if database_url.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """
    FastAPI dependency injection provider. Yields a database transaction session
    and guarantees it is closed after request lifecycle completes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
