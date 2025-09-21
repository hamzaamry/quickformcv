from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchema import UserInDB
from app.services.SubscriptionService import SubscriptionService

router = APIRouter(prefix="/subscription", tags=["subscription"])

def get_subscription_service(db: Session = Depends(get_db)) -> SubscriptionService:
    return SubscriptionService(db)

@router.get("/info", response_model=dict)
async def get_subscription_info(
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get user's subscription information and usage limits"""
    try:
        subscription_info = subscription_service.get_subscription_info(current_user.id)
        return {
            "subscription": {
                "tier": subscription_info.tier,
                "status": subscription_info.status,
                "days_until_reset": subscription_info.days_until_reset
            },
            "usage": {
                "ai_credits": {
                    "used": subscription_info.ai_credits_used,
                    "limit": subscription_info.ai_credits_limit,
                    "remaining": max(0, subscription_info.ai_credits_limit - subscription_info.ai_credits_used) if subscription_info.ai_credits_limit != -1 else "unlimited"
                },
                "job_searches": {
                    "used": subscription_info.job_searches_used,
                    "limit": subscription_info.job_searches_limit,
                    "remaining": max(0, subscription_info.job_searches_limit - subscription_info.job_searches_used) if subscription_info.job_searches_limit != -1 else "unlimited"
                },
                "resumes": {
                    "used": subscription_info.resumes_count,
                    "limit": subscription_info.resumes_limit,
                    "remaining": max(0, subscription_info.resumes_limit - subscription_info.resumes_count) if subscription_info.resumes_limit != -1 else "unlimited"
                }
            },
            "permissions": {
                "can_use_ai": subscription_info.can_use_ai,
                "can_search_jobs": subscription_info.can_search_jobs,
                "can_create_resume": subscription_info.can_create_resume
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get subscription info: {str(e)}"
        )

@router.get("/analytics", response_model=dict)
async def get_usage_analytics(
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get detailed usage analytics for the user"""
    try:
        analytics = subscription_service.get_usage_analytics(current_user.id)
        return analytics
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get usage analytics: {str(e)}"
        )