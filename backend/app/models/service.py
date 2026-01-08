import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Numeric, Integer, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id", ondelete="CASCADE"), nullable=False)

    name = Column(String(100), nullable=False)
    slug = Column(String(100), nullable=False)
    description = Column(Text)

    # Type and Technology
    service_type = Column(String(50))  # api, worker, database, cache, queue, gateway
    technology = Column(String(100))  # python, node, go, java, etc

    # Status
    status = Column(String(20), default="unknown")
    health_score = Column(Numeric(5, 2), default=100.00)
    last_seen = Column(DateTime)

    # Ownership
    team = Column(String(100))
    owner_email = Column(String(255))

    # Endpoints
    health_endpoint = Column(String(255))
    metrics_port = Column(Integer, default=9090)

    # Resources
    cpu_limit = Column(String(20))
    memory_limit = Column(String(20))
    replicas = Column(Integer, default=1)

    # Configuration
    is_active = Column(Boolean, default=True)
    settings = Column(JSON, default=dict)
    labels = Column(JSON, default=dict)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    platform = relationship("Platform", back_populates="services")
    logs = relationship("LogEntry", back_populates="service")
    metrics = relationship("Metric", back_populates="service")
    spans = relationship("Span", back_populates="service")
    alert_rules = relationship("AlertRule", back_populates="service")
    alerts = relationship("Alert", back_populates="service")
    slos = relationship("SLO", back_populates="service")

    __table_args__ = (
        # Unique constraint on platform + slug
        {"schema": None},
    )

    def __repr__(self):
        return f"<Service(slug={self.slug}, name={self.name})>"
