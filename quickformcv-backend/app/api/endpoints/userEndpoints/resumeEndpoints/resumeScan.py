from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import Dict, List
import os

from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchemas.userSchema import UserInDB
from app.services.userServices.ResumeScan.ResumeScanService import ResumeScanService, logger
from app.services.userServices.utils import extract_metadata
from app.repositories.userRepositories.ScannedResumeRepository import ScannedResumeRepository
from app.schemas.userSchemas.scannedResumeSchema import ScannedResumeResponse

router = APIRouter(prefix="/resume-scan", tags=["resume-scan"])

# Service initialization with configurable parameters
def get_resume_scan_service() -> ResumeScanService:
    return ResumeScanService(
        delay_between_calls=3,  # Adjust based on your rate limits
        max_workers=2           # Number of parallel analyses to run
    )

def get_scanned_resume_repository(db: Session = Depends(get_db)) -> ScannedResumeRepository:
    return ScannedResumeRepository(db)

@router.post("/upload", response_model=Dict)
async def scan_uploaded_resume(
        resume_file: UploadFile = File(...),
        resume_scan_service: ResumeScanService = Depends(get_resume_scan_service),
        scanned_resume_repo: ScannedResumeRepository = Depends(get_scanned_resume_repository),
        current_user: UserInDB = Depends(get_current_active_user),
        db: Session = Depends(get_db)
) -> Dict:
    """
    Analyze an uploaded resume PDF using the parallel ResumeScanService and save results to database.
    Returns detailed analysis including overall score, section scores, and detailed breakdown.
    """
    # Validate file type
    if not resume_file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported"
        )

    temp_file_path = None
    try:
        # Read the file content
        file_content = await resume_file.read()

        # Save the file temporarily to process it
        temp_file_path = f"temp_{current_user.id}_{resume_file.filename}"
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file_content)

        # Extract metadata from the PDF
        try:
            metadata = extract_metadata(temp_file_path)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Failed to extract information from the resume: {str(e)}"
            )

        # Analyze the resume using parallel processing
        analysis_results = resume_scan_service.analyze_resume(metadata)

        # Save the analysis results to database
        db_scanned_resume = scanned_resume_repo.create(
            user_id=current_user.id,
            resume_data=analysis_results,
            file_name=resume_file.filename
        )

        # Add the database ID to the response
        analysis_results["id"] = str(db_scanned_resume.id)
        analysis_results["created_at"] = db_scanned_resume.created_at.isoformat()

        return analysis_results

    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing resume: {str(e)}"
        )
    finally:
        # Clean up the temporary file in all cases
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception as e:
                logger.error(f"Failed to remove temp file {temp_file_path}: {str(e)}")

@router.get("/", response_model=List[ScannedResumeResponse])
async def get_all_user_resumes(
        skip: int = Query(0, description="Number of records to skip for pagination"),
        limit: int = Query(100, description="Maximum number of records to return"),
        scanned_resume_repo: ScannedResumeRepository = Depends(get_scanned_resume_repository),
        current_user: UserInDB = Depends(get_current_active_user)
) -> List[ScannedResumeResponse]:
    """
    Get all scanned resumes for the current user with pagination.
    """
    try:
        # Get all resumes for the current user with pagination
        user_resumes = scanned_resume_repo.get_all_by_user_id(
            user_id=current_user.id,
            skip=skip,
            limit=limit
        )

        # If no resumes found, return an empty list (not an error)
        return user_resumes

    except Exception as e:
        # Log the error and return a 500 error response
        logger.error(f"Error retrieving user resumes: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving resumes: {str(e)}"
        )

@router.get("/{resume_id}", response_model=ScannedResumeResponse)
async def get_resume_by_id(
        resume_id: UUID,
        scanned_resume_repo: ScannedResumeRepository = Depends(get_scanned_resume_repository),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ScannedResumeResponse:
    """
    Get a specific scanned resume by ID, ensuring it belongs to the current user.
    """
    try:
        # Get the resume with user ownership check
        scanned_resume = scanned_resume_repo.get_by_id_and_user_id(resume_id, current_user.id)

        if not scanned_resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Resume not found or you don't have permission to access it"
            )

        return scanned_resume

    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        logger.error(f"Error retrieving resume {resume_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving resume: {str(e)}"
        )