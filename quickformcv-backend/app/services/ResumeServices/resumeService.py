from typing import List, Dict
from uuid import UUID
from sqlalchemy.orm import Session

from app.schemas.resumeSchema import ResumeCreate, ResumeInDB, ResumeComplete, Basics
from app.services.ResumeServices.CoreResumeService import CoreResumeService
from app.services.ResumeServices.MetadataService import MetadataService
from app.services.ResumeServices.SectionsService import SectionsService

class ResumeService:
    """
    Facade service that coordinates between CoreResumeService, MetadataService,
    and SectionsService to provide a unified interface for resume operations.
    """

    def __init__(self, db: Session):
        self.core_service = CoreResumeService(db)
        self.metadata_service = MetadataService(db)
        self.sections_service = SectionsService(db)

    def create_resume(self, resume: ResumeCreate, user_id: UUID) -> ResumeInDB:
        return self.core_service.create_resume(resume, user_id)

    def get_resume(self, resume_id: UUID, user_id: UUID) -> ResumeInDB:
        return self.core_service.get_resume(resume_id, user_id)

    def get_user_resumes(self, user_id: UUID) -> List[ResumeInDB]:
        return self.core_service.get_user_resumes(user_id)

    def get_complete_resume(self, resume_id: UUID, user_id: UUID) -> ResumeComplete:
        return self.core_service.get_complete_resume(resume_id, user_id)

    def get_resume_pages(self, resume_id: UUID, user_id: UUID) -> dict:
        """Get pages configuration for a resume."""
        return self.core_service.get_resume_pages(resume_id, user_id)

    def update_resume_pages(self, resume_id: UUID, user_id: UUID, pages: dict) -> dict:
        """Update pages configuration for a resume."""
        return self.core_service.update_resume_pages(resume_id, user_id, pages)

    def get_resume_metadata(self, resume_id: UUID, user_id: UUID) -> Dict:
        """Get metadata for a specific resume"""
        return self.metadata_service.get_metadata(resume_id)

    def delete_resume(self, resume_id: UUID, user_id: UUID) -> bool:
        return self.core_service.delete_resume(resume_id, user_id)

    def update_resume_metadata(self, resume_id: UUID, user_id: UUID, metadata: dict) -> Dict:
        updated_metadata = self.metadata_service.update_metadata(resume_id, metadata)
        return updated_metadata.meta_config

    def update_resume_basics(self, resume_id: UUID, user_id: UUID, basics: Basics) -> ResumeInDB:
        return self.metadata_service.update_resume_basics(resume_id, user_id, basics)

    def add_or_update_summary(self, resume_id: UUID, user_id: UUID, summary_content: str) -> ResumeComplete:
        self.sections_service.add_or_update_summary(resume_id, user_id, summary_content)
        return self.get_complete_resume(resume_id, user_id)

    def toggle_item_visibility(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str) -> Dict:
        result = self.sections_service.toggle_item_visibility(resume_id, user_id, section_type, item_id)
        return result

    def add_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_data: dict) -> ResumeComplete:
        self.sections_service.add_section_item(resume_id, user_id, section_type, item_data)
        return self.get_complete_resume(resume_id, user_id)

    def update_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str, item_data: dict) -> ResumeComplete:
        self.sections_service.update_section_item(resume_id, user_id, section_type, item_id, item_data)
        return self.get_complete_resume(resume_id, user_id)

    def delete_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str) -> ResumeComplete:
        self.sections_service.delete_section_item(resume_id, user_id, section_type, item_id)
        return self.get_complete_resume(resume_id, user_id)