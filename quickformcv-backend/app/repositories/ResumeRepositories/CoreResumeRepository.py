from uuid import UUID
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.resumeModel import Resume, ResumeMetadata
from app.schemas.resumeSchema.resume import ResumeCreate

class CoreResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, resume_create: ResumeCreate) -> Resume:
        """Create a new resume."""
        db_resume = Resume(
            user_id=user_id,
            title=resume_create.title,
            job_description=resume_create.jobDescription,
            basics=resume_create.basics.model_dump() if resume_create.basics else None
        )
        self.db.add(db_resume)
        self.db.flush()
        return db_resume

    def get_by_id(self, resume_id: UUID, user_id: UUID) -> Optional[Resume]:
        """Get a resume by ID and user ID."""
        return self.db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

    def get_complete_resume(self, resume_id: UUID, user_id: UUID) -> Optional[Resume]:
        """Get complete resume with metadata and sections."""
        return self.db.query(Resume) \
            .filter(Resume.id == resume_id, Resume.user_id == user_id) \
            .options(
            joinedload(Resume.resume_metadata),
            joinedload(Resume.sections)
        ) \
            .first()

    def get_all_by_user(self, user_id: UUID) -> List[Resume]:
        """Get all resumes for a user."""
        return self.db.query(
            Resume,
            ResumeMetadata.meta_config['template'].astext.label('template_name')
        ).outerjoin(
            ResumeMetadata, Resume.id == ResumeMetadata.resume_id
        ).filter(
            Resume.user_id == user_id
        ).all()

    def get_pages(self, resume_id: UUID, user_id: UUID) -> Optional[dict]:
        """Get pages configuration for a resume."""
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

        if not resume:
            return None
        # Return default pages if none exist
        if not resume.pages:
            return {"pages": [], "activePageId": 1}

        return resume.pages

    def update_pages(self, resume_id: UUID, user_id: UUID, pages: dict) -> Optional[Resume]:
        """Update pages configuration for a resume."""
        resume = self.db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

        if not resume:
            return None

        resume.pages = pages
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def delete(self, resume_id: UUID, user_id: UUID) -> bool:
        """Delete a resume."""
        resume = self.get_by_id(resume_id, user_id)
        if resume:
            self.db.delete(resume)
            self.db.commit()
            return True
        return False