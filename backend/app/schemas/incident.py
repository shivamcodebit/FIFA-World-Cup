"""Pydantic schemas for incident endpoints."""
from pydantic import BaseModel, Field
from typing import Literal
import datetime


class IncidentCreate(BaseModel):
    type: Literal["medical", "fire", "lost_child", "security", "suspicious", "other"]
    location: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=5, max_length=2000)
    reporter_role: Literal["fan", "volunteer", "staff", "organizer"] = "volunteer"


class IncidentUpdate(BaseModel):
    status: Literal["open", "in_progress", "resolved"] | None = None
    description: str | None = None


class IncidentRead(BaseModel):
    id: int
    type: str
    status: str
    location: str
    description: str
    reporter_role: str
    ai_summary: str | None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = {"from_attributes": True}
