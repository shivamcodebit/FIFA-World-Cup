"""
Core AI service powered by Google Gemini (google-genai SDK).

Responsibilities:
- Build dynamic system prompts based on user role / context
- Return LLM completions with asyncio-safe timeout handling
- Generate structured summaries for incidents / crowd data
- Support multilingual conversations
"""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from google import genai
from google.genai import types

from app.config import get_settings
from app.prompts.templates import (
    FAN_SYSTEM_PROMPT,
    VOLUNTEER_SYSTEM_PROMPT,
    STAFF_SYSTEM_PROMPT,
    ORGANIZER_SYSTEM_PROMPT,
    INCIDENT_SUMMARY_PROMPT,
    CROWD_SUMMARY_PROMPT,
    STAFF_DASHBOARD_PROMPT,
    ORGANIZER_DASHBOARD_PROMPT,
)

logger = logging.getLogger(__name__)
settings = get_settings()

# Per-request timeout for Gemini API calls
GEMINI_TIMEOUT = 15.0

# Singleton client
_client: genai.Client | None = None


def _get_client() -> genai.Client | None:
    """Return a singleton Gemini client or None when API key is not configured.

    Any exceptions raised by the underlying SDK during initialization are
    logged and swallowed so the application can continue in demo mode.
    """
    global _client
    if _client is None:
        if not settings.gemini_api_key:
            logger.debug("Gemini API key not configured; running in demo mode.")
            return None
        try:
            _client = genai.Client(api_key=settings.gemini_api_key)
            logger.info("Initialized Gemini client for model=%s", settings.gemini_model)
        except Exception as exc:
            logger.exception("Failed to initialize Gemini client: %s", exc)
            _client = None
    return _client


def _extract_json(text: str) -> str:
    """
    Robustly extract JSON from LLM responses that may wrap JSON
    in markdown code fences (```json ... ``` or ``` ... ```).
    """
    text = text.strip()
    # Try to find JSON between ```json ... ``` fences
    if "```json" in text:
        start = text.index("```json") + 7
        end = text.index("```", start)
        return text[start:end].strip()
    # Try to find JSON between ``` ... ``` fences
    if "```" in text:
        parts = text.split("```")
        # parts[1] is the first code block content
        if len(parts) >= 3:
            block = parts[1].strip()
            # Remove leading language identifier
            lines = block.splitlines()
            if lines and not lines[0].startswith(("{", "[")):
                block = "\n".join(lines[1:]).strip()
            return block
    # Try to find raw JSON object or array
    for start_char, end_char in [("{", "}"), ("[", "]")]:
        if start_char in text:
            start = text.index(start_char)
            end = text.rindex(end_char) + 1
            return text[start:end]
    return text


_ROLE_PROMPTS: dict[str, str] = {
    "fan": FAN_SYSTEM_PROMPT,
    "volunteer": VOLUNTEER_SYSTEM_PROMPT,
    "staff": STAFF_SYSTEM_PROMPT,
    "organizer": ORGANIZER_SYSTEM_PROMPT,
}

_LANGUAGE_NAMES: dict[str, str] = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "pt": "Portuguese",
    "ar": "Arabic",
    "hi": "Hindi",
}


async def _call_gemini(fn_args: dict) -> str:
    """
    Run an asynchronous Gemini generate_content call
    with a hard timeout. Returns the response text.
    """
    client = _get_client()
    if client is None:
        raise RuntimeError("No Gemini client – API key not configured")

    try:
        resp = await asyncio.wait_for(
            client.aio.models.generate_content(**fn_args),
            timeout=GEMINI_TIMEOUT,
        )
        return (resp.text or "").strip()
    except asyncio.TimeoutError:
        logger.warning("Gemini call timed out after %ss", GEMINI_TIMEOUT)
        raise TimeoutError(f"Gemini API timed out after {GEMINI_TIMEOUT}s")
    except Exception as exc:
        logger.exception("Unhandled exception during Gemini call: %s", exc)
        raise


def _build_contents(
    history: list[dict[str, str]], message: str
) -> list[types.Content]:
    """Convert flat history + new message to Gemini Content list."""
    contents: list[types.Content] = []
    for item in history:
        role = "user" if item["role"] == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=item["content"])]))
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))
    return contents


from pydantic import BaseModel, Field

class ChatAIResult(BaseModel):
    reply: str = Field(description="The assistant response to the user, formatted with markdown as appropriate.")
    suggested_actions: list[str] = Field(description="A list of 2-3 short follow-up action suggestions or questions the user might want to do next.")

async def chat_with_ai(
    message: str,
    user_role: str,
    language: str = "en",
    location: str | None = None,
    context: dict[str, Any] | None = None,
    history: list[dict[str, str]] | None = None,
) -> tuple[str, list[str]]:
    """
    Send a message to Gemini and return (reply, suggested_actions).
    Falls back to a placeholder when API key is missing or call fails.
    """
    if not _get_client():
        return _placeholder_response(message, user_role, language), []

    try:
        lang_name = _LANGUAGE_NAMES.get(language, "English")
        base_prompt = _ROLE_PROMPTS.get(user_role, FAN_SYSTEM_PROMPT)

        context_block = ""
        if location:
            context_block += f"\nUser's current location: {location}"
        if context:
            context_block += f"\nAdditional context: {json.dumps(context, ensure_ascii=False)}"
        context_block += f"\nRespond in: {lang_name}"

        system_instruction = (
            base_prompt + context_block +
            "\nYou MUST format your response as a JSON object matching the requested schema.\n"
            "Both the reply and the suggested_actions list MUST be written/translated to the requested response language."
        )
        contents = _build_contents(history or [], message)

        reply_text = await _call_gemini({
            "model": settings.gemini_model,
            "contents": contents,
            "config": types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=settings.gemini_temperature,
                max_output_tokens=settings.gemini_max_tokens,
                response_mime_type="application/json",
                response_schema=ChatAIResult,
            ),
        })

        try:
            parsed = json.loads(_extract_json(reply_text))
            reply = parsed.get("reply", "").strip()
            actions = parsed.get("suggested_actions", [])
            # Sanitize actions
            actions = [a.strip() for a in actions if isinstance(a, str) and len(a.strip()) > 0][:3]
            return reply, actions
        except Exception as parse_err:
            logger.error("Failed to parse structured JSON response: %s", parse_err)
            return reply_text, []

    except Exception as exc:
        # Log full exception for diagnostics, but return a user-friendly
        # placeholder so upstream code can continue functioning.
        logger.exception("Gemini chat_with_ai failed: %s", exc)
        # Provide a safe, non-sensitive debug string in non-production only.
        if settings.environment != "production":
            debug_msg = f"DEBUG: {type(exc).__name__}: {str(exc)}"
        else:
            debug_msg = "The AI service is currently unavailable."
        return debug_msg, []



