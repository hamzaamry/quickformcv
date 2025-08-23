from uuid import UUID
from typing import Optional
from sqlalchemy.orm import Session
from app.models.userModels.resumeModel import ResumeMetadata
from app.schemas.userSchemas.resumeSchema.metadata import Metadata

class MetadataRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_default_metadata(self, resume_id: UUID) -> ResumeMetadata:
        """Create default metadata for a resume."""
        default_metadata = Metadata()
        db_metadata = ResumeMetadata(
            resume_id=resume_id,
            meta_config=default_metadata.model_dump()
        )
        self.db.add(db_metadata)
        self.db.commit()
        return db_metadata

    def get_metadata(self, resume_id: UUID) -> Optional[ResumeMetadata]:
        """Get metadata for a resume."""
        return self.db.query(ResumeMetadata).filter(
            ResumeMetadata.resume_id == resume_id
        ).first()

    def update_metadata(self, resume_id: UUID, metadata: dict) -> Optional[ResumeMetadata]:
        """Update metadata for a resume."""
        db_metadata = self.get_metadata(resume_id)
        if not db_metadata:
            return None

        db_metadata.meta_config = metadata
        self.db.commit()
        self.db.refresh(db_metadata)
        return db_metadata