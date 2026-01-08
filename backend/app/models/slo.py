import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Numeric, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base


class SLO(Base):
    __tablename__ = "slos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(255), nullable=False)
    description = Column(Text)

    # Scope
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"))
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"))

    # SLI (Service Level Indicator)
    sli_type = Column(String(50), nullable=False)  # availability, latency, error_rate, throughput
    sli_query = Column(Text, nullable=False)

    # Target
    target = Column(Numeric(6, 4), nullable=False)  # e.g., 0.9990 for 99.90%

    # Window
    window_type = Column(String(20), default="rolling")  # rolling, calendar
    window_days = Column(Integer, default=30)

    # Current status
    current_value = Column(Numeric(6, 4))
    error_budget_remaining = Column(Numeric(6, 4))
    last_calculated = Column(DateTime)

    # Alerting
    burn_rate_threshold = Column(Numeric(5, 2), default=1.00)
    alert_on_budget_exhaustion = Column(Boolean, default=True)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    platform = relationship("Platform", back_populates="slos")
    service = relationship("Service", back_populates="slos")

    def __repr__(self):
        return f"<SLO(name={self.name}, target={self.target})>"
