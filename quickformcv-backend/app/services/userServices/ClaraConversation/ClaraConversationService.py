from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from uuid import UUID
import uuid
from datetime import datetime

from app.models.userModels.ClaraConversationModel import Conversation, Message
from app.services.shared.GroqService import GroqService
from app.schemas.userSchemas.ClaraConversationSchema import MessageCreate, ConversationCreate, ConversationUpdate
from app.services.userServices.constants import CLARA_SYSTEM_PROMPT
from app.utils.logging_config import logger

class ClaraService:
    def __init__(self):
        self.groq_service = GroqService()

    async def _generate_response(self, messages: List[Dict[str, str]], model: str = "llama3-8b-8192") -> Dict:
        """Generate a response from the AI model based on the message history."""
        try:
            # Add an instruction to the last system message to check if enough info has been collected
            final_messages = messages.copy()
            final_messages.append({
                "role": "system",
                "content": """Always include **should_generate_resume:** false at the end of your message.
            When you have enough info (name, work experience, education, skills), ask: "I have enough information to generate your resume now. Would you like me to create your resume with this information?"
            ONLY set should_generate_resume: true AFTER the user explicitly confirms with "yes", "sure", or "go ahead"."""
            })

            response = await self.groq_service.async_client.chat.completions.create(
                messages=final_messages,
                model=model,
                temperature=0.25,
                max_tokens=1024,
            )

            content = response.choices[0].message.content.strip()
            should_generate_resume = False

            # Look for the flag at the end of the response
            if "**should_generate_resume:**" in content:
                logger.info(f"should_generate_resume Found in the LLM response")
                parts = content.split("**should_generate_resume:**")
                user_content = parts[0].strip()
                flag_part = parts[1].strip().lower()

                # Check if true is in the flag part
                should_generate_resume = "true" in flag_part

                # Return only the user-visible content
                return {
                    "content": user_content,
                    "should_generate_resume": should_generate_resume
                }

            # If the specific format isn't found, look for alternative formats
            elif "should_generate_resume:" in content.lower():
                idx = content.lower().rfind("should_generate_resume:")
                remaining = content[idx:].lower()

                should_generate_resume = "true" in remaining[:30]  # Check within reasonable distance

                # Remove the flag from the content - everything from the last occurrence of the flag
                user_content = content[:idx].strip()

                return {
                    "content": user_content,
                    "should_generate_resume": should_generate_resume
                }
            return {
                "content": content,
                "should_generate_resume": False
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating AI response: {str(e)}")

    def create_conversation(self, db: Session, user_id: UUID, title: Optional[str] = None) -> Conversation:
        """Create a new conversation for a user."""
        conversation_data = ConversationCreate(title=title or "New Conversation")
        db_conversation = Conversation(
            id=uuid.uuid4(),
            user_id=user_id,
            title=conversation_data.title
        )

        # Add system message
        system_message = Message(
            id=uuid.uuid4(),
            conversation_id=db_conversation.id,
            role="system",
            content=CLARA_SYSTEM_PROMPT
        )

        db.add(db_conversation)
        db.add(system_message)
        db.commit()
        db.refresh(db_conversation)
        return db_conversation

    def get_conversation(self, db: Session, conversation_id: UUID, user_id: UUID) -> Optional[Conversation]:
        """Get a conversation by ID, ensuring it belongs to the user."""
        return db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        ).first()

    def get_user_conversations(self, db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> List[Conversation]:
        """Get all conversations for a user."""
        return db.query(Conversation).filter(
            Conversation.user_id == user_id
        ).order_by(Conversation.updated_at.desc()).offset(skip).limit(limit).all()

    def update_conversation(self, db: Session, conversation_id: UUID, user_id: UUID, data: ConversationUpdate) -> Optional[Conversation]:
        """Update a conversation title."""
        conversation = self.get_conversation(db, conversation_id, user_id)
        if not conversation:
            return None

        for key, value in data.dict(exclude_unset=True).items():
            setattr(conversation, key, value)

        conversation.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(conversation)
        return conversation

    def delete_conversation(self, db: Session, conversation_id: UUID, user_id: UUID) -> bool:
        """Delete a conversation."""
        conversation = self.get_conversation(db, conversation_id, user_id)
        if not conversation:
            return False

        db.delete(conversation)
        db.commit()
        return True

    def get_messages(self, db: Session, conversation_id: UUID, user_id: UUID) -> List[Message]:
        """Get all messages in a conversation."""
        conversation = self.get_conversation(db, conversation_id, user_id)
        if not conversation:
            return []

        return db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at).all()

    def add_message(self, db: Session, conversation_id: UUID, message_data: MessageCreate) -> Message:
        """Add a message to a conversation."""
        db_message = Message(
            id=uuid.uuid4(),
            conversation_id=conversation_id,
            **message_data.dict()
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
        return db_message

    async def chat(self, db: Session, user_id: UUID, message_content: str, conversation_id: Optional[UUID] = None) -> Dict:
        """Process a chat message and return a response with conversation context."""
        if not conversation_id:
            conversation = self.create_conversation(db, user_id)
        else:
            conversation = self.get_conversation(db, conversation_id, user_id)
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

        # Add user message to the database
        user_message = MessageCreate(role="user", content=message_content)
        self.add_message(db, conversation.id, user_message)

        # Get all messages in the conversation to maintain context
        db_messages = self.get_messages(db, conversation.id, user_id)

        # Format messages for the API
        formatted_messages = [{"role": msg.role, "content": msg.content} for msg in db_messages]

        # Generate AI response
        response_data = await self._generate_response(formatted_messages)

        ai_response = response_data["content"]
        should_generate_resume = response_data["should_generate_resume"]
        logger.info(f"should_generate_resume from the service : {should_generate_resume}")

    # Save the AI response to the database
        assistant_message = MessageCreate(role="assistant", content=ai_response)
        self.add_message(db, conversation.id, assistant_message)

        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()

        # Update title if it's a new conversation (using the first user message)
        if conversation.title == "New Conversation":
            # Generate a title based on the first message
            title_messages = [
                {"role": "system", "content": "Generate a very brief title (5 words or less) that summarizes this conversation based on the user's first message. Respond with ONLY the title."},
                {"role": "user", "content": message_content}
            ]
            title_response = await self._generate_response(title_messages)
            title = title_response["content"][:50]  # Limit to 50 chars
            conversation.title = title

        db.commit()

        return {
            "conversation_id": conversation.id,
            "message": ai_response,
            "title": conversation.title,
            "should_generate_resume": should_generate_resume
        }