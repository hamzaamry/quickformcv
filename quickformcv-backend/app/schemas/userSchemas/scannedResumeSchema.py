from datetime import datetime
from typing import Dict, Optional, Any
from uuid import UUID

from pydantic import BaseModel


class SectionScore(BaseModel):
    first_impression: float
    appearance: float
    career_goals: float
    writing_style: float


class DetailedAnalysis(BaseModel):
    first_impression: Dict[str, Any]
    appearance: Dict[str, Any]
    career_goals: Dict[str, Any]
    writing_style: Dict[str, Any]


class ScannedResumeBase(BaseModel):
    title: str
    overall_score: float
    section_scores: SectionScore
    detailed_analysis: DetailedAnalysis
    processing_time: Optional[str] = None


class ScannedResumeCreate(ScannedResumeBase):
    pass


class ScannedResumeInDB(ScannedResumeBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ScannedResume(ScannedResumeInDB):
    pass


class ScannedResumeResponse(BaseModel):
    id: UUID
    title: str
    overall_score: float
    section_scores: Dict[str, float]
    detailed_analysis: Dict[str, Any]
    processing_time: Optional[str] = None
    created_at: datetime