from .userEndpoints import router as UserRouter
from .authEndpoints import router as AuthRouter
from .resumeEndpoints.resumeEndpoints import router as ResumeRouter
from .ai.ResumeGenerator import router as resume_generator_router
from .resumeEndpoints.resumeScan import router as resume_scan_router

routers = [UserRouter, AuthRouter, ResumeRouter, resume_generator_router, resume_scan_router]