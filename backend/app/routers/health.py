from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import get_db
from app.config import settings
from app.schemas.common import HealthCheck

router = APIRouter()


@router.get("/health", response_model=HealthCheck)
async def health_check():
    """Basic health check endpoint."""
    return HealthCheck(
        status="ok",
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow(),
    )


@router.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """Readiness check - verifies database connection."""
    try:
        # Check database connection
        await db.execute(text("SELECT 1"))

        return {
            "status": "ready",
            "checks": {
                "database": "ok",
            },
            "timestamp": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "checks": {
                "database": str(e),
            },
            "timestamp": datetime.utcnow().isoformat(),
        }


@router.get("/health/live")
async def liveness_check():
    """Liveness check - verifies application is running."""
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
    }
