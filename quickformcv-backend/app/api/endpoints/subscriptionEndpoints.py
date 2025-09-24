from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchema import UserInDB
from app.services.SubscriptionService import SubscriptionService

router = APIRouter(prefix="/subscription", tags=["subscription"])

def get_subscription_service(db: Session = Depends(get_db)) -> SubscriptionService:
    return SubscriptionService(db)

@router.get("/status")
async def get_subscription_status(
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get complete subscription status, usage, and permissions"""
    return subscription_service.get_subscription_status(current_user.id)