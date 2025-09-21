from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..Database import get_db
from app.repositories.userRepository import UserRepository
from app.schemas.userSchema import UserInDB
from .security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v0/auth/login")

async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
) -> UserInDB:
    """Dependency to get the current authenticated user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verify_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    # If the user is a dev, return a mock dev user that matches UserInDB structure
    if user_id == "dev":
        return UserInDB(
            id=UUID('00000000-0000-0000-0000-000000000000'),  # dummy UUID for dev
            email="dev@example.com",
            hashed_password="",
            first_name="Dev",
            last_name="User",
            is_active=True,
            is_verified=True,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )

    if payload.get("type") != "access":
        raise credentials_exception

    user_repo = UserRepository(db)
    try:
        user = user_repo.get_by_id(UUID(user_id))
    except ValueError:
        raise credentials_exception

    if user is None:
        raise credentials_exception

    return user

async def get_current_active_user(
        current_user: UserInDB = Depends(get_current_user)
) -> UserInDB:
    """Dependency to ensure the user is active"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user