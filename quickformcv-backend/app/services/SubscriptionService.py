from datetime import datetime, timedelta
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.userRepositories.userRepository import UserRepository
from app.repositories.userRepositories.ResumeRepositories import ResumeRepository
from app.schemas.userSchemas.userSchema import SubscriptionInfo, SubscriptionLimits


class SubscriptionService:
    """Service to manage user subscriptions and enforce limits"""

    SUBSCRIPTION_LIMITS = {
        "free": SubscriptionLimits(
            max_resumes=3,
            monthly_ai_credits=3,
            monthly_job_searches=3,
            job_results_visibility=0.3  # Only first 30% of results visible
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

    def get_subscription_info(self, user_id: UUID) -> SubscriptionInfo:
        """Get comprehensive subscription information for a user"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Reset usage if month has passed
        self._reset_monthly_usage_if_needed(user)

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        resume_count = self.resume_repo.get_user_resume_count(user_id)

        # Calculate days until reset
        next_reset = user.last_reset_date + timedelta(days=30)
        days_until_reset = max(0, (next_reset - datetime.utcnow()).days)

        return SubscriptionInfo(
            tier=user.subscription_tier,
            status=user.subscription_status,
            ai_credits_used=user.monthly_ai_credits_used,
            ai_credits_limit=limits.monthly_ai_credits,
            job_searches_used=user.monthly_job_searches_used,
            job_searches_limit=limits.monthly_job_searches,
            resumes_count=resume_count,
            resumes_limit=limits.max_resumes,
            days_until_reset=days_until_reset,
            can_use_ai=self._can_use_ai_credits(user),
            can_search_jobs=self._can_search_jobs(user),
            can_create_resume=self._can_create_resume(user, resume_count)
        )

    def get_subscription_limits(self, subscription_tier: str) -> SubscriptionLimits:
        """Get limits for a subscription tier"""
        return self.SUBSCRIPTION_LIMITS.get(subscription_tier, self.SUBSCRIPTION_LIMITS["free"])

    def can_create_resume(self, user_id: UUID) -> tuple[bool, str]:
        """Check if user can create another resume"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False, "User not found"

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        current_resume_count = self.resume_repo.get_user_resume_count(user_id)

        if limits.max_resumes == -1:  # Unlimited
            return True, ""

        if current_resume_count >= limits.max_resumes:
            return False, f"Resume limit reached ({current_resume_count}/{limits.max_resumes}). Upgrade to create more."

        return True, ""

    def can_use_ai_credits(self, user_id: UUID) -> tuple[bool, str]:
        """Check if user can use AI credits"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False, "User not found"

        self._reset_monthly_usage_if_needed(user)

        if not self._can_use_ai_credits(user):
            limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
            if limits.monthly_ai_credits == -1:
                return True, ""
            return False, f"Monthly AI credit limit reached ({user.monthly_ai_credits_used}/{limits.monthly_ai_credits}). Upgrade for more credits."

        return True, ""

    def can_search_jobs(self, user_id: UUID) -> tuple[bool, str]:
        """Check if user can perform job searches"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False, "User not found"

        self._reset_monthly_usage_if_needed(user)

        if not self._can_search_jobs(user):
            limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
            if limits.monthly_job_searches == -1:
                return True, ""
            return False, f"Monthly job search limit reached ({user.monthly_job_searches_used}/{limits.monthly_job_searches}). Upgrade for more searches."

        return True, ""

    def consume_ai_credit(self, user_id: UUID) -> bool:
        """Consume an AI credit for the user"""
        can_use, message = self.can_use_ai_credits(user_id)
        if not can_use:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )

        user = self.user_repo.get_by_id(user_id)
        user.monthly_ai_credits_used += 1
        self.db.commit()
        return True

    def consume_job_search(self, user_id: UUID) -> bool:
        """Consume a job search for the user"""
        can_use, message = self.can_search_jobs(user_id)
        if not can_use:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )

        user = self.user_repo.get_by_id(user_id)
        user.monthly_job_searches_used += 1
        self.db.commit()
        return True

    def upgrade_subscription(self, user_id: UUID, new_tier: str) -> bool:
        """Upgrade user subscription"""
        if new_tier not in self.SUBSCRIPTION_LIMITS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid subscription tier"
            )

        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False

        user.subscription_tier = new_tier
        user.subscription_status = "active"
        self.db.commit()
        return True

    def downgrade_subscription(self, user_id: UUID, new_tier: str) -> tuple[bool, str]:
        """
        Downgrade user subscription with validation
        Returns (success, message)
        """
        if new_tier not in self.SUBSCRIPTION_LIMITS:
            return False, "Invalid subscription tier"

        user = self.user_repo.get_by_id(user_id)
        if not user:
            return False, "User not found"

        new_limits = self.SUBSCRIPTION_LIMITS[new_tier]
        resume_count = self.resume_repo.get_user_resume_count(user_id)

        # Check if downgrade is possible
        if new_limits.max_resumes != -1 and resume_count > new_limits.max_resumes:
            return False, f"Cannot downgrade: You have {resume_count} resumes but {new_tier} tier allows only {new_limits.max_resumes}. Please delete some resumes first."

        user.subscription_tier = new_tier
        user.subscription_status = "active"
        self.db.commit()
        return True, f"Successfully downgraded to {new_tier} tier"

    def get_job_results_limit(self, user_id: UUID, total_results: int) -> int:
        """Get the number of job results user can see based on their subscription"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return 0

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        if limits.job_results_visibility >= 1.0:
            return total_results

        return int(total_results * limits.job_results_visibility)

    def get_usage_analytics(self, user_id: UUID) -> dict:
        """Get detailed usage analytics for a user"""
        user = self.user_repo.get_by_id(user_id)
        if not user:
            return {}

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        resume_count = self.resume_repo.get_user_resume_count(user_id)

        # Calculate usage percentages
        ai_usage_percent = 0
        job_search_usage_percent = 0
        resume_usage_percent = 0

        if limits.monthly_ai_credits != -1:
            ai_usage_percent = min(100, (user.monthly_ai_credits_used / limits.monthly_ai_credits) * 100)

        if limits.monthly_job_searches != -1:
            job_search_usage_percent = min(100, (user.monthly_job_searches_used / limits.monthly_job_searches) * 100)

        if limits.max_resumes != -1:
            resume_usage_percent = min(100, (resume_count / limits.max_resumes) * 100)

        next_reset = user.last_reset_date + timedelta(days=30)
        days_until_reset = max(0, (next_reset - datetime.utcnow()).days)

        return {
            "subscription_tier": user.subscription_tier,
            "subscription_status": user.subscription_status,
            "usage": {
                "ai_credits": {
                    "used": user.monthly_ai_credits_used,
                    "limit": limits.monthly_ai_credits,
                    "percentage": ai_usage_percent,
                    "unlimited": limits.monthly_ai_credits == -1
                },
                "job_searches": {
                    "used": user.monthly_job_searches_used,
                    "limit": limits.monthly_job_searches,
                    "percentage": job_search_usage_percent,
                    "unlimited": limits.monthly_job_searches == -1
                },
                "resumes": {
                    "used": resume_count,
                    "limit": limits.max_resumes,
                    "percentage": resume_usage_percent,
                    "unlimited": limits.max_resumes == -1
                }
            },
            "reset_info": {
                "last_reset": user.last_reset_date,
                "next_reset": next_reset,
                "days_until_reset": days_until_reset
            },
            "job_results_visibility": limits.job_results_visibility
        }

    def bulk_reset_monthly_usage(self) -> int:
        """Reset monthly usage for all users who need it (batch operation)"""
        users_needing_reset = self.user_repo.get_users_needing_reset()
        reset_count = 0

        for user in users_needing_reset:
            self._reset_monthly_usage_if_needed(user)
            reset_count += 1

        return reset_count

    def get_subscription_tier_stats(self) -> dict:
        """Get statistics about subscription tiers across all users"""
        stats = {}

        for tier in self.SUBSCRIPTION_LIMITS.keys():
            users = self.user_repo.get_users_by_subscription_tier(tier)
            stats[tier] = {
                "user_count": len(users),
                "limits": self.SUBSCRIPTION_LIMITS[tier].__dict__
            }

        return stats

    def _can_use_ai_credits(self, user) -> bool:
        """Check if user can use AI credits"""
        if user.subscription_status != "active":
            return False

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        return limits.monthly_ai_credits == -1 or user.monthly_ai_credits_used < limits.monthly_ai_credits

    def _can_search_jobs(self, user) -> bool:
        """Check if user can search jobs"""
        if user.subscription_status != "active":
            return False

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        return limits.monthly_job_searches == -1 or user.monthly_job_searches_used < limits.monthly_job_searches

    def _can_create_resume(self, user, resume_count: int) -> bool:
        """Check if user can create more resumes"""
        if user.subscription_status != "active":
            return False

        limits = self.SUBSCRIPTION_LIMITS[user.subscription_tier]
        return limits.max_resumes == -1 or resume_count < limits.max_resumes

    def _reset_monthly_usage_if_needed(self, user) -> None:
        """Reset monthly usage counters if a month has passed"""
        now = datetime.utcnow()

        # Check if 30 days have passed since last reset
        if (now - user.last_reset_date).days >= 30:
            user.monthly_ai_credits_used = 0
            user.monthly_job_searches_used = 0
            user.last_reset_date = now
            self.db.commit()