from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..core.auth import get_current_active_user

PUBLIC_PATHS = [
    "/api/v0/auth/dev-token",
    "/api/v0/auth/login",
    "/api/v0/auth/refresh",
    "/api/v0/users/signup",
    "/api/v0/auth/google/login",
    "/api/v0/auth/callback",
    "/docs",
    "/redoc",
    "/openapi.json",
]

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v0/auth/login",
    auto_error=True
)

class AuthMiddleware:
    def __init__(self, public_paths: List[str] = None):
        self.public_paths = public_paths if public_paths is not None else PUBLIC_PATHS

    def __call__(self, path: str):
        if path in self.public_paths:
            return None

        # Protected routes - strict auth required
        return Depends(get_current_active_user)