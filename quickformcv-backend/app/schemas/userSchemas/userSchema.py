from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)


class UserInDBBase(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDBBase):
    """Return to client"""


class UserInDB(UserInDBBase):
    """Internal use with hashed password"""

    hashed_password: str


class TokenPayload(BaseModel):
    sub: UUID  # user_id
    exp: datetime
    iat: Optional[datetime] = None
    type: str = "access"


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: Optional[str] = None
    expires_in: int  # seconds


class RefreshTokenCreate(BaseModel):
    token: str
    expires_at: datetime
    user_id: UUID


class LoginHistory(BaseModel):
    id: UUID
    login_timestamp: datetime
    ip_address: Optional[str]
    user_agent: Optional[str]
    user_id: UUID

    class Config:
        from_attributes = True
