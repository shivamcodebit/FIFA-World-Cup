"""
Incident API endpoints.
Handles emergency reporting with AI-generated summaries.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentRead, IncidentUpdate
from app.services.ai_service import generate_incident_summary
from app.api.auth import verify_api_key

router = APIRouter(prefix="/incidents", tags=["Incidents"], dependencies=[Depends(verify_api_key)])
limiter = Limiter(key_func=get_remote_address)



@router.post("/", response_model=IncidentRead, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
async def create_incident(request: Request, payload: IncidentCreate, db: AsyncSession = Depends(get_db)):
    """
    Report a new incident.
    Automatically generates an AI-powered incident summary.
    """
    # Generate AI summary
    ai_summary = await generate_incident_summary(
        incident_type=payload.type,
        location=payload.location,
        description=payload.description,
        reporter_role=payload.reporter_role,
    )

    incident = Incident(
        type=payload.type,
        location=payload.location,
        description=payload.description,
        reporter_role=payload.reporter_role,
        ai_summary=ai_summary,
    )
    db.add(incident)
    await db.flush()
    await db.refresh(incident)
    return incident


@router.get("/", response_model=list[IncidentRead])
@limiter.limit("30/minute")
async def list_incidents(
    request: Request,
    status: str | None = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """List incidents, optionally filtered by status."""
    query = select(Incident).order_by(Incident.created_at.desc()).limit(limit)
    if status:
        query = query.where(Incident.status == status)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{incident_id}", response_model=IncidentRead)
@limiter.limit("30/minute")
async def get_incident(request: Request, incident_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single incident by ID."""
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident


@router.patch("/{incident_id}", response_model=IncidentRead)
@limiter.limit("10/minute")
async def update_incident(
    request: Request, incident_id: int, payload: IncidentUpdate, db: AsyncSession = Depends(get_db)
):
    """Update incident status or description."""
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    if payload.status is not None:
        incident.status = payload.status
    if payload.description is not None:
        incident.description = payload.description

    await db.flush()
    await db.refresh(incident)
    return incident

