from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", summary="Health Check Endpoint")
def get_health():
    """
    Perform a systems health audit. Returns the operational status of the service,
    project label parameters, and version metrics.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION
    }
