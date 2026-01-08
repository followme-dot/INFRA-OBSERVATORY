import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Numeric, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Platform(Base):
    __tablename__ = "platforms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    color = Column(String(7), default="#00d4ff")
    icon = Column(String(50))

    # URLs
    base_url = Column(String(255))
    metrics_endpoint = Column(String(255))
    logs_endpoint = Column(String(255))
    traces_endpoint = Column(String(255))

    # Status
    status = Column(String(20), default="unknown")  # healthy, degraded, critical, unknown, maintenance
    health_score = Column(Numeric(5, 2), default=100.00)
    last_health_check = Column(DateTime)

    # Configuration
    is_active = Column(Boolean, default=True)
    criticality = Column(String(20), default="high")  # critical, high, medium, low
    settings = Column(JSON, default=dict)

    # SLO defaults
    default_availability_target = Column(Numeric(5, 4), default=0.9990)
    default_latency_target_ms = Column(Numeric, default=500)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    services = relationship("Service", back_populates="platform", cascade="all, delete-orphan")
    logs = relationship("LogEntry", back_populates="platform")
    metrics = relationship("Metric", back_populates="platform")
    traces = relationship("Trace", back_populates="platform")
    alert_rules = relationship("AlertRule", back_populates="platform")
    alerts = relationship("Alert", back_populates="platform")
    slos = relationship("SLO", back_populates="platform")

    def __repr__(self):
        return f"<Platform(code={self.code}, name={self.name})>"
