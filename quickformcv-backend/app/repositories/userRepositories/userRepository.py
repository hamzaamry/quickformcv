from datetime import datetime, timezone, timedelta
from typing import List, Optional
from uuid import UUID

from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.userModels.userModel import User, RefreshToken, UserLoginHistory
from app.models.userModels.resumeModel import Resume
from app.schemas.userSchemas.userSchema import UserCreate, UserInDB, UserUpdate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_create: UserCreate) -> UserInDB:
        """
        Create a new user
        """
        db_user = User(
            email=user_create.email,
            hashed_password=get_password_hash(user_create.password),
            username=user_create.username,
            is_active=True,
            is_verified=False,
            subscription_tier=user_create.subscription_tier,
            subscription_status="active",
            monthly_ai_credits_used=0,
            monthly_job_searches_used=0,
            last_reset_date=datetime.utcnow()
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[UserInDB]:
        """
        Get all users with pagination
        """
        return (
            self.db.query(User)
            .filter(User.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, user_id: UUID) -> Optional[UserInDB]:
        """
        Get user by ID
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[UserInDB]:
        """
        Get user by email
        """
        return self.db.query(User).filter(User.email == email).first()

    def update(self, user_id: UUID, user_update: UserUpdate) -> Optional[UserInDB]:
        """
        Update user details
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        update_data = user_update.model_dump(exclude_unset=True)

        # Hash new password if provided
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        for field, value in update_data.items():
            setattr(db_user, field, value)

        db_user.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update_subscription(self, user_id: UUID, tier: str, status: str = "active") -> Optional[UserInDB]:
        """
        Update user's subscription tier and status
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        db_user.subscription_tier = tier
        db_user.subscription_status = status
        db_user.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def reset_monthly_usage(self, user_id: UUID) -> Optional[UserInDB]:
        """
        Reset monthly usage counters
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        db_user.monthly_ai_credits_used = 0
        db_user.monthly_job_searches_used = 0
        db_user.last_reset_date = datetime.utcnow()
        db_user.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def increment_ai_usage(self, user_id: UUID) -> Optional[UserInDB]:
        """
        Increment AI credits used
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        db_user.monthly_ai_credits_used += 1
        db_user.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def increment_job_search_usage(self, user_id: UUID) -> Optional[UserInDB]:
        """
        Increment job searches used
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return None

        db_user.monthly_job_searches_used += 1
        db_user.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_users_by_subscription_tier(self, tier: str) -> List[UserInDB]:
        """
        Get all users with a specific subscription tier
        """
        return (
            self.db.query(User)
            .filter(User.subscription_tier == tier, User.is_active == True)
            .all()
        )

    def get_users_needing_reset(self) -> List[UserInDB]:
        """
        Get users whose monthly usage should be reset (30+ days since last reset)
        """
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        return (
            self.db.query(User)
            .filter(
                User.last_reset_date <= thirty_days_ago,
                User.is_active == True
            )
            .all()
        )

    def get_user_resume_count(self, user_id: UUID) -> int:
        """
        Get the count of resumes for a specific user
        """
        return self.db.query(func.count(Resume.id)).filter(
            Resume.user_id == user_id
        ).scalar() or 0

    def get_user_with_resume_count(self, user_id: UUID) -> Optional[tuple]:
        """
        Get user along with their resume count in a single query
        """
        result = self.db.query(
            User,
            func.count(Resume.id).label('resume_count')
        ).outerjoin(
            Resume, User.id == Resume.user_id
        ).filter(
            User.id == user_id
        ).group_by(User.id).first()

        return result if result else None

    def get_users_with_resume_counts(self, skip: int = 0, limit: int = 100) -> List[tuple]:
        """
        Get all users with their resume counts
        """
        return (
            self.db.query(
                User,
                func.count(Resume.id).label('resume_count')
            )
            .outerjoin(Resume, User.id == Resume.user_id)
            .filter(User.is_active == True)
            .group_by(User.id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_subscription_usage_stats(self, user_id: UUID) -> Optional[dict]:
        """
        Get comprehensive subscription usage statistics for a user
        """
        user_result = self.get_user_with_resume_count(user_id)
        if not user_result:
            return None

        user, resume_count = user_result

        return {
            "user_id": user.id,
            "subscription_tier": user.subscription_tier,
            "subscription_status": user.subscription_status,
            "resume_count": resume_count,
            "monthly_ai_credits_used": user.monthly_ai_credits_used,
            "monthly_job_searches_used": user.monthly_job_searches_used,
            "last_reset_date": user.last_reset_date
        }

    def deactivate(self, user_id: UUID) -> bool:
        """
        Delete user (soft delete by setting is_active to False)
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False

        db_user.is_active = False
        db_user.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

    def delete(self, user_id: UUID) -> bool:
        """
        Permanently delete user and all related data
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False

        # Delete the user
        self.db.delete(db_user)
        self.db.commit()
        return True

    def verify_email(self, user_id: UUID) -> bool:
        """
        Mark user's email as verified
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False

        db_user.is_verified = True
        db_user.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

    def create_refresh_token(self, user_id: UUID, token: str, expires_at: datetime) -> RefreshToken:
        """
        Create a new refresh token for user
        """
        db_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
        self.db.add(db_token)
        self.db.commit()
        self.db.refresh(db_token)
        return db_token

    def revoke_refresh_token(self, user_id: UUID):
        """
        Revoke active refresh tokens for a user
        """
        try:
            # Find and revoke all active refresh tokens for the user
            revoked_tokens = self.db.query(RefreshToken).filter(
                and_(
                    RefreshToken.user_id == user_id,
                    RefreshToken.revoked == False
                )
            ).update({RefreshToken.revoked: True}, synchronize_session=False)

            self.db.commit()
            return revoked_tokens
        except Exception as e:
            self.db.rollback()
            raise e

    def log_login_attempt(self, user_id: UUID, ip_address: str, user_agent: str) -> UserLoginHistory:
        """
        Log a login attempt
        """
        login_record = UserLoginHistory(user_id=user_id, ip_address=ip_address, user_agent=user_agent)
        self.db.add(login_record)
        self.db.commit()
        self.db.refresh(login_record)
        return login_record

    def get_login_history(self, user_id: UUID, limit: int = 10) -> List[UserLoginHistory]:
        """
        Get user's login history
        """
        return (
            self.db.query(UserLoginHistory)
            .filter(UserLoginHistory.user_id == user_id)
            .order_by(UserLoginHistory.login_timestamp.desc())
            .limit(limit)
            .all()
        )

    def search_users(self, query: str, limit: int = 10) -> List[UserInDB]:
        """
        Search users by email or full name
        """
        return (
            self.db.query(User)
            .filter(or_(User.email.ilike(f"%{query}%"), User.username.ilike(f"%{query}%")), User.is_active == True)
            .limit(limit)
            .all()
        )

    def change_password(self, user_id: UUID, new_password: str) -> bool:
        """
        Change user's password
        """
        db_user = self.get_by_id(user_id)
        if not db_user:
            return False

        db_user.hashed_password = get_password_hash(new_password)
        db_user.updated_at = datetime.now(timezone.utc)
        self.db.commit()
        return True

    def create_google_user(self, email: str, username: str, google_id: str) -> UserInDB:
        """
        Create a new user from Google OAuth
        """
        db_user = User(
            email=email,
            username=username,
            google_id=google_id,
            auth_provider="google",
            hashed_password="",
            is_active=True,
            is_verified=True,
            subscription_tier="free",
            subscription_status="active",
            monthly_ai_credits_used=0,
            monthly_job_searches_used=0,
            last_reset_date=datetime.utcnow()
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user