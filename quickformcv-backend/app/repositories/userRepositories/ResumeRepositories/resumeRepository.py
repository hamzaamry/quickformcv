from uuid import UUID
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.userModels.resumeModel import Resume
from app.schemas.userSchemas.resumeSchema.resume import ResumeCreate
from app.repositories.userRepositories.ResumeRepositories.CoreResumeRepository import CoreResumeRepository
from app.repositories.userRepositories.ResumeRepositories.SectionRepository import SectionRepository
from app.repositories.userRepositories.ResumeRepositories.MetadataRepository import MetadataRepository

class ResumeRepository:
    def __init__(self, db: Session):
        self.db = db
        self.core_repo = CoreResumeRepository(db)
        self.section_repo = SectionRepository(db)
        self.metadata_repo = MetadataRepository(db)

    def create(self, user_id: UUID, resume_create: ResumeCreate) -> Resume:
        db_resume = self.core_repo.create(user_id, resume_create)
        self.metadata_repo.create_default_metadata(db_resume.id)
        return db_resume

    def create_initial_sections(self, resume_id: UUID, sections: List[Dict[str, Any]]) -> List[Any]:
        return self.section_repo.create_initial_sections(resume_id, sections)

    def get_by_id(self, resume_id: UUID, user_id: UUID) -> Optional[Resume]:
        return self.core_repo.get_by_id(resume_id, user_id)

    def get_complete_resume(self, resume_id: UUID, user_id: UUID) -> Optional[Resume]:
        return self.core_repo.get_complete_resume(resume_id, user_id)

    def get_all_by_user(self, user_id: UUID) -> List[Resume]:
        return self.core_repo.get_all_by_user(user_id)

    def get_pages(self, resume_id: UUID, user_id: UUID) -> Optional[dict]:
        """Get pages configuration for a resume."""
        return self.core_repo.get_pages(resume_id, user_id)

    def update_pages(self, resume_id: UUID, user_id: UUID, pages: dict) -> Optional[Resume]:
        """Update pages configuration for a resume."""
        return self.core_repo.update_pages(resume_id, user_id, pages)

    def delete(self, resume_id: UUID, user_id: UUID) -> bool:
        return self.core_repo.delete(resume_id, user_id)

    def add_or_update_summary_section(self, resume_id: UUID, user_id: UUID, summary_content: str) -> Resume:
        resume = self.get_by_id(resume_id, user_id)
        if not resume:
            return None
        self.section_repo.add_or_update_summary_section(resume_id, summary_content)
        return self.get_complete_resume(resume_id, user_id)

    def add_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_data: dict) -> Optional[Dict]:
        resume = self.get_by_id(resume_id, user_id)
        if not resume:
            return None
        return self.section_repo.add_section_item(resume_id, section_type, item_data)

    def update_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str, item_data: dict) -> Optional[Dict]:
        resume = self.get_by_id(resume_id, user_id)
        if not resume:
            return None
        return self.section_repo.update_section_item(resume_id, section_type, item_id, item_data)

    def delete_section_item(self, resume_id: UUID, user_id: UUID, section_type: str, item_id: str) -> Optional[Dict]:
        resume = self.get_by_id(resume_id, user_id)
        if not resume:
            return None
        return self.section_repo.delete_section_item(resume_id, section_type, item_id)