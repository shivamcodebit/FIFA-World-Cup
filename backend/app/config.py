"""
Application configuration using Pydantic Settings.
All secrets must be provided via environment variables – never hardcoded.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application settings loaded from environment variables."""

    # General
    app_title: str = "StadiumPilot AI"
    app_version: str = "1.0.0"
    environment: str = "development"
    log_level: str = "INFO"

    # Security
    secret_key: str = "changeme-in-production"
    allowed_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Database
    database_url: str = "sqlite+aiosqlite:///./stadiumPilot.db"

    # AI
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    gemini_max_tokens: int = 2048
    gemini_temperature: float = 0.7

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return a cached singleton Settings instance."""
    return Settings()
