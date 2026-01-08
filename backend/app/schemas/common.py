from datetime import datetime
from typing import Generic, TypeVar, Optional, List
from pydantic import BaseModel

T = TypeVar("T")


class HealthCheck(BaseModel):
    status: str = "ok"
    version: str
    timestamp: datetime


class TimeRange(BaseModel):
    from_time: datetime
    to_time: datetime


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    total: int
    page: int
    limit: int
    pages: int


class SystemOverview(BaseModel):
    health_score: float
    total_platforms: int
    total_services: int
    healthy_services: int
    degraded_services: int
    critical_services: int
    active_alerts: int
    critical_alerts: int
    open_incidents: int
    requests_per_second: float
    error_rate: float
    p99_latency: float


class ErrorResponse(BaseModel):
    message: str
    code: str
    details: Optional[dict] = None


class SuccessResponse(BaseModel):
    message: str
    data: Optional[dict] = None
