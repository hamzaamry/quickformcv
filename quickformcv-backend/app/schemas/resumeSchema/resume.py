from datetime import datetime
from typing import Optional, Union, List
from uuid import UUID
from pydantic import BaseModel, Field
from .basics import Basics
from .metadata import Metadata
from .base import Pages
from .sections import ItemsSection, SummarySection, CustomSection

class ResumeBase(BaseModel):
    title: str
    jobDescription: Optional[str] = None
    basics: Optional[Basics] = None
    pages: Optional[Pages] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeMetadataBase(BaseModel):
    meta_config: dict = {}

class ResumeInDBBase(ResumeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeSection(BaseModel):
    id: UUID
    section_type: str
    section_data: Union[SummarySection, ItemsSection, CustomSection]

class ResumeComplete(ResumeBase):
    id: UUID
    user_id: UUID
    metadata: Metadata
    pages: Pages = Field(default_factory=lambda: Pages(pages=[], activePageId=1))
    sections: List[ResumeSection]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Resume(ResumeInDBBase):
    """Return to client"""
    pass

class ResumeInDB(ResumeInDBBase):
    """Additional fields for database"""
    template_name: Optional[str] = None