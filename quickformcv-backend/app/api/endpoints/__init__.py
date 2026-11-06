from .userEndpoints import router as UserRouter
from .authEndpoints import router as AuthRouter
from .resumeEndpoints import router as ResumeRouter
from .jobsEndpoints import router as JobsRouter
from .suggestionEndpoints import router as SuggestionsRouter
from .subscriptionEndpoints import router as SubscriptionRouter

routers = [UserRouter, AuthRouter, ResumeRouter, JobsRouter, SuggestionsRouter, SubscriptionRouter]