from fastapi import APIRouter, Depends, HTTPException, Body, Query
from typing import Dict, Optional, List
from sqlalchemy.orm import Session
from uuid import UUID

from app.Database import get_db
from app.schemas.userSchemas.userSchema import UserInDB
from app.core.auth import get_current_active_user
from app.schemas.userSchemas.ClaraConversationSchema import ChatRequest, ConversationUpdate
from app.services.userServices.ClaraConversation.ClaraConversationService import ClaraService
from app.services.userServices.ClaraConversation.ResumeDataExtractor import ResumeDataExtractor
from app.schemas.userSchemas.resumeSchema import ResumeComplete
from app.utils.logging_config import logger

router = APIRouter(prefix="/ai/clara", tags=["ai-clara"])

@router.post("/chat")
async def chat_with_clara(
        request: ChatRequest,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
) -> Dict:
    """Chat with Clara AI assistant."""
    clara_service = ClaraService()
    return await clara_service.chat(
        db=db,
        user_id=current_user.id,
        message_content=request.message,
        conversation_id=request.conversation_id
    )

@router.get("/conversations")
async def get_conversations(
        skip: int = Query(0, ge=0),
        limit: int = Query(20, ge=1, le=100),
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Get all user conversations with Clara."""
    clara_service = ClaraService()
    conversations = clara_service.get_user_conversations(
        db=db,
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    return conversations

@router.get("/conversations/{conversation_id}")
async def get_conversation(
        conversation_id: UUID,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Get a specific conversation with Clara."""
    clara_service = ClaraService()
    conversation = clara_service.get_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Get messages for this conversation
    messages = clara_service.get_messages(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )

    # Convert to schema format and return
    return {
        "id": conversation.id,
        "title": conversation.title,
        "created_at": conversation.created_at,
        "updated_at": conversation.updated_at,
        "messages": [{
            "id": msg.id,
            "role": msg.role,
            "content": msg.content,
            "created_at": msg.created_at
        } for msg in messages if msg.role != "system"]  # Filter out system messages
    }

@router.patch("/conversations/{conversation_id}")
async def update_conversation(
        conversation_id: UUID,
        data: ConversationUpdate,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Update conversation title."""
    clara_service = ClaraService()
    updated_conversation = clara_service.update_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
        data=data
    )

    if not updated_conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "id": updated_conversation.id,
        "title": updated_conversation.title,
        "updated_at": updated_conversation.updated_at
    }

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
        conversation_id: UUID,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Delete a conversation."""
    clara_service = ClaraService()
    success = clara_service.delete_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )

    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {"detail": "Conversation deleted successfully"}

@router.post("/conversation/{conversation_id}/to-resume")
async def extract_resume_from_conversation(
        conversation_id: UUID,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
) -> Dict:
    """
    Extract resume data from a Clara conversation and generate a new resume.
    """
    try:
        logger.info(f"Attempting to generate resume from conversation {conversation_id} for user {current_user.id}")

        extractor = ResumeDataExtractor(db)
        generated_resume = await extractor.generate_resume(
            user_id=current_user.id,
            conversation_id=conversation_id
        )

        logger.info(f"Successfully generated resume {generated_resume.id} from conversation {conversation_id}")

        return {
            "status": "success",
            "message": "Resume successfully generated from conversation data",
            "resume_id": generated_resume.id,
            "resume_details": {
                "name": f"{generated_resume.basics.firstName} {generated_resume.basics.lastName}",
                "headline": generated_resume.basics.headline
            }
        }
    except ValueError as ve:
        logger.warning(f"Value error during resume generation: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error generating resume from conversation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate resume from conversation: {str(e)}"
        )

@router.get("/conversations/{conversation_id}/extract-resume")
async def extract_resume_data(
        conversation_id: UUID,
        db: Session = Depends(get_db),
        current_user: UserInDB = Depends(get_current_active_user)
) -> Dict:
    """
    Extract resume data from a conversation.
    """
    try:
        # Ensure the conversation belongs to the current user
        clara_service = ClaraService()
        conversation = clara_service.get_conversation(db, conversation_id, current_user.id)

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        # Extract resume data
        extractor = ResumeDataExtractor(db)
        resume_data = await extractor.extract_resume_data(conversation_id, current_user.id)
        return resume_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting resume data: {str(e)}")