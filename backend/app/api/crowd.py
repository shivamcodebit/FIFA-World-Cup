"""
Crowd data API endpoints.
Provides crowd density snapshots and AI-generated summaries.
"""
import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.models.crowd import CrowdSnapshot
from app.schemas.crowd import CrowdSnapshotRead, CrowdSummaryResponse
from app.services.ai_service import generate_crowd_summary
from app.data.mock_data import MOCK_CROWD_DATA

router = APIRouter(prefix="/crowd", tags=["Crowd"])


def _now() -> datetime.datetime:
    return datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)


@router.get("/current", response_model=list[CrowdSnapshotRead])
async def get_current_crowd(db: AsyncSession = Depends(get_db)):
    """
    Get the latest crowd snapshot for each zone.
    Falls back to mock data if database is empty.
    """
    result = await db.execute(
        select(CrowdSnapshot).order_by(desc(CrowdSnapshot.timestamp)).limit(20)
    )
    snapshots = result.scalars().all()

    if not snapshots:
        # Seed mock data on first request
        for zone in MOCK_CROWD_DATA:
            snap = CrowdSnapshot(**zone, timestamp=_now())
            db.add(snap)
        await db.flush()
        result = await db.execute(
            select(CrowdSnapshot).order_by(desc(CrowdSnapshot.timestamp)).limit(20)
        )
        snapshots = result.scalars().all()

    return snapshots


@router.get("/summary", response_model=CrowdSummaryResponse)
async def get_crowd_summary(db: AsyncSession = Depends(get_db)):
    """
    Get an AI-generated crowd summary with hotspots and recommendations.
    """
    result = await db.execute(
        select(CrowdSnapshot).order_by(desc(CrowdSnapshot.timestamp)).limit(20)
    )
    snapshots = result.scalars().all()

    if not snapshots:
        crowd_data = MOCK_CROWD_DATA
    else:
        crowd_data = [
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

    summary, hotspots, recommendations = await generate_crowd_summary(crowd_data)
    overall = sum(z["density_pct"] for z in crowd_data) / max(len(crowd_data), 1)

    now = _now()
    return CrowdSummaryResponse(
        snapshots=[
            CrowdSnapshotRead(**{**z, "id": 0, "timestamp": now})
            for z in crowd_data
        ]
        if not snapshots
        else [CrowdSnapshotRead.model_validate(s) for s in snapshots],
        ai_summary=summary,
        hotspots=hotspots,
        recommendations=recommendations,
        overall_density=round(overall, 1),
        generated_at=now,
    )


@router.post("/seed")
async def seed_crowd_data(db: AsyncSession = Depends(get_db)):
    """Seed mock crowd data (useful for demos and testing)."""
    for zone in MOCK_CROWD_DATA:
        snap = CrowdSnapshot(**zone, timestamp=_now())
        db.add(snap)
    await db.flush()
    return {"message": f"Seeded {len(MOCK_CROWD_DATA)} crowd zones"}
