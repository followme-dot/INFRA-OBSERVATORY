import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Info
    title = Column(String(255), nullable=False)
    description = Column(Text)

    # Classification
    severity = Column(String(20), nullable=False)  # info, low, medium, high, critical
    status = Column(String(20), nullable=False, default="open")  # open, acknowledged, investigating, resolved, closed

    # Timing
    started_at = Column(DateTime, nullable=False)
    detected_at = Column(DateTime)
    acknowledged_at = Column(DateTime)
    resolved_at = Column(DateTime)
    closed_at = Column(DateTime)

    # Impact
    affected_platforms = Column(ARRAY(String))
    affected_services = Column(ARRAY(String))
    customer_impact = Column(String(100))  # none, minor, major, critical

    # Resolution
    root_cause = Column(Text)
    resolution = Column(Text)

    # Responsibility
    commander_id = Column(UUID(as_uuid=True))
    assigned_to = Column(ARRAY(String))

    # Timeline
    timeline = Column(JSON, default=list)  # [{timestamp, action, user, note}]

    # Postmortem
    postmortem_url = Column(String(500))
    action_items = Column(JSON, default=list)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    alerts = relationship("Alert", back_populates="incident")

    def __repr__(self):
        return f"<Incident(title={self.title}, status={self.status})>"
