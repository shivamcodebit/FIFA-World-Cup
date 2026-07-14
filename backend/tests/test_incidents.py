"""Tests for the incidents API endpoints."""
import pytest


@pytest.mark.asyncio
async def test_create_incident(client):
    payload = {
        "type": "medical",
        "location": "Section 101, Row 5",
        "description": "Fan feeling unwell, possible heat exhaustion",
        "reporter_role": "volunteer",
    }
    response = await client.post("/api/v1/incidents/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == "medical"
    assert data["location"] == payload["location"]
    assert data["status"] == "open"
    assert "id" in data


@pytest.mark.asyncio
async def test_list_incidents(client):
    # Create one first
    payload = {
        "type": "security",
        "location": "Gate A",
        "description": "Minor disturbance at entrance",
        "reporter_role": "staff",
    }
    await client.post("/api/v1/incidents/", json=payload)

    response = await client.get("/api/v1/incidents/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_get_incident_by_id(client):
    payload = {
        "type": "lost_child",
        "location": "North Concourse",
        "description": "Child separated from parents",
        "reporter_role": "volunteer",
    }
    create_resp = await client.post("/api/v1/incidents/", json=payload)
    incident_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/incidents/{incident_id}")
    assert response.status_code == 200
    assert response.json()["id"] == incident_id


@pytest.mark.asyncio
async def test_update_incident_status(client):
    payload = {
        "type": "fire",
        "location": "Storage Room B",
        "description": "Smoke detected near storage area",
        "reporter_role": "staff",
    }
    create_resp = await client.post("/api/v1/incidents/", json=payload)
    incident_id = create_resp.json()["id"]

    update_resp = await client.patch(
        f"/api/v1/incidents/{incident_id}",
        json={"status": "resolved"},
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["status"] == "resolved"


@pytest.mark.asyncio
async def test_get_nonexistent_incident(client):
    response = await client.get("/api/v1/incidents/99999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_invalid_incident_type(client):
    payload = {
        "type": "invalid_type",
        "location": "Somewhere",
        "description": "Test",
        "reporter_role": "volunteer",
    }
    response = await client.post("/api/v1/incidents/", json=payload)
    assert response.status_code == 422
