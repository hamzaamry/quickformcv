import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import Uuid

from ..base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    google_id = Column(String, unique=True, nullable=True)
    auth_provider = Column(String, default="email")
    hashed_password = Column(String, nullable=False)
    username = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    login_history = relationship("UserLoginHistory", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    token = Column(String, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)

    # Foreign key to user
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="refresh_tokens")


class UserLoginHistory(Base):
    __tablename__ = "user_login_history"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    login_timestamp = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String)
    user_agent = Column(String)

    # Foreign key to user
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="login_history")
