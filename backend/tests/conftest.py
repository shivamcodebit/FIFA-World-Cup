"""
Pytest configuration and fixtures for StadiumPilot AI backend tests.

Key design decisions:
- All tests use in-memory SQLite to isolate from production DB
- AI service is mocked to avoid real Gemini API calls in CI
- Each test gets a fresh DB (autouse setup_database fixture)
"""
import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from unittest.mock import AsyncMock, patch

from app.main import app
from app.database import Base, get_db

# Use in-memory SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestAsyncSession = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


async def override_get_db():
    async with TestAsyncSession() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_database():
    """Create tables before each test and drop after."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    """
    Async test client with:
    - In-memory SQLite DB override
    - Mocked AI service (no real Gemini API calls)
    """
    app.dependency_overrides[get_db] = override_get_db

    # Mock AI service calls to prevent network requests in tests.
    # Tests focus on API contract/structure, not AI response content.
    with (
        patch(
            "app.services.ai_service.chat_with_ai",
            return_value=(
                "[TEST] This is a mock AI response for testing purposes.",
                ["Action 1", "Action 2", "Action 3"],
            ),
        ),
        patch(
            "app.services.ai_service.generate_crowd_summary",
            return_value=(
                "[TEST] Crowd is at normal levels.",
                ["Zone A", "Zone B"],
                ["Open Gate 3", "Deploy staff to Section 101"],
            ),
        ),
        patch(
            "app.services.ai_service.generate_staff_dashboard_insights",
            return_value={
                "crowd_summary": "[TEST] Crowd levels are normal across all zones.",
                "cleaning_priorities": ["Section 101", "Food Court A"],
                "water_refill_alerts": ["Gate B water station low"],
                "security_alerts": ["No active alerts"],
                "ai_insights": "[TEST] All systems operating normally.",
            },
        ),
        patch(
            "app.services.ai_service.generate_organizer_dashboard_insights",
            return_value={
                "crowd_distribution_analysis": "[TEST] Distribution is even across zones.",
                "gate_optimization": ["Open Gate 5", "Close Gate 2"],
                "staff_allocation": ["Deploy 5 staff to North Concourse"],
                "transport_recommendations": ["Dispatch shuttle bus 3"],
                "stadium_health_summary": "[TEST] Stadium is operating at optimal capacity.",
                "decision_support": "[TEST] No immediate decisions required.",
            },
        ),
        patch(
            "app.services.ai_service.generate_incident_summary",
            return_value="[TEST] Incident reported and being handled by security team.",
        ),
    ):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            yield ac

    app.dependency_overrides.clear()
