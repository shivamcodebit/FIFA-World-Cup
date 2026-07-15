"""
Chat API endpoints.
Handles AI-powered conversations for all user roles.
"""
import re
from fastapi import APIRouter, Depends, Request, HTTPException
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.auth import verify_api_key
from app.database import get_db
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import chat_with_ai

router = APIRouter(prefix="/chat", tags=["Chat"], dependencies=[Depends(verify_api_key)])
logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)


@router.post("/", response_model=ChatResponse)
@limiter.limit("10/minute")
async def send_message(request: Request, payload: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Send a message to the AI assistant.

    The AI uses the user's role, language, location, and conversation history
    to generate contextually relevant responses.
    """
    logger.info("Chat request: session=%s role=%s message_len=%d", payload.session_id, payload.user_role, len(payload.message))

    # Get AI response
    reply, suggested_actions = await chat_with_ai(
        message=payload.message,
        user_role=payload.user_role,
        language=payload.language,
        location=payload.location,
        context=payload.context,
        history=[h.model_dump() for h in payload.history],
    )

    # Persist both messages to the database
    user_msg = ChatMessage(
        session_id=payload.session_id,
        role="user",
        content=payload.message,
        user_role=payload.user_role,
        language=payload.language,
    )
    assistant_msg = ChatMessage(
        session_id=payload.session_id,
        role="assistant",
        content=reply,
        user_role=payload.user_role,
        language=payload.language,
    )
    db.add(user_msg)
    db.add(assistant_msg)
    await db.flush()

    return ChatResponse(
        session_id=payload.session_id,
        reply=reply,
        language=payload.language,
        suggested_actions=suggested_actions,
    )


@router.get("/history/{session_id}")
@limiter.limit("30/minute")
async def get_history(
    request: Request,
    session_id: str,
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve conversation history for a session."""
    if not re.match(r"^[a-zA-Z0-9_\-]{1,64}$", session_id):
        raise HTTPException(status_code=422, detail="Invalid session_id format")
    from sqlalchemy import select, desc
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(desc(ChatMessage.created_at))
        .limit(limit)
        .offset(offset)
    )
    messages = result.scalars().all()
    messages.reverse()
    return [
        {"role": m.role, "content": m.content, "created_at": m.created_at}
        for m in messages
    ]
