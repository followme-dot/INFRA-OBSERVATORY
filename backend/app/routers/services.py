from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Service, Platform
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
    ServiceResponse,
)

router = APIRouter()


@router.get("", response_model=List[ServiceResponse])
async def list_services(
    platform_id: Optional[UUID] = Query(None),
    service_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List all services with optional filters."""
    query = select(Service)

    if platform_id:
        query = query.where(Service.platform_id == platform_id)
    if service_type:
        query = query.where(Service.service_type == service_type)
    if status:
        query = query.where(Service.status == status)
    if is_active is not None:
        query = query.where(Service.is_active == is_active)

    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    services = result.scalars().all()

    return services


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(service_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific service by ID."""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return service


@router.post("", response_model=ServiceResponse, status_code=201)
async def create_service(
    service_data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new service."""
    # Verify platform exists
    platform_result = await db.execute(
        select(Platform).where(Platform.id == service_data.platform_id)
    )
    if not platform_result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Platform not found")

    # Check if slug already exists for this platform
    existing = await db.execute(
        select(Service).where(
            Service.platform_id == service_data.platform_id,
            Service.slug == service_data.slug
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Service slug already exists for this platform")

    service = Service(**service_data.model_dump())
    db.add(service)
    await db.flush()
    await db.refresh(service)

    return service


@router.put("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: UUID,
    service_data: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing service."""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    update_data = service_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)

    await db.flush()
    await db.refresh(service)

    return service


@router.delete("/{service_id}", status_code=204)
async def delete_service(service_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a service."""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    await db.delete(service)
    await db.flush()


@router.get("/{service_id}/health")
async def get_service_health(service_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get health status for a service."""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return {
        "status": service.status,
        "health_score": float(service.health_score or 100),
        "last_seen": service.last_seen,
        "replicas": service.replicas,
    }


@router.get("/{service_id}/dependencies")
async def get_service_dependencies(service_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get dependencies for a service."""
    result = await db.execute(
        select(Service).where(Service.id == service_id)
    )
    service = result.scalar_one_or_none()

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # TODO: Implement actual dependency detection from traces
    return {
        "upstream": [],
        "downstream": [],
    }
