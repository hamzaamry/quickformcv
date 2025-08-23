from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class MessageBase(BaseModel):
    role: str
    content: str


class MessageCreate(MessageBase):
    pass


class MessageInDB(MessageBase):
    id: UUID
    conversation_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class Message(MessageInDB):
    pass


class ConversationBase(BaseModel):
    title: Optional[str] = "New Conversation"


class ConversationCreate(ConversationBase):
    pass


class ConversationUpdate(BaseModel):
    title: Optional[str] = None


class ConversationInDB(ConversationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class Conversation(ConversationInDB):
    messages: List[Message] = []


class ConversationResponse(BaseModel):
    conversation_id: UUID
    message: str
    title: str


class ChatRequest(BaseModel):
    conversation_id: Optional[UUID] = None
    message: str