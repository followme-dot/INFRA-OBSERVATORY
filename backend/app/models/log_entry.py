import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base


class LogEntry(Base):
    __tablename__ = "logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False, index=True)

    # Origin
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"), index=True)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), index=True)

    # Content
    level = Column(String(20), nullable=False, index=True)  # debug, info, warn, error, fatal
    message = Column(Text, nullable=False)

    # Context
    trace_id = Column(String(64), index=True)
    span_id = Column(String(32))
    request_id = Column(String(64))
    user_id = Column(String(255))

    # Metadata
    source = Column(String(255))  # file/module source
    environment = Column(String(20))  # production, staging, development
    host = Column(String(255))
    container_id = Column(String(100))
    pod_name = Column(String(255))

    # Structured data
    attributes = Column(JSON, default=dict)

    # Relationships
    platform = relationship("Platform", back_populates="logs")
    service = relationship("Service", back_populates="logs")

    __table_args__ = (
        Index("idx_logs_platform_timestamp", "platform_id", "timestamp"),
        Index("idx_logs_service_timestamp", "service_id", "timestamp"),
        Index("idx_logs_level_timestamp", "level", "timestamp"),
    )

    def __repr__(self):
        return f"<LogEntry(level={self.level}, timestamp={self.timestamp})>"
