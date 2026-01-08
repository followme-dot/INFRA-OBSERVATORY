from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    service_type: Optional[str] = Field(None, pattern="^(api|worker|database|cache|queue|gateway)$")
    technology: Optional[str] = None
    team: Optional[str] = None
    owner_email: Optional[str] = None
    health_endpoint: Optional[str] = None
    metrics_port: int = Field(default=9090, ge=0, le=65535)
    cpu_limit: Optional[str] = None
    memory_limit: Optional[str] = None
    replicas: int = Field(default=1, ge=0)
    settings: Dict[str, Any] = Field(default_factory=dict)
    labels: Dict[str, str] = Field(default_factory=dict)


class ServiceCreate(ServiceBase):
    platform_id: UUID


class ServiceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    service_type: Optional[str] = Field(None, pattern="^(api|worker|database|cache|queue|gateway)$")
    technology: Optional[str] = None
    team: Optional[str] = None
    owner_email: Optional[str] = None
    health_endpoint: Optional[str] = None
    metrics_port: Optional[int] = Field(None, ge=0, le=65535)
    cpu_limit: Optional[str] = None
    memory_limit: Optional[str] = None
    replicas: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None
    labels: Optional[Dict[str, str]] = None


class ServiceResponse(ServiceBase):
    id: UUID
    platform_id: UUID
    status: str
    health_score: float
    last_seen: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