async def generate_incident_summary(
    incident_type: str,
    location: str,
    description: str,
    reporter_role: str,
) -> str:
    """Generate a professional AI incident report summary."""
    if not _get_client():
        return f"Incident Report: {incident_type.upper()} at {location}. {description}"

    try:
        prompt = INCIDENT_SUMMARY_PROMPT.format(
            incident_type=incident_type,
            location=location,
            description=description,
            reporter_role=reporter_role,
        )
        return await _call_gemini({
            "model": settings.gemini_model,
            "contents": prompt,
            "config": types.GenerateContentConfig(temperature=0.3, max_output_tokens=600),
        })
    except TimeoutError:
        return f"AI summary timed out. Incident: {incident_type.upper()} at {location}."
    except Exception as exc:
        logger.error("Incident summary error: %s", exc)
        return f"Incident Report [{incident_type.upper()}] at {location}: {description}"


async def generate_crowd_summary(crowd_data: list[dict]) -> tuple[str, list[str], list[str]]:
    """Generate AI crowd summary, hotspot list, and recommendations."""
    hotspots_fallback = [z["zone_name"] for z in crowd_data if z["density_pct"] > 75]

    if not _get_client():
        return "Crowd data received. AI summary unavailable.", hotspots_fallback, []

    try:
        prompt = CROWD_SUMMARY_PROMPT.format(crowd_json=json.dumps(crowd_data, indent=2))
        raw = await _call_gemini({
            "model": settings.gemini_model,
            "contents": prompt,
            "config": types.GenerateContentConfig(temperature=0.3, max_output_tokens=800),
        })
        raw = _extract_json(raw)
        data = json.loads(raw)
        return data.get("summary", raw), data.get("hotspots", []), data.get("recommendations", [])
    except TimeoutError:
        return "AI analysis timed out. Review zone data manually.", hotspots_fallback, []
    except Exception as exc:
        logger.error("Crowd summary error: %s", exc)
        return "AI analysis unavailable.", hotspots_fallback, []


async def generate_staff_dashboard_insights(crowd_data: list[dict]) -> dict:
    """Generate staff-specific operational insights."""
    fallback = {
        "crowd_summary": "AI unavailable.",
        "cleaning_priorities": [],
        "water_refill_alerts": [],
        "security_alerts": [],
        "ai_insights": "Configure GEMINI_API_KEY for AI insights.",
    }
    if not _get_client():
        return fallback

    try:
        prompt = STAFF_DASHBOARD_PROMPT.format(crowd_json=json.dumps(crowd_data, indent=2))
        raw = await _call_gemini({
            "model": settings.gemini_model,
            "contents": prompt,
            "config": types.GenerateContentConfig(temperature=0.3, max_output_tokens=1000),
        })
        raw = _extract_json(raw)
        return json.loads(raw)
    except TimeoutError:
        return {**fallback, "crowd_summary": "AI timed out. Please refresh.", "ai_insights": "Retry in a moment."}
    except Exception as exc:
        logger.error("Staff dashboard error: %s", exc)
        return fallback


async def generate_organizer_dashboard_insights(crowd_data: list[dict]) -> dict:
    """Generate organizer-level strategic insights."""
    fallback = {
        "crowd_distribution_analysis": "AI unavailable.",
        "gate_optimization": [],
        "staff_allocation": [],
        "transport_recommendations": [],
        "stadium_health_summary": "Configure GEMINI_API_KEY.",
        "decision_support": "No immediate decisions required (AI unavailable).",
    }
    if not _get_client():
        return fallback

    try:
        prompt = ORGANIZER_DASHBOARD_PROMPT.format(crowd_json=json.dumps(crowd_data, indent=2))
        raw = await _call_gemini({
            "model": settings.gemini_model,
            "contents": prompt,
            "config": types.GenerateContentConfig(temperature=0.3, max_output_tokens=1200),
        })
        raw = _extract_json(raw)
        return json.loads(raw)
    except TimeoutError:
        return {**fallback, "crowd_distribution_analysis": "AI timed out. Please refresh."}
    except Exception as exc:
        logger.error("Organizer dashboard error: %s", exc)
        return fallback


def _placeholder_response(message: str, user_role: str, language: str) -> str:
    """Friendly placeholder when Gemini API key is not configured."""
    return (
        f"[Demo Mode - No API Key] Hello! I'm StadiumPilot AI, your {user_role} assistant "
        f"for FIFA World Cup 2026. You asked: '{message}'. "
        "To enable full AI responses, please set your GEMINI_API_KEY in the .env file."
    )
