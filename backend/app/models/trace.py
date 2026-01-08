import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base


class Trace(Base):
    __tablename__ = "traces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(String(64), unique=True, nullable=False, index=True)

    # Origin
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"), index=True)
    root_service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), index=True)

    # Timing
    start_time = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    end_time = Column(TIMESTAMP(timezone=True))
    duration_ms = Column(Integer)

    # Info
    root_span_name = Column(String(255))
    services_involved = Column(ARRAY(String))
    span_count = Column(Integer, default=1)

    # Status
    status = Column(String(20), default="ok")  # ok, error, timeout
    has_error = Column(Boolean, default=False)
    error_message = Column(Text)

    # Metadata
    http_method = Column(String(10))
    http_path = Column(String(500))
    http_status_code = Column(Integer)
    user_id = Column(String(255))

    created_at = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)

    # Relationships
    platform = relationship("Platform", back_populates="traces")
    spans = relationship("Span", back_populates="trace", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_traces_platform_start", "platform_id", "start_time"),
        Index("idx_traces_status_start", "status", "start_time"),
        Index("idx_traces_duration", "duration_ms"),
    )

    def __repr__(self):
        return f"<Trace(trace_id={self.trace_id}, duration_ms={self.duration_ms})>"


class Span(Base):
    __tablename__ = "spans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    trace_id = Column(String(64), ForeignKey("traces.trace_id", ondelete="CASCADE"), nullable=False, index=True)
    span_id = Column(String(32), nullable=False)
    parent_span_id = Column(String(32), index=True)

    # Origin
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), index=True)

    # Timing
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True))
    duration_ms = Column(Integer)

    # Info
    name = Column(String(255), nullable=False)
    kind = Column(String(20))  # server, client, producer, consumer, internal

    # Status
    status = Column(String(20), default="ok")
    status_message = Column(Text)

    # Attributes
    attributes = Column(JSON, default=dict)
    events = Column(JSON, default=list)
    links = Column(JSON, default=list)

    # Relationships
    trace = relationship("Trace", back_populates="spans")
    service = relationship("Service", back_populates="spans")

    __table_args__ = (
        Index("idx_spans_service_start", "service_id", "start_time"),
    )

    def __repr__(self):
        return f"<Span(span_id={self.span_id}, name={self.name})>"
