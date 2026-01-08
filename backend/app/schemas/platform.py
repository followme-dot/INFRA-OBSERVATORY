from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field


class PlatformBase(BaseModel):
    code: str = Field(..., min_length=1, max_length=50)
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    color: str = Field(default="#00d4ff", pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    base_url: Optional[str] = None
    metrics_endpoint: Optional[str] = None
    logs_endpoint: Optional[str] = None
    traces_endpoint: Optional[str] = None
    criticality: str = Field(default="high", pattern="^(critical|high|medium|low)$")
    default_availability_target: float = Field(default=0.999, ge=0, le=1)
    default_latency_target_ms: int = Field(default=500, ge=0)
    settings: Dict[str, Any] = Field(default_factory=dict)


class PlatformCreate(PlatformBase):
    pass


class PlatformUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")
    icon: Optional[str] = None
    base_url: Optional[str] = None
    metrics_endpoint: Optional[str] = None
    logs_endpoint: Optional[str] = None
    traces_endpoint: Optional[str] = None
    is_active: Optional[bool] = None
    criticality: Optional[str] = Field(None, pattern="^(critical|high|medium|low)$")
    default_availability_target: Optional[float] = Field(None, ge=0, le=1)
    default_latency_target_ms: Optional[int] = Field(None, ge=0)
    settings: Optional[Dict[str, Any]] = None


class PlatformResponse(PlatformBase):
    id: UUID
    status: str
    health_score: float
    last_health_check: Optional[datetime] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlatformOverview(PlatformResponse):
    service_count: int = 0
    healthy_service_count: int = 0
    alert_count: int = 0
    requests_per_second: float = 0
    error_rate: float = 0
    p99_latency: float = 0
