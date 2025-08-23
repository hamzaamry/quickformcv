import os
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel
from typing import Optional
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from uuid import uuid4

from ....Database import get_db
from ....core.auth import get_current_active_user
from ....core.security import *
from ....repositories.userRepositories.userRepository import UserRepository
from ....schemas.userSchemas.userSchema import Token, User, UserInDB

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v0/auth/login")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

class RefreshTokenRequest(BaseModel):
    refresh_token: str

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=Token)
async def login(
        request: Request,
        login_data: LoginRequest,
        db: Session = Depends(get_db)
) -> Token:
    """Login endpoint that returns access and refresh tokens"""
    user_repo = UserRepository(db)
    user = user_repo.get_by_email(login_data.email)

    if not user or not verify_password(login_data.password, user.hashed_password or ""):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    access_token_expires = timedelta(days=30 if login_data.remember_me else 1)
    refresh_token_expires = timedelta(days=60 if login_data.remember_me else 7)

    access_token = create_access_token(
        data={"sub": str(user.id), "remember_me": login_data.remember_me},
        expires_delta=access_token_expires
    )

    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "remember_me": login_data.remember_me},
        expires_delta=refresh_token_expires
    )

    user_repo.log_login_attempt(
        user.id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=int(access_token_expires.total_seconds())
    )
@router.post("/refresh", response_model=Token)
async def refresh_token(
        request: Request,
        refresh_data: RefreshTokenRequest,
        db: Session = Depends(get_db)
) -> Token:
    """Create new access token using refresh token"""
    payload = verify_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(UUID(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.get("/me", response_model=User)
async def get_me(
        current_user: UserInDB = Depends(get_current_active_user)
) -> User:
    """Get current authenticated user information"""
    return current_user

@router.post("/logout")
async def logout(
        current_user: UserInDB = Depends(get_current_active_user),
        db: Session = Depends(get_db)
):
    """Logout endpoint - invalidate refresh token"""
    user_repo = UserRepository(db)
    user_repo.revoke_refresh_token(current_user.id)
    return {"message": "Successfully logged out"}

@router.post("/dev-token", include_in_schema=False)
async def create_development_token(
        request: Request,
) -> dict:
    """Create a development token with 30 days expiration (for testing purposes only)"""
    if not any(addr in ["127.0.0.1", "localhost"] for addr in [request.client.host]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This endpoint is only available in development environment"
        )
    dev_token = create_dev_token()
    return {
        "access_token": dev_token,
        "token_type": "bearer",
        "expires_in": 30 * 24 * 60 * 60  # 30 days in seconds
    }

@router.get("/google/login")
async def google_login():
    return {
        "authorization_url": f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid email profile"
    }

@router.get("/callback")
async def google_callback(
        request: Request,
        code: str,
        db: Session = Depends(get_db)
):
    """Handle Google OAuth2 callback"""
    try:
        token_url = "https://oauth2.googleapis.com/token"
        data = {
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code"
        }

        response = requests.post(token_url, data=data)

        if not response.ok:
            raise HTTPException(
                status_code=400,
                detail=f"Failed to get token: {response.text}"
            )

        tokens = response.json()

        try:
            id_info = id_token.verify_oauth2_token(
                tokens["id_token"],
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid token: {str(e)}")

        user_repo = UserRepository(db)
        user = user_repo.get_by_email(id_info["email"])

        if not user:
            try:
                user = user_repo.create_google_user(
                    email=id_info["email"],
                    username=id_info.get("name", id_info["email"].split("@")[0]),
                    google_id=id_info["sub"]
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        user_repo.log_login_attempt(
            user.id,
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )

        from fastapi.responses import RedirectResponse
        frontend_url = f"{FRONTEND_URL}/resumes?access_token={access_token}&refresh_token={refresh_token}"
        return RedirectResponse(url=frontend_url)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )