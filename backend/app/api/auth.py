from fastapi import Header, HTTPException, status, Security
from fastapi.security import APIKeyHeader
from app.config import get_settings

API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def verify_api_key(
    x_api_key: str | None = Security(api_key_header),
    authorization: str | None = Header(default=None)
):
    settings = get_settings()
    # In development/demo modes with default/placeholder keys, bypass verification
    # to maintain backward compatibility for standard local developer/testing setups.
    if settings.environment == "production" or settings.secret_key not in {"changeme-in-production", "your_secret_key_here"}:
        expected_key = settings.secret_key
        
        token = x_api_key
        if not token and authorization and authorization.startswith("Bearer "):
            token = authorization.split(" ")[1]
            
        if not token or token != expected_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or missing API key"
            )
