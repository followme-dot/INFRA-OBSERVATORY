import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from app.database import Base


class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(255), nullable=False)
    description = Column(Text)
    slug = Column(String(100), unique=True, nullable=False)

    # Owner
    owner_id = Column(UUID(as_uuid=True))
    is_public = Column(Boolean, default=False)

    # Layout (react-grid-layout format)
    layout = Column(JSON, nullable=False, default=list)

    # Configuration
    time_range = Column(String(50), default="1h")  # 15m, 1h, 6h, 24h, 7d, 30d
    refresh_interval = Column(Integer, default=30)  # seconds

    # Variables
    variables = Column(JSON, default=list)

    # Tags
    tags = Column(ARRAY(String))

    # Favorite
    is_starred = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    widgets = relationship("DashboardWidget", back_populates="dashboard", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Dashboard(name={self.name}, slug={self.slug})>"


class DashboardWidget(Base):
    __tablename__ = "dashboard_widgets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dashboard_id = Column(UUID(as_uuid=True), ForeignKey("dashboards.id", ondelete="CASCADE"), nullable=False)

    # Position (react-grid-layout)
    x = Column(Integer, nullable=False, default=0)
    y = Column(Integer, nullable=False, default=0)
    w = Column(Integer, nullable=False, default=4)
    h = Column(Integer, nullable=False, default=3)

    # Type
    widget_type = Column(String(50), nullable=False)
    # line_chart, area_chart, bar_chart, pie_chart, gauge, stat,
    # table, logs, heatmap, text, slo_status, alert_list

    # Title
    title = Column(String(255))
    description = Column(Text)

    # Configuration
    config = Column(JSON, nullable=False, default=dict)
    # For charts: { queries: [...], legend: true, etc }
    # For stats: { query: "...", format: "percent", etc }

    # Queries
    queries = Column(JSON, default=list)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    dashboard = relationship("Dashboard", back_populates="widgets")

    def __repr__(self):
        return f"<DashboardWidget(type={self.widget_type}, title={self.title})>"
