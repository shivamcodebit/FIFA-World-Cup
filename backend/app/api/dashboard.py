"""
Dashboard API endpoints.
Provides AI-powered operational insights for staff and organizers.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.models.crowd import CrowdSnapshot
from app.schemas.dashboard import StaffDashboardData, OrganizerDashboardData, ZoneStatus
from app.services.ai_service import (
    generate_staff_dashboard_insights,
    generate_organizer_dashboard_insights,
)
from app.data.mock_data import MOCK_CROWD_DATA

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


async def _get_crowd_data(db: AsyncSession) -> list[dict]:
    result = await db.execute(
        select(CrowdSnapshot).order_by(desc(CrowdSnapshot.timestamp)).limit(20)
    )
    snapshots = result.scalars().all()
    if not snapshots:
        return MOCK_CROWD_DATA
    return [
        {
            "zone_id": s.zone_id,
            "zone_name": s.zone_name,
            "capacity": s.capacity,
            "current_count": s.current_count,
            "density_pct": s.density_pct,
            "queue_length": s.queue_length,
        }
        for s in snapshots
    ]


def _zone_alert_level(density: float) -> str:
    if density >= 85:
        return "red"
    if density >= 65:
        return "yellow"
    return "green"


@router.get("/staff", response_model=StaffDashboardData)
async def staff_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Return AI-powered operational insights for venue staff.
    Includes crowd summary, cleaning priorities, water refill alerts, security alerts.
    """
    crowd_data = await _get_crowd_data(db)
    insights = await generate_staff_dashboard_insights(crowd_data)

    zones = [
        ZoneStatus(
            zone_id=z["zone_id"],
            zone_name=z["zone_name"],
            density_pct=z["density_pct"],
            queue_length=z["queue_length"],
            alert_level=_zone_alert_level(z["density_pct"]),
        )
        for z in crowd_data
    ]

    return StaffDashboardData(
        zones=zones,
        crowd_summary=insights.get("crowd_summary", ""),
        cleaning_priorities=insights.get("cleaning_priorities", []),
        water_refill_alerts=insights.get("water_refill_alerts", []),
        security_alerts=insights.get("security_alerts", []),
        ai_insights=insights.get("ai_insights", ""),
    )


@router.get("/organizer", response_model=OrganizerDashboardData)
async def organizer_dashboard(db: AsyncSession = Depends(get_db)):
    """
    Return strategic AI-powered insights for event organizers.
    Includes crowd distribution analysis, gate optimization, staff allocation.
    """
    crowd_data = await _get_crowd_data(db)
    insights = await generate_organizer_dashboard_insights(crowd_data)

    zones = [
        ZoneStatus(
            zone_id=z["zone_id"],
            zone_name=z["zone_name"],
            density_pct=z["density_pct"],
            queue_length=z["queue_length"],
            alert_level=_zone_alert_level(z["density_pct"]),
        )
        for z in crowd_data
    ]

    return OrganizerDashboardData(
        zones=zones,
        crowd_distribution_analysis=insights.get("crowd_distribution_analysis", ""),
        gate_optimization=insights.get("gate_optimization", []),
        staff_allocation=insights.get("staff_allocation", []),
        transport_recommendations=insights.get("transport_recommendations", []),
        stadium_health_summary=insights.get("stadium_health_summary", ""),
        decision_support=insights.get("decision_support", ""),
    )
