"""Pydantic schemas for chat endpoints."""
from pydantic import BaseModel, Field, field_validator
from typing import Literal
import datetime


class ChatHistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=3000)


class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=64)
    message: str = Field(..., min_length=1, max_length=2000)
    user_role: Literal["fan", "volunteer", "staff", "organizer"] = "fan"
    language: str = Field(default="en", max_length=10)
    location: str | None = Field(default=None, max_length=200)
    context: dict | None = None  # extra context (seat_number, accessibility_needs, etc.)
    history: list[ChatHistoryItem] = Field(default_factory=list, max_length=50)

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        """Strip leading/trailing whitespace and block empty messages."""
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Message cannot be empty or whitespace only")
        return cleaned

    @field_validator("session_id")
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        """Ensure session_id contains only safe characters."""
        import re
        if not re.match(r"^[a-zA-Z0-9_\-]{1,64}$", v):
            raise ValueError("session_id must contain only alphanumeric characters, hyphens, and underscores")
        return v


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    language: str
    suggested_actions: list[str] = Field(default_factory=list)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
