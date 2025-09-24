from datetime import datetime, timedelta
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.userRepository import UserRepository
from app.repositories.ResumeRepositories import ResumeRepository
from app.schemas.userSchema import SubscriptionLimits


class SubscriptionService:
    """Service to manage user subscriptions and enforce limits"""

    SUBSCRIPTION_LIMITS = {
        "free": SubscriptionLimits(
            max_resumes=3,
            monthly_ai_credits=3,
            monthly_job_searches=3,
            job_results_visibility=0.1  # Only first 10% of results visible
        ),
        "pro": SubscriptionLimits(
            max_resumes=-1,  # Unlimited
            monthly_ai_credits=-1,  # Unlimited
            monthly_job_searches=12,  # 3 per week * 4 weeks
            job_results_visibility=0.7  # 70% of results visible
        ),
        "premium": SubscriptionLimits(
            max_resumes=-1,  # Unlimited
            monthly_ai_credits=-1,  # Unlimited
            monthly_job_searches=15,  # avg 3 calls per week ( since results for the past 3 days )
            job_results_visibility=1.0  # 100% of results visible
        )
    }

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.db = db

    def get_subscription_status(self, user_id: UUID) -> dict:
        """Get complete subscription status with usage, limits, and permissions"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Reset usage if needed
        self._reset_monthly_usage_if_needed(user)

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        resume_count = self.resume_repo.get_user_resume_count(user_id)

        # Calculate remaining days
        next_reset = user.last_reset_date + timedelta(days=30)
        days_until_reset = max(0, (next_reset - datetime.utcnow()).days)

        return {
            "subscription": {
                "tier": user.subscription_tier,
                "status": user.subscription_status,
                "days_until_reset": days_until_reset
            },
            "usage": self._build_usage_data(user, limits, resume_count),
            "permissions": self._build_permissions(user, limits, resume_count),
            "warnings": self._build_warnings(user, limits, resume_count)
        }

    def consume_ai_credit(self, user_id: UUID) -> bool:
        """Consume an AI credit with validation"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        self._reset_monthly_usage_if_needed(user)

        if not self._can_use_resource(user, "ai_credits"):
            limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"AI credit limit reached ({user.monthly_ai_credits_used}/{limits.monthly_ai_credits})"
            )

        user.monthly_ai_credits_used += 1
        self.db.commit()
        return True

    def consume_job_search(self, user_id: UUID) -> bool:
        """Consume a job search with validation"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        self._reset_monthly_usage_if_needed(user)

        if not self._can_use_resource(user, "job_searches"):
            limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Job search limit reached ({user.monthly_job_searches_used}/{limits.monthly_job_searches})"
            )

        user.monthly_job_searches_used += 1
        self.db.commit()
        return True

    def validate_resume_creation(self, user_id: UUID) -> bool:
        """Validate if user can create a resume"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        resume_count = self.resume_repo.get_user_resume_count(user_id)

        if not self._can_use_resource(user, "resumes", resume_count):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Resume limit reached ({resume_count}/{limits.max_resumes})"
            )

        return True

    def get_job_results_limit(self, user_id: UUID, total_results: int) -> int:
        """Get visible job results based on subscription"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return 0

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        if limits.job_results_visibility >= 1.0:
            return total_results

        return int(total_results * limits.job_results_visibility)

    def _build_usage_data(self, user, limits, resume_count: int) -> dict:
        """Build usage data structure"""
        return {
            "ai_credits": {
                "used": user.monthly_ai_credits_used,
                "limit": limits.monthly_ai_credits,
                "remaining": self._calculate_remaining(user.monthly_ai_credits_used, limits.monthly_ai_credits),
                "unlimited": limits.monthly_ai_credits == -1
            },
            "job_searches": {
                "used": user.monthly_job_searches_used,
                "limit": limits.monthly_job_searches,
                "remaining": self._calculate_remaining(user.monthly_job_searches_used, limits.monthly_job_searches),
                "unlimited": limits.monthly_job_searches == -1
            },
            "resumes": {
                "used": resume_count,
                "limit": limits.max_resumes,
                "remaining": self._calculate_remaining(resume_count, limits.max_resumes),
                "unlimited": limits.max_resumes == -1
            }
        }

    def _build_permissions(self, user, limits, resume_count: int) -> dict:
        """Build permissions structure"""
        return {
            "can_use_ai": self._can_use_resource(user, "ai_credits"),
            "can_search_jobs": self._can_use_resource(user, "job_searches"),
            "can_create_resume": self._can_use_resource(user, "resumes", resume_count)
        }

    def _build_warnings(self, user, limits, resume_count: int) -> dict:
        """Build warning flags for approaching limits"""
        warnings = {}

        if limits.monthly_ai_credits != -1:
            usage_percent = (user.monthly_ai_credits_used / limits.monthly_ai_credits) * 100
            warnings["ai_credits"] = usage_percent >= 80

        if limits.monthly_job_searches != -1:
            usage_percent = (user.monthly_job_searches_used / limits.monthly_job_searches) * 100
            warnings["job_searches"] = usage_percent >= 80

        if limits.max_resumes != -1:
            usage_percent = (resume_count / limits.max_resumes) * 100
            warnings["resumes"] = usage_percent >= 90

        return warnings

    def _can_use_resource(self, user, resource_type: str, current_count: int = None) -> bool:
        """Unified resource usage validation"""
        if user.subscription_status != "active":
            return False

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]

        if resource_type == "ai_credits":
            return limits.monthly_ai_credits == -1 or user.monthly_ai_credits_used < limits.monthly_ai_credits
        elif resource_type == "job_searches":
            return limits.monthly_job_searches == -1 or user.monthly_job_searches_used < limits.monthly_job_searches
        elif resource_type == "resumes":
            return limits.max_resumes == -1 or (current_count is not None and current_count < limits.max_resumes)

        return False

    def _calculate_remaining(self, used: int, limit: int) -> str | int:
        """Calculate remaining usage"""
        if limit == -1:
            return "unlimited"
        return max(0, limit - used)

    def _reset_monthly_usage_if_needed(self, user) -> None:
        """Reset monthly usage if needed"""
        now = datetime.utcnow()
        if (now - user.last_reset_date).days >= 30:
            user.monthly_ai_credits_used = 0
            user.monthly_job_searches_used = 0
            user.last_reset_date = now
            self.db.commit()