from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Platform, Service, Alert
from app.schemas.platform import (
    PlatformCreate,
    PlatformUpdate,
    PlatformResponse,
    PlatformOverview,
)

router = APIRouter()


@router.get("", response_model=List[PlatformOverview])
async def list_platforms(
    is_active: Optional[bool] = Query(None),
    criticality: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """List all platforms with their overview stats."""
    query = select(Platform)

    if is_active is not None:
        query = query.where(Platform.is_active == is_active)
    if criticality:
        query = query.where(Platform.criticality == criticality)

    result = await db.execute(query)
    platforms = result.scalars().all()

    # Build overview for each platform
    overviews = []
    for platform in platforms:
        # Get service counts
        services_result = await db.execute(
            select(Service).where(Service.platform_id == platform.id)
        )
        services = services_result.scalars().all()
        service_count = len(services)
        healthy_service_count = len([s for s in services if s.status == "healthy"])

        # Get alert count
        alerts_result = await db.execute(
            select(func.count(Alert.id)).where(
                Alert.platform_id == platform.id,
                Alert.status == "firing"
            )
        )
        alert_count = alerts_result.scalar() or 0

        overview = PlatformOverview(
            id=platform.id,
            code=platform.code,
            name=platform.name,
            description=platform.description,
            color=platform.color,
            icon=platform.icon,
            base_url=platform.base_url,
            metrics_endpoint=platform.metrics_endpoint,
            logs_endpoint=platform.logs_endpoint,
            traces_endpoint=platform.traces_endpoint,
            criticality=platform.criticality,
            default_availability_target=float(platform.default_availability_target or 0.999),
            default_latency_target_ms=int(platform.default_latency_target_ms or 500),
            settings=platform.settings or {},
            status=platform.status,
            health_score=float(platform.health_score or 100),
            last_health_check=platform.last_health_check,
            is_active=platform.is_active,
            created_at=platform.created_at,
            updated_at=platform.updated_at,
            service_count=service_count,
            healthy_service_count=healthy_service_count,
            alert_count=alert_count,
            requests_per_second=1500.0 + (hash(platform.code) % 3000),  # TODO: Get from metrics
            error_rate=0.1 + (hash(platform.code) % 10) / 100,  # TODO: Get from metrics
            p99_latency=100.0 + (hash(platform.code) % 150),  # TODO: Get from metrics
        )
        overviews.append(overview)

    return overviews


@router.get("/{code}", response_model=PlatformOverview)
async def get_platform(code: str, db: AsyncSession = Depends(get_db)):
    """Get a specific platform by code."""
    result = await db.execute(
        select(Platform).where(Platform.code == code)
    )
    platform = result.scalar_one_or_none()

    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")

    # Get service counts
    services_result = await db.execute(
        select(Service).where(Service.platform_id == platform.id)
    )
    services = services_result.scalars().all()
    service_count = len(services)
    healthy_service_count = len([s for s in services if s.status == "healthy"])

    # Get alert count
    alerts_result = await db.execute(
        select(func.count(Alert.id)).where(
            Alert.platform_id == platform.id,
            Alert.status == "firing"
        )
    )
    alert_count = alerts_result.scalar() or 0

    return PlatformOverview(
        id=platform.id,
        code=platform.code,
        name=platform.name,
        description=platform.description,
        color=platform.color,
        icon=platform.icon,
        base_url=platform.base_url,
        metrics_endpoint=platform.metrics_endpoint,
        logs_endpoint=platform.logs_endpoint,
        traces_endpoint=platform.traces_endpoint,
        criticality=platform.criticality,
        default_availability_target=float(platform.default_availability_target or 0.999),
        default_latency_target_ms=int(platform.default_latency_target_ms or 500),
        settings=platform.settings or {},
        status=platform.status,
        health_score=float(platform.health_score or 100),
        last_health_check=platform.last_health_check,
        is_active=platform.is_active,
        created_at=platform.created_at,
        updated_at=platform.updated_at,
        service_count=service_count,
        healthy_service_count=healthy_service_count,
        alert_count=alert_count,
        requests_per_second=1500.0,
        error_rate=0.15,
        p99_latency=120.0,
    )


@router.post("", response_model=PlatformResponse, status_code=201)
async def create_platform(
    platform_data: PlatformCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new platform."""
    # Check if code already exists
    existing = await db.execute(
        select(Platform).where(Platform.code == platform_data.code)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Platform code already exists")

    platform = Platform(**platform_data.model_dump())
    db.add(platform)
    await db.flush()
    await db.refresh(platform)

    return platform


@router.put("/{code}", response_model=PlatformResponse)
async def update_platform(
    code: str,
    platform_data: PlatformUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing platform."""
    result = await db.execute(
        select(Platform).where(Platform.code == code)
    )
    platform = result.scalar_one_or_none()

    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")

    update_data = platform_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(platform, field, value)

    await db.flush()
    await db.refresh(platform)

    return platform


@router.delete("/{code}", status_code=204)
async def delete_platform(code: str, db: AsyncSession = Depends(get_db)):
    """Delete a platform."""
    result = await db.execute(
        select(Platform).where(Platform.code == code)
    )
    platform = result.scalar_one_or_none()

    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")

    await db.delete(platform)
    await db.flush()


@router.get("/{code}/health")
async def get_platform_health(code: str, db: AsyncSession = Depends(get_db)):
    """Get health status for a platform."""
    result = await db.execute(
        select(Platform).where(Platform.code == code)
    )
    platform = result.scalar_one_or_none()

    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")

    return {
        "status": platform.status,
        "health_score": float(platform.health_score or 100),
        "last_check": platform.last_health_check,
    }


@router.get("/{code}/services", response_model=List[dict])
async def get_platform_services(code: str, db: AsyncSession = Depends(get_db)):
    """Get all services for a platform."""
    result = await db.execute(
        select(Platform).where(Platform.code == code)
    )
    platform = result.scalar_one_or_none()

    if not platform:
        raise HTTPException(status_code=404, detail="Platform not found")

    services_result = await db.execute(
        select(Service).where(Service.platform_id == platform.id)
    )
    services = services_result.scalars().all()

    return [
        {
            "id": str(s.id),
            "name": s.name,
            "slug": s.slug,
            "service_type": s.service_type,
            "technology": s.technology,
            "status": s.status,
            "health_score": float(s.health_score or 100),
            "team": s.team,
            "replicas": s.replicas,
            "is_active": s.is_active,
        }
        for s in services
    ]
