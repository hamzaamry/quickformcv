import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import Uuid
from sqlalchemy.dialects.postgresql import JSONB
from ..base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    job_description = Column(String, nullable=True)
    basics = Column(JSONB, nullable=True)
    pages = Column(JSONB, nullable=True, server_default='{"pages": [], "activePageId": 1}')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    sections = relationship("ResumeSection", back_populates="resume", cascade="all, delete-orphan")
    resume_metadata = relationship("ResumeMetadata", back_populates="resume", cascade="all, delete-orphan", uselist=False)
    user = relationship("User", backref="resumes")

class ResumeSection(Base):
    __tablename__ = "resume_sections"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4, index=True)
    resume_id = Column(Uuid, ForeignKey("resumes.id"), nullable=False)
    section_type = Column(String, nullable=False)
    section_data = Column(JSONB, nullable=False)

    resume = relationship("Resume", back_populates="sections")

class ResumeMetadata(Base):
    __tablename__ = "resume_metadata"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4, index=True)
    resume_id = Column(Uuid, ForeignKey("resumes.id"), nullable=False, unique=True)
    meta_config = Column(JSONB, nullable=False, server_default='{}')
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    resume = relationship("Resume", back_populates="resume_metadata")