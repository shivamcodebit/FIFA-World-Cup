"""Tests for the dashboard API endpoints (staff and organizer)."""
import pytest


@pytest.mark.asyncio
async def test_staff_dashboard_returns_data(client):
    """Staff dashboard should return zones, crowd summary, and alert lists."""
    response = await client.get("/api/v1/dashboard/staff")
    assert response.status_code == 200
    data = response.json()

    # Required top-level keys
    assert "zones" in data
    assert "crowd_summary" in data
    assert "cleaning_priorities" in data
    assert "water_refill_alerts" in data
    assert "security_alerts" in data
    assert "ai_insights" in data

    # Zones should be a list
    assert isinstance(data["zones"], list)
    assert len(data["zones"]) > 0

    # Cleaning priorities, water alerts, security alerts are lists
    assert isinstance(data["cleaning_priorities"], list)
    assert isinstance(data["water_refill_alerts"], list)
    assert isinstance(data["security_alerts"], list)


@pytest.mark.asyncio
async def test_staff_dashboard_zone_structure(client):
    """Each zone in staff dashboard must have expected fields."""
    response = await client.get("/api/v1/dashboard/staff")
    assert response.status_code == 200
    zones = response.json()["zones"]

    for zone in zones:
        assert "zone_id" in zone
        assert "zone_name" in zone
        assert "density_pct" in zone
        assert "queue_length" in zone
        assert "alert_level" in zone
        # alert_level must be one of green/yellow/red
        assert zone["alert_level"] in ("green", "yellow", "red")
        # density_pct must be 0–100
        assert 0 <= zone["density_pct"] <= 100


@pytest.mark.asyncio
async def test_staff_dashboard_alert_levels_correct(client):
    """Zone alert levels must correspond to density thresholds."""
    response = await client.get("/api/v1/dashboard/staff")
    assert response.status_code == 200
    zones = response.json()["zones"]

    for zone in zones:
        density = zone["density_pct"]
        alert = zone["alert_level"]
        if density >= 85:
            assert alert == "red", f"Zone {zone['zone_id']} at {density}% should be red"
        elif density >= 65:
            assert alert == "yellow", f"Zone {zone['zone_id']} at {density}% should be yellow"
        else:
            assert alert == "green", f"Zone {zone['zone_id']} at {density}% should be green"


@pytest.mark.asyncio
async def test_organizer_dashboard_returns_data(client):
    """Organizer dashboard should return strategic AI insights."""
    response = await client.get("/api/v1/dashboard/organizer")
    assert response.status_code == 200
    data = response.json()

    # Required top-level keys
    assert "zones" in data
    assert "crowd_distribution_analysis" in data
    assert "gate_optimization" in data
    assert "staff_allocation" in data
    assert "transport_recommendations" in data
    assert "stadium_health_summary" in data
    assert "decision_support" in data

    # Lists must be lists
    assert isinstance(data["gate_optimization"], list)
    assert isinstance(data["staff_allocation"], list)
    assert isinstance(data["transport_recommendations"], list)


@pytest.mark.asyncio
async def test_organizer_dashboard_zone_structure(client):
    """Organizer dashboard zones must have expected fields."""
    response = await client.get("/api/v1/dashboard/organizer")
    assert response.status_code == 200
    zones = response.json()["zones"]

    assert len(zones) > 0
    for zone in zones:
        assert "zone_id" in zone
        assert "zone_name" in zone
        assert "density_pct" in zone
        assert "queue_length" in zone
        assert "alert_level" in zone


@pytest.mark.asyncio
async def test_staff_crowd_summary_non_empty(client):
    """Staff crowd_summary should be a non-empty string."""
    response = await client.get("/api/v1/dashboard/staff")
    assert response.status_code == 200
    crowd_summary = response.json()["crowd_summary"]
    assert isinstance(crowd_summary, str)
    assert len(crowd_summary) > 0


@pytest.mark.asyncio
async def test_organizer_decision_support_non_empty(client):
    """Organizer decision_support should be a non-empty string."""
    response = await client.get("/api/v1/dashboard/organizer")
    assert response.status_code == 200
    decision_support = response.json()["decision_support"]
    assert isinstance(decision_support, str)
    assert len(decision_support) > 0
