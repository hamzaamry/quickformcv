import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.types import Uuid

from ..base import Base


class ScannedResume(Base):
    __tablename__ = "scanned_resumes"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)  # The name of the uploaded PDF
    overall_score = Column(Float, nullable=False)
    section_scores = Column(JSON, nullable=False)  # Store section scores as JSON
    detailed_analysis = Column(JSON, nullable=False)  # Store detailed analysis as JSON
    processing_time = Column(String, nullable=True)  # Store as string to include units like "29.32s"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with User
    user = relationship("User", back_populates="scanned_resumes")