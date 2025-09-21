from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.Database import get_db
from app.core.auth import get_current_active_user
from app.schemas.userSchema import UserInDB
from app.services import (
    ResumeService,
    GroqService,
    JobQueryGenerator,
    SubscriptionService
)

router = APIRouter(prefix="/jobs", tags=["jobs"])

def get_resume_service(db: Session = Depends(get_db)) -> ResumeService:
    return ResumeService(db)

def get_subscription_service(db: Session = Depends(get_db)) -> SubscriptionService:
    return SubscriptionService(db)

@router.get("/{resume_id}", response_model=dict)
async def get_jobs_for_resume(
        resume_id: UUID,
        resume_service: ResumeService = Depends(get_resume_service),
        subscription_service: SubscriptionService = Depends(get_subscription_service),
        current_user: UserInDB = Depends(get_current_active_user)
) -> dict:
    """
    Get job recommendations for a resume
    """
    try:
        # Check subscription limits first
        can_search, message = subscription_service.can_search_jobs(current_user.id)
        if not can_search:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )

        # Consume job search credit
        subscription_service.consume_job_search(current_user.id)

        # Get resume data
        resume_data = resume_service.get_complete_resume(resume_id, current_user.id)
        resume_dict = resume_data.model_dump() if hasattr(resume_data, 'model_dump') else dict(resume_data)

        # Generate and search
        groq_service = GroqService()
        job_generator = JobQueryGenerator(groq_service)
        results = await job_generator.generate_and_search(resume_dict)

        # Extract job data
        all_jobs = []
        for query_key, query_data in results.items():
            query_results = query_data.get('results', {})
            if query_results and 'data' in query_results:
                jobs = query_results['data']
                for job in jobs:
                    all_jobs.append({
                        "query_used": query_data.get('query'),
                        "job_title": job.get('job_title'),
                        "employer_name": job.get('employer_name'),
                        "job_location": job.get('job_city'),
                        "job_description": job.get('job_description', ''),
                        "job_apply_link": job.get('job_apply_link'),
                        "job_posted_at": job.get('job_posted_at_datetime_utc')
                    })

        # Apply subscription-based result limiting
        total_jobs = len(all_jobs)
        visible_jobs_count = subscription_service.get_job_results_limit(current_user.id, total_jobs)
        visible_jobs = all_jobs[:visible_jobs_count]

        # Get subscription info for response
        subscription_info = subscription_service.get_subscription_info(current_user.id)

        return {
            "total_jobs_found": total_jobs,
            "jobs_visible": len(visible_jobs),
            "jobs": visible_jobs,
            "subscription_info": {
                "tier": subscription_info.tier,
                "job_searches_remaining": max(0, subscription_info.job_searches_limit - subscription_info.job_searches_used) if subscription_info.job_searches_limit != -1 else "unlimited",
                "results_visibility_percentage": int(subscription_service.get_subscription_limits(subscription_info.tier).job_results_visibility * 100),
                "upgrade_message": f"Showing {len(visible_jobs)} of {total_jobs} results. Upgrade to see more!" if len(visible_jobs) < total_jobs else None
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get job recommendations: {str(e)}"
        )