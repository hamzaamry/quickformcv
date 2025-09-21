from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.resumeSchema import AISuggestionRequest, AISuggestionResponse
from app.schemas.userSchema import UserInDB
from app.services.GroqService import GroqService
from app.services.constants import LLM_SUMMARY_SUGGESTION
from app.services.SubscriptionService import SubscriptionService

router = APIRouter(prefix="/ai", tags=["ai"])

def get_subscription_service(db: Session = Depends(get_db)) -> SubscriptionService:
    return SubscriptionService(db)

@router.post("/suggest-summary", response_model=AISuggestionResponse)
async def suggest_resume_summary(
        request: AISuggestionRequest,
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Generate AI-powered resume summary suggestions based on resume data."""
    try:
        # Check AI credits limit
        can_use, message = subscription_service.can_use_ai_credits(current_user.id)
        if not can_use:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )

        # Consume AI credit
        subscription_service.consume_ai_credit(current_user.id)

        groq_service = GroqService()
        prompt = LLM_SUMMARY_SUGGESTION.format(
            resume_data=str(request.resume_data)
        )
        ai_response = await groq_service.get_AI_response(prompt)
        print("ai response :", ai_response)
        if not ai_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate AI suggestion"
            )

        cleaned = ai_response.strip()

        prefixes_to_remove = [
            "Here is the rewritten professional summary:",
            "Here is the professional summary:",
            "Here is a revised version of the professional summary:",
            "Professional summary:",
            "Summary:",
            "Here is",
            "This is",
            "Below is",
            "Generated summary:",
        ]

        for prefix in prefixes_to_remove:
            if cleaned.lower().startswith(prefix.lower()):
                cleaned = cleaned[len(prefix):].strip()
                break

        cleaned = cleaned.strip(" .,\"'")

        # Get remaining credits for response
        subscription_info = subscription_service.get_subscription_info(current_user.id)

        return AISuggestionResponse(
            success=True,
            summary_suggestion=cleaned,
            credits_remaining=max(0, subscription_info.ai_credits_limit - subscription_info.ai_credits_used) if subscription_info.ai_credits_limit != -1 else "unlimited"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI suggestion: {str(e)}"
        )

@router.post("/suggest-experience", response_model=AISuggestionResponse)
async def suggest_experience_description(
        request: AISuggestionRequest,
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Generate AI-powered work experience descriptions based on job title and company."""
    try:
        # Check AI credits limit
        can_use, message = subscription_service.can_use_ai_credits(current_user.id)
        if not can_use:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )

        # Consume AI credit
        subscription_service.consume_ai_credit(current_user.id)

        groq_service = GroqService()
        # You'll need to add this constant to your constants file
        prompt = f"""
        Based on the following job information, generate 3-4 professional bullet points describing key responsibilities and achievements:
        
        Job Data: {str(request.resume_data)}
        
        Please provide specific, quantifiable, and action-oriented bullet points that would be suitable for a resume.
        """

        ai_response = await groq_service.get_AI_response(prompt)

        if not ai_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate AI suggestion"
            )

        cleaned = ai_response.strip()

        # Get remaining credits for response
        subscription_info = subscription_service.get_subscription_info(current_user.id)

        return AISuggestionResponse(
            success=True,
            summary_suggestion=cleaned,
            credits_remaining=max(0, subscription_info.ai_credits_limit - subscription_info.ai_credits_used) if subscription_info.ai_credits_limit != -1 else "unlimited"
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI suggestion: {str(e)}"
        )