from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List

from app.database import get_db
from app.models import Platform, Service, Alert
from app.schemas.common import SystemOverview
from app.schemas.platform import PlatformOverview

router = APIRouter()


@router.get("", response_model=SystemOverview)
async def get_system_overview(db: AsyncSession = Depends(get_db)):
    """Get system-wide overview statistics."""

    # Count platforms
    platforms_result = await db.execute(select(func.count(Platform.id)))
    total_platforms = platforms_result.scalar() or 0

    # Count services by status
    services_result = await db.execute(select(Service))
    services = services_result.scalars().all()
    total_services = len(services)
    healthy_services = len([s for s in services if s.status == "healthy"])
    degraded_services = len([s for s in services if s.status in ["degraded", "warning"]])
    critical_services = len([s for s in services if s.status == "critical"])

    # Count active alerts
    alerts_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == "firing")
    )
    active_alerts = alerts_result.scalar() or 0

    critical_alerts_result = await db.execute(
        select(func.count(Alert.id)).where(
            Alert.status == "firing",
            Alert.severity == "critical"
        )
    )
    critical_alerts = critical_alerts_result.scalar() or 0

    # Calculate health score
    if total_services > 0:
        health_score = (healthy_services / total_services) * 100
    else:
        health_score = 100.0

    return SystemOverview(
        health_score=round(health_score, 2),
        total_platforms=total_platforms,
        total_services=total_services,
        healthy_services=healthy_services,
        degraded_services=degraded_services,
        critical_services=critical_services,
        active_alerts=active_alerts,
        critical_alerts=critical_alerts,
        open_incidents=0,  # TODO: Count from incidents table
        requests_per_second=45230.0,  # TODO: Get from metrics
        error_rate=0.34,  # TODO: Get from metrics
        p99_latency=156.0,  # TODO: Get from metrics
    )


@router.get("/health-score")
async def get_health_score(db: AsyncSession = Depends(get_db)):
    """Get global health score."""
    services_result = await db.execute(select(Service))
    services = services_result.scalars().all()

    if not services:
        return {"health_score": 100.0}

    healthy_count = len([s for s in services if s.status == "healthy"])
    health_score = (healthy_count / len(services)) * 100

    return {"health_score": round(health_score, 2)}


@router.get("/stats")
async def get_global_stats(db: AsyncSession = Depends(get_db)):
    """Get global statistics."""
    # Platforms count
    platforms_result = await db.execute(select(func.count(Platform.id)))
    total_platforms = platforms_result.scalar() or 0

    # Services count
    services_result = await db.execute(select(func.count(Service.id)))
    total_services = services_result.scalar() or 0

    # Active alerts count
    alerts_result = await db.execute(
        select(func.count(Alert.id)).where(Alert.status == "firing")
    )
    active_alerts = alerts_result.scalar() or 0

    return {
        "platforms": total_platforms,
        "services": total_services,
        "alerts": active_alerts,
        "uptime": "99.99%",  # TODO: Calculate from SLOs
    }
