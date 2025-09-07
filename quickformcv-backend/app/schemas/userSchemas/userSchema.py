from datetime import datetime
from typing import Optional, Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    subscription_tier: Literal["free", "pro", "premium"] = "free"


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    subscription_tier: Optional[Literal["free", "pro", "premium"]] = None
    subscription_status: Optional[Literal["active", "cancelled", "expired", "suspended"]] = None


class UserInDBBase(UserBase):
    id: UUID
    is_active: bool
    is_verified: bool
    subscription_tier: str
    subscription_status: str
    monthly_ai_credits_used: int
    monthly_job_searches_used: int
    last_reset_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class User(UserInDBBase):
    """Return to client"""
    pass


class UserInDB(UserInDBBase):
    """Internal use with hashed password"""
    hashed_password: str


class SubscriptionInfo(BaseModel):
    tier: Literal["free", "pro", "premium"]
    status: Literal["active", "cancelled", "expired", "suspended"]
    ai_credits_used: int
    ai_credits_limit: int
    job_searches_used: int
    job_searches_limit: int
    days_until_reset: int
    can_use_ai: bool
    can_search_jobs: bool


class SubscriptionLimits(BaseModel):
    max_resumes: int
    monthly_ai_credits: int
    monthly_job_searches: int
    job_results_visibility: float  # 0.0 to 1.0 (percentage visible)


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