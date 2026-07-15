"""Pydantic schemas for crowd data endpoints."""
from pydantic import BaseModel, Field
import datetime


class CrowdSnapshotRead(BaseModel):
    id: int
    zone_id: str
    zone_name: str
    capacity: int
    current_count: int
    density_pct: float
    queue_length: int
    timestamp: datetime.datetime

    model_config = {"from_attributes": True}


class CrowdSummaryResponse(BaseModel):
    snapshots: list[CrowdSnapshotRead]
    ai_summary: str
    hotspots: list[str]
    recommendations: list[str]
    overall_density: float
    generated_at: datetime.datetime = Field(default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))
