"""Tests for the chat API endpoints."""
import pytest


@pytest.mark.asyncio
async def test_chat_fan(client):
    """Fan chat should return a reply (may be placeholder without API key)."""
    payload = {
        "session_id": "test-session-fan-001",
        "message": "Where is the nearest restroom?",
        "user_role": "fan",
        "language": "en",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 0
    assert data["session_id"] == payload["session_id"]
    assert "suggested_actions" in data
    assert isinstance(data["suggested_actions"], list)


@pytest.mark.asyncio
async def test_chat_volunteer(client):
    """Volunteer chat should return protocol-oriented response."""
    payload = {
        "session_id": "test-session-vol-001",
        "message": "I found a lost child at Gate B",
        "user_role": "volunteer",
        "language": "en",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data


@pytest.mark.asyncio
async def test_chat_staff(client):
    """Staff chat should return operations-oriented response."""
    payload = {
        "session_id": "test-session-staff-001",
        "message": "Which zones need attention?",
        "user_role": "staff",
        "language": "en",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data


@pytest.mark.asyncio
async def test_chat_organizer(client):
    """Organizer chat should return strategic response."""
    payload = {
        "session_id": "test-session-org-001",
        "message": "What are the top decisions I need to make?",
        "user_role": "organizer",
        "language": "en",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data


@pytest.mark.asyncio
async def test_chat_with_history(client):
    """Chat with conversation history should succeed."""
    payload = {
        "session_id": "test-session-hist-001",
        "message": "What about parking?",
        "user_role": "fan",
        "language": "en",
        "history": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi! How can I help you today?"},
        ],
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_chat_with_location(client):
    """Chat with location context should succeed."""
    payload = {
        "session_id": "test-session-loc-001",
        "message": "Where is the nearest food court?",
        "user_role": "fan",
        "language": "en",
        "location": "Section 101, Row 5",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_chat_empty_message(client):
    """Empty message should be rejected with 422."""
    payload = {
        "session_id": "test-session-empty",
        "message": "",
        "user_role": "fan",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_whitespace_only_message(client):
    """Whitespace-only message should be rejected with 422."""
    payload = {
        "session_id": "test-session-ws",
        "message": "   ",
        "user_role": "fan",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_invalid_role(client):
    """Invalid user_role should be rejected with 422."""
    payload = {
        "session_id": "test-invalid-role",
        "message": "Hello",
        "user_role": "hacker",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_invalid_session_id(client):
    """Session ID with special characters should be rejected."""
    payload = {
        "session_id": "session/../../../etc/passwd",
        "message": "Hello",
        "user_role": "fan",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_message_too_long(client):
    """Message over 2000 characters should be rejected."""
    payload = {
        "session_id": "test-too-long",
        "message": "A" * 2001,
        "user_role": "fan",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_chat_history_retrieval(client):
    """Chat history should be stored and retrievable."""
    session_id = "test-hist-retrieve-001"
    await client.post(
        "/api/v1/chat/",
        json={"session_id": session_id, "message": "Hello", "user_role": "fan"},
    )
    response = await client.get(f"/api/v1/chat/history/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  # user message + assistant reply


@pytest.mark.asyncio
async def test_chat_history_empty_session(client):
    """History for unknown session should return empty list."""
    response = await client.get("/api/v1/chat/history/nonexistent-session-xyz")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 0


@pytest.mark.asyncio
async def test_chat_multilingual_spanish(client):
    """Spanish language should be accepted."""
    payload = {
        "session_id": "test-es-001",
        "message": "¿Dónde están los baños?",
        "user_role": "fan",
        "language": "es",
    }
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "es"


@pytest.mark.asyncio
async def test_chat_auth_enforcement_in_production(client, monkeypatch):
    """Chat should require valid X-API-Key in production."""
    from app.config import get_settings
    settings = get_settings()
    
    # Mock production environment
    monkeypatch.setattr(settings, "environment", "production")
    monkeypatch.setattr(settings, "secret_key", "secure-prod-key")

    payload = {
        "session_id": "test-auth",
        "message": "Hello",
        "user_role": "fan",
    }
    
    # 1. No auth -> 401
    response = await client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 401
    
    # 2. Invalid auth -> 401
    response = await client.post(
        "/api/v1/chat/", 
        json=payload, 
        headers={"X-API-Key": "wrong-key"}
    )
    assert response.status_code == 401
    
    # 3. Valid auth -> 200
    response = await client.post(
        "/api/v1/chat/", 
        json=payload, 
        headers={"X-API-Key": "secure-prod-key"}
    )
    assert response.status_code == 200
