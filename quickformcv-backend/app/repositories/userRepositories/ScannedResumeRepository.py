from typing import List, Optional, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.userModels.scannedResumeModel import ScannedResume


class ScannedResumeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: UUID, resume_data: Dict[str, Any], file_name: str) -> ScannedResume:
        """
        Create a new scanned resume entry
        """
        db_scanned_resume = ScannedResume(
            user_id=user_id,
            title=file_name,
            overall_score=resume_data["overall_score"],
            section_scores=resume_data["section_scores"],
            detailed_analysis=resume_data["detailed_analysis"],
            processing_time=resume_data.get("processing_time")
        )
        self.db.add(db_scanned_resume)
        self.db.commit()
        self.db.refresh(db_scanned_resume)
        return db_scanned_resume

    def get_all_by_user_id(self, user_id: UUID, skip: int = 0, limit: int = 100) -> List[ScannedResume]:
        """
        Get all scanned resumes for a specific user with pagination
        """
        return (
            self.db.query(ScannedResume)
            .filter(ScannedResume.user_id == user_id)
            .order_by(ScannedResume.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_id(self, resume_id: UUID) -> Optional[ScannedResume]:
        """
        Get a specific scanned resume by ID
        """
        return self.db.query(ScannedResume).filter(ScannedResume.id == resume_id).first()

    def get_by_id_and_user_id(self, resume_id: UUID, user_id: UUID) -> Optional[ScannedResume]:
        """
        Get a specific scanned resume by ID and ensure it belongs to the specified user
        """
        return (
            self.db.query(ScannedResume)
            .filter(ScannedResume.id == resume_id, ScannedResume.user_id == user_id)
            .first()
        )

    def delete(self, resume_id: UUID, user_id: UUID) -> bool:
        """
        Delete a scanned resume if it belongs to the specified user
        """
        db_resume = self.get_by_id_and_user_id(resume_id, user_id)
        if not db_resume:
            return False

        self.db.delete(db_resume)
        self.db.commit()
        return True

    def get_latest_by_user_id(self, user_id: UUID) -> Optional[ScannedResume]:
        """
        """
        return (
            self.db.query(ScannedResume)
            .filter(ScannedResume.user_id == user_id)
            .order_by(ScannedResume.created_at.desc())
            .first()
        )

    def count_by_user_id(self, user_id: UUID) -> int:
        """
        Count the number of scanned resumes for a user

        Args:
            user_id: The ID of the user

        Returns:
            The count of scanned resumes
        """
        return (
            self.db.query(ScannedResume)
            .filter(ScannedResume.user_id == user_id)
            .count()
        )

    def get_average_score_by_user_id(self, user_id: UUID) -> Optional[float]:
        """
        Calculate the average overall score of all scanned resumes for a user
        """
        from sqlalchemy import func

        result = (
            self.db.query(func.avg(ScannedResume.overall_score))
            .filter(ScannedResume.user_id == user_id)
            .scalar()
        )

        return float(result) if result is not None else None