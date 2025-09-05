from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os
import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError
from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchemas.resumeSchema import ResumeCreate, ResumeInDB, ResumeComplete, Basics, SummaryUpdate, AISuggestionRequest, AISuggestionResponse
from app.schemas.userSchemas.userSchema import UserInDB
from app.services.userServices.ResumeServices.resumeService import ResumeService
from app.schemas.userSchemas.resumeSchema.base import PagesUpdate
from app.services.shared.GroqService import GroqService
from app.services.userServices.constants import LLM_SUMMARY_SUGGESTION
from app.services.agent.JobQueryGenerator import JobQueryGenerator

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

router = APIRouter(prefix="/resumes", tags=["resumes"])

def get_resume_service(db: Session = Depends(get_db)) -> ResumeService:
    return ResumeService(db)

@router.get("/{resume_id}/job-search", response_model=dict)
async def get_jobs_for_resume(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """
    Get job recommendations for a resume
    """
    try:
        # Get resume data
        resume_data = resume_service.get_complete_resume(resume_id, current_user.id)
        resume_dict = resume_data.model_dump() if hasattr(resume_data, 'model_dump') else dict(resume_data)

        # Generate and search
        groq_service = GroqService()
        job_generator = JobQueryGenerator(groq_service)
        results = await job_generator.generate_and_search(resume_dict)

        # Extract just the job data
        job_offers = []
        for query_key, query_data in results.items():
            query_results = query_data.get('results', {})
            if query_results and 'data' in query_results:
                jobs = query_results['data']
                for job in jobs:
                    job_offers.append({
                        "query_used": query_data.get('query'),
                        "job_title": job.get('job_title'),
                        "employer_name": job.get('employer_name'),
                        "job_location": job.get('job_city'),
                        "job_description": job.get('job_description', ''),
                        "job_apply_link": job.get('job_apply_link'),
                        "job_posted_at": job.get('job_posted_at_datetime_utc')
                    })

        return {
            "total_jobs_found": len(job_offers),
            "jobs": job_offers
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get job recommendations: {str(e)}"
        )

@router.post("/ai/suggest-summary", response_model=AISuggestionResponse)
async def suggest_resume_summary(
        request: AISuggestionRequest,
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Generate AI-powered resume summary suggestions based on resume data."""
    try:
        groq_service = GroqService()
        prompt = LLM_SUMMARY_SUGGESTION.format(
            resume_data=str(request.resume_data)
        )
        ai_response = await groq_service.get_AI_response(prompt)
        if not ai_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to generate AI suggestion"
            )

        cleaned = ai_response.strip()

        prefixes_to_remove = [
            "Here is the rewritten professional summary:",
            "Here is the professional summary:",
            "Here is a revised version of the professional summary:",
            "Professional summary:",
            "Summary:",
            "Here is",
            "This is",
            "Below is",
            "Generated summary:",
        ]

        for prefix in prefixes_to_remove:
            if cleaned.lower().startswith(prefix.lower()):
                cleaned = cleaned[len(prefix):].strip()
                break

        cleaned = cleaned.strip(" .,\"'")

        return AISuggestionResponse(
            success=True,
            summary_suggestion=cleaned
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating AI suggestion: {str(e)}"
        )

@router.post("/upload/image")
async def upload_image(
        file: UploadFile = File(...),
        current_user: UserInDB = Depends(get_current_active_user)
):
    """Upload image to Cloudinary and return the URL"""

    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, and WebP images are allowed."
        )

    # Validate file size (5MB limit)
    max_size = 5 * 1024 * 1024  # 5MB in bytes
    file_content = await file.read()
    if len(file_content) > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )

    try:
        # Upload to Cloudinary with transformations
        result = cloudinary.uploader.upload(
            file_content,
            folder="resume_pictures",  # Organize uploads in folders
            public_id=f"user_{current_user.id}_{file.filename.split('.')[0]}",
            transformation=[
                {"width": 300, "height": 300, "crop": "fill", "gravity": "face"},
                {"quality": "auto", "fetch_format": "auto"}
            ],
            overwrite=True
        )

        return {
            "success": True,
            "url": result["secure_url"],
            "public_id": result["public_id"]
        }

    except CloudinaryError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during upload"
        )

@router.post("", response_model=ResumeInDB)
async def create_resume(
        resume: ResumeCreate,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeInDB:
    return resume_service.create_resume(resume=resume, user_id=current_user.id)

@router.get("", response_model=List[ResumeInDB])
async def get_user_resumes(
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> List[ResumeInDB]:
    return resume_service.get_user_resumes(current_user.id)

@router.get("/{resume_id}/pages", response_model=dict)
async def get_resume_pages(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get pages configuration for a resume."""
    return resume_service.get_resume_pages(resume_id, current_user.id)

@router.delete("/{resume_id}")
async def delete_resume(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    resume_service.delete_resume(resume_id, current_user.id)
    return {"message": "Resume deleted successfully"}

@router.get("/{resume_id}", response_model=ResumeComplete)
async def get_complete_resume(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeComplete:
    """Get complete resume data including basics, metadata, and sections"""
    return resume_service.get_complete_resume(resume_id, current_user.id)

@router.get("/{resume_id}/metadata", response_model=dict)
async def get_resume_metadata(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Get metadata for a specific resume"""
    return resume_service.get_resume_metadata(resume_id, current_user.id)

@router.patch("/{resume_id}/basics", response_model=ResumeInDB)
async def update_resume_basics(
        resume_id: UUID,
        basics: Basics,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeInDB:
    """Update the basics section of a resume"""
    return resume_service.update_resume_basics(resume_id, current_user.id, basics)

@router.post("/{resume_id}/summary", response_model=ResumeComplete)
async def add_or_update_summary(
        resume_id: UUID,
        summary: SummaryUpdate,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeComplete:
    """Add or update the summary section of a resume"""
    return resume_service.add_or_update_summary(
        resume_id=resume_id,
        user_id=current_user.id,
        summary_content=summary.content
    )

@router.post("/{resume_id}/sections/{section_type}/items", response_model=ResumeComplete)
async def add_section_item(
        resume_id: UUID,
        section_type: str,
        item_data: dict,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeComplete:
    """
    Add an item to a specified section of a resume.
    """
    return resume_service.add_section_item(
        resume_id=resume_id,
        user_id=current_user.id,
        section_type=section_type,
        item_data=item_data
    )

@router.put("/{resume_id}/sections/{section_type}/items/{item_id}", response_model=ResumeComplete)
async def update_section_item(
        resume_id: UUID,
        section_type: str,
        item_id: str,
        item_data: dict,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeComplete:
    """
    Update an existing item in a specified section of a resume.
    """
    return resume_service.update_section_item(
        resume_id=resume_id,
        user_id=current_user.id,
        section_type=section_type,
        item_id=item_id,
        item_data=item_data
    )

@router.patch("/{resume_id}/pages", response_model=PagesUpdate)
async def update_resume_pages(
        resume_id: UUID,
        pages_update: PagesUpdate,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Update pages configuration for a resume."""
    return resume_service.update_resume_pages(
        resume_id=resume_id,
        user_id=current_user.id,
        pages=pages_update.model_dump()
    )

@router.patch("/{resume_id}/sections/{section_type}/items/{item_id}/toggle-visibility", response_model=dict)
async def toggle_item_visibility(
        resume_id: UUID,
        section_type: str,
        item_id: str,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """
    Toggle the visibility of an item within a resume section.
    """
    return resume_service.toggle_item_visibility(
        resume_id=resume_id,
        user_id=current_user.id,
        section_type=section_type,
        item_id=item_id
    )

@router.delete("/{resume_id}/sections/{section_type}/items/{item_id}", response_model=ResumeComplete)
async def delete_section_item(
        resume_id: UUID,
        section_type: str,
        item_id: str,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> ResumeComplete:
    """
    Delete an item from a specified section of a resume.
    """
    return resume_service.delete_section_item(
        resume_id=resume_id,
        user_id=current_user.id,
        section_type=section_type,
        item_id=item_id
    )

@router.patch("/{resume_id}/metadata", response_model=dict)
async def update_resume_metadata(
        resume_id: UUID,
        metadata: dict,
        resume_service: ResumeService = Depends(get_resume_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """Update metadata for a specific resume"""
    return resume_service.update_resume_metadata(resume_id, current_user.id, metadata)