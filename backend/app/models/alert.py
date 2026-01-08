import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Float, Integer, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base


class AlertRule(Base):
    __tablename__ = "alert_rules"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(255), nullable=False)
    description = Column(Text)

    # Scope
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"))  # NULL = global
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"))

    # Condition
    metric_name = Column(String(255))
    condition_operator = Column(String(20), nullable=False)  # gt, lt, gte, lte, eq, neq
    threshold = Column(Float, nullable=False)
    duration_seconds = Column(Integer, default=300)

    # Custom query
    custom_query = Column(Text)

    # Severity
    severity = Column(String(20), nullable=False, default="medium")  # info, low, medium, high, critical

    # Notifications
    notification_channels = Column(ARRAY(String))
    escalation_policy_id = Column(UUID(as_uuid=True))

    # Silencing
    is_muted = Column(Boolean, default=False)
    muted_until = Column(DateTime)
    muted_reason = Column(Text)

    # Status
    is_active = Column(Boolean, default=True)
    last_triggered = Column(DateTime)

    # Metadata
    labels = Column(JSON, default=dict)
    annotations = Column(JSON, default=dict)
    created_by = Column(UUID(as_uuid=True))

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    platform = relationship("Platform", back_populates="alert_rules")
    service = relationship("Service", back_populates="alert_rules")
    alerts = relationship("Alert", back_populates="rule", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<AlertRule(name={self.name}, severity={self.severity})>"


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rule_id = Column(UUID(as_uuid=True), ForeignKey("alert_rules.id", ondelete="CASCADE"))

    # Origin
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"), index=True)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), index=True)

    # Details
    name = Column(String(255), nullable=False)
    description = Column(Text)
    severity = Column(String(20), nullable=False, index=True)

    # Values
    current_value = Column(Float)
    threshold = Column(Float)

    # Status
    status = Column(String(20), nullable=False, default="firing", index=True)  # firing, resolved, acknowledged
    fired_at = Column(DateTime, nullable=False, index=True)
    resolved_at = Column(DateTime)
    acknowledged_at = Column(DateTime)
    acknowledged_by = Column(UUID(as_uuid=True))

    # Context
    labels = Column(JSON, default=dict)
    annotations = Column(JSON, default=dict)

    # Incident association
    incident_id = Column(UUID(as_uuid=True), ForeignKey("incidents.id"))

    # Relationships
    rule = relationship("AlertRule", back_populates="alerts")
    platform = relationship("Platform", back_populates="alerts")
    service = relationship("Service", back_populates="alerts")
    incident = relationship("Incident", back_populates="alerts")

    __table_args__ = (
        Index("idx_alerts_status_fired", "status", "fired_at"),
        Index("idx_alerts_platform_fired", "platform_id", "fired_at"),
        Index("idx_alerts_severity_fired", "severity", "fired_at"),
    )

    def __repr__(self):
        return f"<Alert(name={self.name}, status={self.status})>"
