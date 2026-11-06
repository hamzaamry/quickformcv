from typing import List
from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.ResumeRepositories.resumeRepository import ResumeRepository
from app.schemas.resumeSchema import ResumeCreate, ResumeInDB, ResumeComplete, Metadata
from app.schemas.resumeSchema.base import Pages
from app.utils.logging_config import logger
from app.services.utils.ServicesUtils import parse_basics_data, transform_sections
from app.services.constants import DEFAULT_RESUME_SECTIONS
from app.services.SubscriptionService import SubscriptionService

class CoreResumeService:
    def __init__(self, db: Session):
        self.repository = ResumeRepository(db)
        self.subscription_service = SubscriptionService(db)

    def create_resume(self, resume: ResumeCreate, user_id: UUID) -> ResumeInDB:
        """Create a new resume with default values after checking subscription limits."""
        try:
            self.subscription_service.validate_resume_creation(user_id)

            new_resume = self.repository.create(user_id=user_id, resume_create=resume)
            self.repository.create_initial_sections(resume_id=new_resume.id, sections=DEFAULT_RESUME_SECTIONS)
            return new_resume
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error creating resume: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the resume"
            )

    def get_resume(self, resume_id: UUID, user_id: UUID) -> ResumeInDB:
        try:
            resume = self.repository.get_by_id(resume_id, user_id)
            if not resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
            return resume
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving resume: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving the resume"
            )

    def get_user_resumes(self, user_id: UUID) -> List[ResumeInDB]:
        """Get all resumes for a user with template names."""
        try:
            results = self.repository.get_all_by_user(user_id)

            resumes = []
            for resume, template_name in results:
                resume_dict = {
                    "id": resume.id,
                    "user_id": resume.user_id,
                    "title": resume.title,
                    "jobDescription": resume.job_description,
                    "basics": resume.basics,
                    "pages": resume.pages,
                    "created_at": resume.created_at,
                    "updated_at": resume.updated_at,
                    "template_name": template_name
                }
                resumes.append(ResumeInDB(**resume_dict))

            return resumes
        except Exception as e:
            logger.error(f"Error retrieving user resumes: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving resumes"
            )

    def get_complete_resume(self, resume_id: UUID, user_id: UUID) -> ResumeComplete:
        """Get a complete resume with all sections and metadata."""
        try:
            resume = self.repository.get_complete_resume(resume_id, user_id)
            if not resume:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )

            basics = parse_basics_data(resume.basics, resume_id)
            transformed_sections = transform_sections(resume.sections)
            metadata = Metadata(**resume.resume_metadata.meta_config)
            pages_data = resume.pages if resume.pages else {"pages": [], "activePageId": 1}
            pages = Pages(**pages_data)

            return ResumeComplete(
                id=resume.id,
                user_id=resume.user_id,
                title=resume.title,
                jobDescription=resume.job_description or "",
                basics=basics,
                metadata=metadata,
                pages=pages,
                sections=transformed_sections,
                created_at=resume.created_at,
                updated_at=resume.updated_at
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving complete resume: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving the complete resume"
            )

    def get_resume_pages(self, resume_id: UUID, user_id: UUID) -> dict:
        """Get pages configuration for a resume."""
        try:
            pages = self.repository.get_pages(resume_id, user_id)
            if not pages:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )
            return pages
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error retrieving resume pages: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while retrieving resume pages"
            )

    def update_resume_pages(self, resume_id: UUID, user_id: UUID, pages: dict) -> dict:
        """Update pages configuration for a resume."""
        try:
            updated_resume = self.repository.update_pages(resume_id, user_id, pages)
            if not updated_resume:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )
            return updated_resume.pages or {"pages": [], "activePageId": 1}
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating resume pages: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while updating resume pages"
            )

    def delete_resume(self, resume_id: UUID, user_id: UUID) -> bool:
        """Delete a resume by ID and user ID."""
        try:
            deleted = self.repository.delete(resume_id, user_id)
            if not deleted:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Resume not found"
                )
            return deleted
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting resume: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while deleting the resume"
            )

    def get_user_resume_count(self, user_id: UUID) -> int:
        """Get the count of resumes for a user."""
        try:
            return self.repository.get_user_resume_count(user_id)
        except Exception as e:
            logger.error(f"Error getting user resume count: {e}")
            return 0