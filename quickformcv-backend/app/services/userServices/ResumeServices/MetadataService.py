from uuid import UUID
from typing import Dict
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.userRepositories.ResumeRepositories.resumeRepository import ResumeRepository
from app.schemas.userSchemas.resumeSchema import ResumeInDB, Basics

class MetadataService:
    def __init__(self, db: Session):
        self.repository = ResumeRepository(db)

    def get_metadata(self, resume_id: UUID) -> Dict:
        """Get metadata for a resume"""
        metadata = self.repository.metadata_repo.get_metadata(resume_id)
        if not metadata:
            return {}
        return metadata.meta_config

    def update_metadata(self, resume_id: UUID, metadata: dict) -> Dict:
        """Update metadata for a resume"""
        updated_metadata = self.repository.metadata_repo.update_metadata(resume_id, metadata)
        if not updated_metadata:
            return None
        return updated_metadata

    def update_resume_basics(self, resume_id: UUID, user_id: UUID, basics: Basics) -> ResumeInDB:
        """Update the basics section of a resume"""
        resume = self.repository.get_by_id(resume_id, user_id)
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

        resume.basics = basics.model_dump()
        self.repository.db.commit()
        self.repository.db.refresh(resume)
        return resume