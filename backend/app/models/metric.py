import uuid
from sqlalchemy import Column, String, Text, Float, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
from sqlalchemy.orm import relationship
from app.database import Base


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False, index=True)

    # Origin
    platform_id = Column(UUID(as_uuid=True), ForeignKey("platforms.id"), index=True)
    service_id = Column(UUID(as_uuid=True), ForeignKey("services.id"), index=True)

    # Metric
    name = Column(String(255), nullable=False, index=True)  # e.g., http_requests_total
    metric_type = Column(String(20), nullable=False)  # counter, gauge, histogram, summary

    # Value
    value = Column(Float, nullable=False)

    # Labels/Tags
    labels = Column(JSON, default=dict)

    # Aggregation
    aggregation = Column(String(20))  # sum, avg, min, max, count, p50, p90, p99

    # Metadata
    unit = Column(String(50))  # seconds, bytes, percent, requests, etc.
    description = Column(Text)

    # Relationships
    platform = relationship("Platform", back_populates="metrics")
    service = relationship("Service", back_populates="metrics")

    __table_args__ = (
        Index("idx_metrics_platform_timestamp", "platform_id", "timestamp"),
        Index("idx_metrics_service_timestamp", "service_id", "timestamp"),
        Index("idx_metrics_name_timestamp", "name", "timestamp"),
    )

    def __repr__(self):
        return f"<Metric(name={self.name}, value={self.value})>"
