from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.userRepositories.ResumeRepositories.resumeRepository import ResumeRepository
from app.schemas.userSchemas.resumeSchema import ResumeComplete
from app.utils.logging_config import logger

class SectionsService:
    def __init__(self, db: Session):
        self.repository = ResumeRepository(db)

    def add_or_update_summary(self, resume_id: UUID, user_id: UUID, summary_content: str) -> ResumeComplete:
        """Add or update the summary section of a resume"""
        try:
            resume = self.repository.get_by_id(resume_id, user_id)
            if not resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

            updated_resume = self.repository.add_or_update_summary_section(
                resume_id=resume_id,
                user_id=user_id,
                summary_content=summary_content,
            )

            if not updated_resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

            return None

        except Exception as e:
            logger.error(f"Error updating resume summary: {e}")
            raise

    def add_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_data: dict) -> None:
        """
        Add an item to a specified section of a resume.
        """
        try:
            resume = self.repository.get_by_id(resume_id, user_id)
            if not resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

            updated_section = self.repository.add_section_item(
                resume_id=resume_id,
                user_id=user_id,
                section_type=section_type,
                item_data=item_data
            )

            if not updated_section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Section '{section_type}' not found"
                )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error adding section item: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error adding section item: {str(e)}"
            )

    def update_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str, item_data: dict) -> None:
        """
        Update an existing item in a specified section of a resume.
        """
        try:
            resume = self.repository.get_by_id(resume_id, user_id)
            if not resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

            updated_section = self.repository.update_section_item(
                resume_id=resume_id,
                user_id=user_id,
                section_type=section_type,
                item_id=item_id,
                item_data=item_data
            )

            if not updated_section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Item not found in section '{section_type}'"
                )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating section item: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error updating section item: {str(e)}"
            )

    def delete_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str) -> None:
        """
        Delete an item from a specified section of a resume.
        """
        try:
            resume = self.repository.get_by_id(resume_id, user_id)
            if not resume:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

            updated_section = self.repository.delete_section_item(
                resume_id=resume_id,
                user_id=user_id,
                section_type=section_type,
                item_id=item_id
            )

            if not updated_section:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Item not found in section '{section_type}'"
                )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting section item: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error deleting section item: {str(e)}"
            )
