from .userEndpoints import router as UserRouter
from .authEndpoints import router as AuthRouter
from .resumeEndpoints.resumeEndpoints import router as ResumeRouter

routers = [UserRouter, AuthRouter, ResumeRouter]