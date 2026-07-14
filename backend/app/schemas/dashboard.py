"""Pydantic schemas for dashboard endpoints."""
from pydantic import BaseModel


class ZoneStatus(BaseModel):
    zone_id: str
    zone_name: str
    density_pct: float
    queue_length: int
    alert_level: str  # green | yellow | red


class StaffDashboardData(BaseModel):
    zones: list[ZoneStatus]
    crowd_summary: str
    cleaning_priorities: list[str]
    water_refill_alerts: list[str]
    security_alerts: list[str]
    ai_insights: str


class OrganizerDashboardData(BaseModel):
    zones: list[ZoneStatus]
    crowd_distribution_analysis: str
    gate_optimization: list[str]
    staff_allocation: list[str]
    transport_recommendations: list[str]
    stadium_health_summary: str
    decision_support: str
