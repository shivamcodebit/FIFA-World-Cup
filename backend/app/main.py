"""
StadiumPilot AI – FastAPI Application Entry Point

Configures the application, middleware, routes, and startup events.
"""
import logging
import warnings
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import get_settings
from app.database import create_tables
from app.api import chat, incidents, crowd, dashboard

# ──────────────────────────────────────────────
# Logging Configuration
# ──────────────────────────────────────────────
settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s | %(levelname)-8s | %(name)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────
# Security Headers Middleware
# ──────────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds OWASP-recommended security headers to all responses."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(self)"
        )
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https://*.tile.openstreetmap.org; "
            "connect-src 'self' http://localhost:8000"
        )
        if settings.environment == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


# ──────────────────────────────────────────────
# Environment Validation
# ──────────────────────────────────────────────
def _validate_environment() -> None:
    """Warn or raise on insecure configuration."""
    if settings.environment == "production":
        _insecure_keys = {"changeme-in-production", "your_secret_key_here", "secret", "changeme"}
        if settings.secret_key in _insecure_keys or len(settings.secret_key) < 16:
            raise ValueError(
                "SECURITY ERROR: SECRET_KEY must be set to a strong random value in production. "
                "Generate one with: python -c \"import secrets; print(secrets.token_hex(32))\""
            )
        if not settings.gemini_api_key:
            warnings.warn(
                "GEMINI_API_KEY is not set. AI features will be disabled.",
                UserWarning,
                stacklevel=2,
            )
    else:
        _insecure_keys = {"changeme-in-production", "your_secret_key_here", "secret", "changeme"}
        if settings.secret_key in _insecure_keys:
            logger.warning(
                "⚠️  SECRET_KEY is using an insecure default value. "
                "Set a strong SECRET_KEY before deploying to production."
            )
        if not settings.gemini_api_key:
            logger.warning(
                "⚠️  GEMINI_API_KEY is not set. Running in Demo Mode with placeholder responses."
            )


# ──────────────────────────────────────────────
# Lifespan (modern FastAPI startup/shutdown)
# ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize resources on startup, clean up on shutdown."""
    _validate_environment()
    logger.info("Starting %s v%s", settings.app_title, settings.app_version)
    await create_tables()
    logger.info("Database tables created/verified.")
    yield
    logger.info("Shutting down %s", settings.app_title)


# ──────────────────────────────────────────────
# FastAPI Application
# ──────────────────────────────────────────────
app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    description=(
        "StadiumPilot AI - GenAI Smart Stadium Copilot for FIFA World Cup 2026. "
        "Powered by Google Gemini 2.0 Flash. "
        "Provides role-specific AI assistance for fans, volunteers, staff, and organizers."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    contact={
        "name": "StadiumPilot AI Team",
        "url": "https://github.com/your-username/stadiumPilot-ai",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# ──────────────────────────────────────────────
# Rate Limiting
# ──────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ──────────────────────────────────────────────
# Middleware (order matters – outermost first)
# ──────────────────────────────────────────────
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
)

# ──────────────────────────────────────────────
# Route Registration
# ──────────────────────────────────────────────
app.include_router(chat.router, prefix="/api/v1")
app.include_router(incidents.router, prefix="/api/v1")
app.include_router(crowd.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


# ──────────────────────────────────────────────
# Global Exception Handler
# ──────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Prevent leaking internal error details in production."""
    logger.error("Unhandled exception on %s %s: %s", request.method, request.url, exc)
    if settings.environment == "production":
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal error occurred. Please try again later."},
        )
    raise exc


# ──────────────────────────────────────────────
# Health Check
# ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check endpoint for load balancers and monitoring."""
    return {
        "status": "healthy",
        "app": settings.app_title,
        "version": settings.app_version,
        "environment": settings.environment,
        "ai_enabled": bool(settings.gemini_api_key),
        "ai_model": settings.gemini_model if settings.gemini_api_key else "demo-mode",
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API info."""
    return {
        "message": "Welcome to StadiumPilot AI API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
        "version": settings.app_version,
        "ai_powered": bool(settings.gemini_api_key),
    }
