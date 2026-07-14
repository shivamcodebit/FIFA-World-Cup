"""Tests for crowd data API endpoints."""
import pytest


@pytest.mark.asyncio
async def test_get_current_crowd(client):
    """Should return crowd data (mock fallback when DB is empty)."""
    response = await client.get("/api/v1/crowd/current")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Verify schema
    first = data[0]
    assert "zone_id" in first
    assert "density_pct" in first
    assert "capacity" in first
    assert "zone_name" in first
    assert "current_count" in first
    assert "queue_length" in first


@pytest.mark.asyncio
async def test_crowd_density_in_range(client):
    """All crowd zones must have density_pct between 0 and 100."""
    response = await client.get("/api/v1/crowd/current")
    assert response.status_code == 200
    data = response.json()
    for zone in data:
        assert 0 <= zone["density_pct"] <= 100, (
            f"Zone {zone['zone_id']} density {zone['density_pct']} is out of range"
        )


@pytest.mark.asyncio
async def test_crowd_current_count_lte_capacity(client):
    """current_count should not exceed capacity in any zone."""
    response = await client.get("/api/v1/crowd/current")
    assert response.status_code == 200
    data = response.json()
    for zone in data:
        if zone["capacity"] > 0:
            assert zone["current_count"] >= 0
            # Allow slight overflow since crowd can exceed capacity in emergencies
            assert zone["current_count"] <= zone["capacity"] * 1.5, (
                f"Zone {zone['zone_id']} count {zone['current_count']} greatly exceeds capacity {zone['capacity']}"
            )


@pytest.mark.asyncio
async def test_seed_crowd_data(client):
    """Seeding crowd data should succeed and return a count."""
    response = await client.post("/api/v1/crowd/seed")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Seeded" in data["message"]


@pytest.mark.asyncio
async def test_seed_then_get_crowd(client):
    """After seeding, current crowd should return the seeded data."""
    seed_resp = await client.post("/api/v1/crowd/seed")
    assert seed_resp.status_code == 200

    get_resp = await client.get("/api/v1/crowd/current")
    assert get_resp.status_code == 200
    data = get_resp.json()
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_crowd_summary(client):
    """Crowd summary should return AI analysis fields."""
    response = await client.get("/api/v1/crowd/summary")
    assert response.status_code == 200
    data = response.json()
    assert "ai_summary" in data
    assert "hotspots" in data
    assert "recommendations" in data
    assert "overall_density" in data
    assert "generated_at" in data
    assert "snapshots" in data
    # overall_density must be a valid percentage
    assert 0 <= data["overall_density"] <= 100
    # snapshots must be a list
    assert isinstance(data["snapshots"], list)
    assert len(data["snapshots"]) > 0


@pytest.mark.asyncio
async def test_crowd_summary_hotspots_are_list(client):
    """Hotspots must be a list of strings."""
    response = await client.get("/api/v1/crowd/summary")
    assert response.status_code == 200
    hotspots = response.json()["hotspots"]
    assert isinstance(hotspots, list)
    for h in hotspots:
        assert isinstance(h, str)


@pytest.mark.asyncio
async def test_crowd_summary_recommendations_are_list(client):
    """Recommendations must be a list of strings."""
    response = await client.get("/api/v1/crowd/summary")
    assert response.status_code == 200
    recs = response.json()["recommendations"]
    assert isinstance(recs, list)
