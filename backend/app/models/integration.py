import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Integration(Base):
    __tablename__ = "integrations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # slack, pagerduty, opsgenie, email, webhook, teams

    # Configuration
    config = Column(JSON, nullable=False, default=dict)
    # Slack: { webhook_url, channel }
    # PagerDuty: { api_key, service_id }
    # Email: { smtp_host, smtp_port, recipients }

    # Status
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime)
    last_error = Column(Text)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Integration(name={self.name}, type={self.type})>"
