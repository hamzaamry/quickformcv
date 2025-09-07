from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from uuid import UUID

from sqlalchemy import func, and_, or_, text
from sqlalchemy.orm import Session

from app.models.userModels.userModel import User
from app.models.userModels.resumeModel import Resume


class SubscriptionRepository:
    """Repository for subscription-related database operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_user_subscription_details(self, user_id: UUID) -> Optional[Dict[str, Any]]:
        """Get comprehensive subscription details for a user"""
        result = self.db.query(
            User.id,
            User.subscription_tier,
            User.subscription_status,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used,
            User.last_reset_date,
            User.created_at,
            func.count(Resume.id).label('resume_count')
        ).outerjoin(
            Resume, User.id == Resume.user_id
        ).filter(
            User.id == user_id
        ).group_by(
            User.id,
            User.subscription_tier,
            User.subscription_status,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used,
            User.last_reset_date,
            User.created_at
        ).first()

        if not result:
            return None

        return {
            "user_id": result.id,
            "subscription_tier": result.subscription_tier,
            "subscription_status": result.subscription_status,
            "monthly_ai_credits_used": result.monthly_ai_credits_used,
            "monthly_job_searches_used": result.monthly_job_searches_used,
            "last_reset_date": result.last_reset_date,
            "created_at": result.created_at,
            "resume_count": result.resume_count or 0
        }

    def get_users_by_usage_patterns(
            self,
            tier: Optional[str] = None,
            high_ai_usage: bool = False,
            high_job_search_usage: bool = False,
            limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Get users based on their usage patterns"""
        query = self.db.query(
            User.id,
            User.email,
            User.subscription_tier,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used,
            func.count(Resume.id).label('resume_count')
        ).outerjoin(Resume, User.id == Resume.user_id)

        # Apply filters
        conditions = [User.is_active == True]

        if tier:
            conditions.append(User.subscription_tier == tier)

        if high_ai_usage:
            # Users who used more than 80% of their AI credits (for non-unlimited tiers)
            conditions.append(
                or_(
                    and_(User.subscription_tier == 'free', User.monthly_ai_credits_used >= 2),
                    User.subscription_tier.in_(['pro', 'premium'])  # Unlimited tiers
                )
            )

        if high_job_search_usage:
            # Users who used more than 80% of their job searches
            conditions.append(
                or_(
                    and_(User.subscription_tier == 'free', User.monthly_job_searches_used >= 2),
                    and_(User.subscription_tier == 'pro', User.monthly_job_searches_used >= 10),
                    and_(User.subscription_tier == 'premium', User.monthly_job_searches_used >= 12)
                )
            )

        query = query.filter(and_(*conditions))
        query = query.group_by(
            User.id, User.email, User.subscription_tier,
            User.monthly_ai_credits_used, User.monthly_job_searches_used
        )

        results = query.limit(limit).all()

        return [
            {
                "user_id": result.id,
                "email": result.email,
                "subscription_tier": result.subscription_tier,
                "monthly_ai_credits_used": result.monthly_ai_credits_used,
                "monthly_job_searches_used": result.monthly_job_searches_used,
                "resume_count": result.resume_count or 0
            }
            for result in results
        ]

    def get_subscription_tier_analytics(self) -> Dict[str, Dict[str, Any]]:
        """Get analytics for all subscription tiers"""
        # Get user count and average usage per tier
        results = self.db.query(
            User.subscription_tier,
            func.count(User.id).label('user_count'),
            func.avg(User.monthly_ai_credits_used).label('avg_ai_credits_used'),
            func.avg(User.monthly_job_searches_used).label('avg_job_searches_used'),
            func.max(User.monthly_ai_credits_used).label('max_ai_credits_used'),
            func.max(User.monthly_job_searches_used).label('max_job_searches_used')
        ).filter(
            User.is_active == True
        ).group_by(
            User.subscription_tier
        ).all()

        # Get resume count analytics per tier
        resume_results = self.db.query(
            User.subscription_tier,
            func.avg(func.count(Resume.id)).label('avg_resume_count'),
            func.max(func.count(Resume.id)).label('max_resume_count')
        ).outerjoin(
            Resume, User.id == Resume.user_id
        ).filter(
            User.is_active == True
        ).group_by(
            User.subscription_tier, User.id
        ).subquery()

        resume_analytics = self.db.query(
            resume_results.c.subscription_tier,
            func.avg(resume_results.c.avg_resume_count).label('avg_resume_count'),
            func.max(resume_results.c.max_resume_count).label('max_resume_count')
        ).group_by(resume_results.c.subscription_tier).all()

        # Combine results
        analytics = {}

        for result in results:
            analytics[result.subscription_tier] = {
                "user_count": result.user_count,
                "avg_ai_credits_used": float(result.avg_ai_credits_used or 0),
                "avg_job_searches_used": float(result.avg_job_searches_used or 0),
                "max_ai_credits_used": result.max_ai_credits_used or 0,
                "max_job_searches_used": result.max_job_searches_used or 0
            }

        for resume_result in resume_analytics:
            if resume_result.subscription_tier in analytics:
                analytics[resume_result.subscription_tier].update({
                    "avg_resume_count": float(resume_result.avg_resume_count or 0),
                    "max_resume_count": resume_result.max_resume_count or 0
                })

        return analytics

    def get_users_needing_upgrade_suggestions(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get users who might benefit from upgrading their subscription"""
        # Find free users who are hitting their limits
        free_users_at_limit = self.db.query(
            User.id,
            User.email,
            User.subscription_tier,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used,
            func.count(Resume.id).label('resume_count')
        ).outerjoin(
            Resume, User.id == Resume.user_id
        ).filter(
            and_(
                User.subscription_tier == 'free',
                User.is_active == True,
                or_(
                    User.monthly_ai_credits_used >= 3,  # At AI limit
                    User.monthly_job_searches_used >= 3,  # At job search limit
                    func.count(Resume.id) >= 3  # At resume limit
                )
            )
        ).group_by(
            User.id, User.email, User.subscription_tier,
            User.monthly_ai_credits_used, User.monthly_job_searches_used
        ).limit(limit).all()

        # Find pro users who might benefit from premium
        pro_users_heavy_usage = self.db.query(
            User.id,
            User.email,
            User.subscription_tier,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used,
            func.count(Resume.id).label('resume_count')
        ).outerjoin(
            Resume, User.id == Resume.user_id
        ).filter(
            and_(
                User.subscription_tier == 'pro',
                User.is_active == True,
                User.monthly_job_searches_used >= 10  # High job search usage
            )
        ).group_by(
            User.id, User.email, User.subscription_tier,
            User.monthly_ai_credits_used, User.monthly_job_searches_used
        ).limit(limit).all()

        suggestions = []

        for user in free_users_at_limit:
            reason = []
            if user.monthly_ai_credits_used >= 3:
                reason.append("AI credits limit reached")
            if user.monthly_job_searches_used >= 3:
                reason.append("Job search limit reached")
            if user.resume_count >= 3:
                reason.append("Resume limit reached")

            suggestions.append({
                "user_id": user.id,
                "email": user.email,
                "current_tier": user.subscription_tier,
                "suggested_tier": "pro",
                "reason": "; ".join(reason),
                "usage": {
                    "ai_credits": user.monthly_ai_credits_used,
                    "job_searches": user.monthly_job_searches_used,
                    "resumes": user.resume_count
                }
            })

        for user in pro_users_heavy_usage:
            suggestions.append({
                "user_id": user.id,
                "email": user.email,
                "current_tier": user.subscription_tier,
                "suggested_tier": "premium",
                "reason": "High job search usage - premium offers more searches and 100% result visibility",
                "usage": {
                    "ai_credits": user.monthly_ai_credits_used,
                    "job_searches": user.monthly_job_searches_used,
                    "resumes": user.resume_count
                }
            })

        return suggestions

    def get_monthly_usage_report(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        """Generate a monthly usage report"""
        # Get users who were active during the period
        active_users = self.db.query(
            User.id,
            User.subscription_tier,
            User.monthly_ai_credits_used,
            User.monthly_job_searches_used
        ).filter(
            and_(
                User.is_active == True,
                User.last_reset_date >= start_date,
                User.last_reset_date <= end_date
            )
        ).all()

        # Aggregate by tier
        tier_usage = {}

        for user in active_users:
            tier = user.subscription_tier
            if tier not in tier_usage:
                tier_usage[tier] = {
                    "user_count": 0,
                    "total_ai_credits_used": 0,
                    "total_job_searches_used": 0,
                    "users": []
                }

            tier_usage[tier]["user_count"] += 1
            tier_usage[tier]["total_ai_credits_used"] += user.monthly_ai_credits_used
            tier_usage[tier]["total_job_searches_used"] += user.monthly_job_searches_used
            tier_usage[tier]["users"].append({
                "user_id": user.id,
                "ai_credits_used": user.monthly_ai_credits_used,
                "job_searches_used": user.monthly_job_searches_used
            })

        return {
            "report_period": {
                "start_date": start_date,
                "end_date": end_date
            },
            "tier_usage": tier_usage,
            "total_active_users": len(active_users)
        }

    def cleanup_inactive_subscriptions(self, days_inactive: int = 90) -> int:
        """Mark subscriptions as inactive for users who haven't been active"""
        cutoff_date = datetime.utcnow() - timedelta(days=days_inactive)

        updated_count = self.db.query(User).filter(
            and_(
                User.updated_at < cutoff_date,
                User.subscription_status == "active",
                User.is_active == True
            )
        ).update(
            {"subscription_status": "inactive"},
            synchronize_session=False
        )

        self.db.commit()
        return updated_count