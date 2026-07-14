"""
Chat API endpoints.
Handles AI-powered conversations for all user roles.
"""
from fastapi import APIRouter, Depends
import logging
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import chat_with_ai

router = APIRouter(prefix="/chat", tags=["Chat"])
logger = logging.getLogger(__name__)


@router.post("/", response_model=ChatResponse)
async def send_message(payload: ChatRequest, db: AsyncSession = Depends(get_db)):
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
async def get_history(session_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve conversation history for a session."""
    from sqlalchemy import select
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
    )
    messages = result.scalars().all()
    return [
        {"role": m.role, "content": m.content, "created_at": m.created_at}
        for m in messages
    ]
