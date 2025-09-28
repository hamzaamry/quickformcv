from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchema import UserInDB
from app.services.SubscriptionService import SubscriptionService
from app.repositories.userRepository import UserRepository

router = APIRouter(prefix="/subscription", tags=["subscription"])

class SubscriptionUpgradeRequest(BaseModel):
    tier: str = Field(..., pattern="^(free|pro|premium)$", description="Target subscription tier")

class SubscriptionCancellationRequest(BaseModel):
    reason: Optional[str] = Field(None, max_length=500, description="Optional cancellation reason")

def get_subscription_service(db: Session = Depends(get_db)) -> SubscriptionService:
    return SubscriptionService(db)

def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

@router.get("/status")
async def get_subscription_status(
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get complete subscription status, usage, and permissions"""
    return subscription_service.get_subscription_status(current_user.id)

@router.post("/upgrade")
async def upgrade_subscription(
        upgrade_request: SubscriptionUpgradeRequest,
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        user_repo: UserRepository = Depends(get_user_repository),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:

    current_tier = current_user.subscription_tier
    target_tier = upgrade_request.tier.lower()

    # Validation: Check if change is needed
    if current_tier == target_tier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User is already on {target_tier} tier"
        )

    try:
        # Update user subscription tier
        updated_user = user_repo.update_subscription(
            user_id=current_user.id,
            tier=target_tier,
            status="active"
        )

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update subscription"
            )

        # Reset usage counters to give fresh start
        user_repo.reset_monthly_usage(current_user.id)

        # Get updated subscription status
        new_status = subscription_service.get_subscription_status(current_user.id)

        return {
            "success": True,
            "message": f"Successfully changed subscription from {current_tier} to {target_tier}",
            "previous_tier": current_tier,
            "new_tier": target_tier,
            "change_date": datetime.utcnow(),
            "subscription_status": new_status
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription change failed: {str(e)}"
        )

@router.post("/cancel")
async def cancel_subscription(
        cancellation_request: SubscriptionCancellationRequest,
        user_repo: UserRepository = Depends(get_user_repository),
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """
    Cancel subscription by downgrading to free tier
    """

    if current_user.subscription_tier == "free":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already on free tier"
        )

    try:
        previous_tier = current_user.subscription_tier

        # Downgrade to free tier
        updated_user = user_repo.update_subscription(
            user_id=current_user.id,
            tier="free",
            status="active"
        )

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to cancel subscription"
            )

        # Reset usage counters for free tier limits
        user_repo.reset_monthly_usage(current_user.id)

        # Get updated subscription status
        new_status = subscription_service.get_subscription_status(current_user.id)

        return {
            "success": True,
            "message": f"Subscription cancelled. Changed from {previous_tier} to free tier.",
            "previous_tier": previous_tier,
            "new_tier": "free",
            "cancellation_date": datetime.utcnow(),
            "subscription_status": new_status
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription cancellation failed: {str(e)}"
        )