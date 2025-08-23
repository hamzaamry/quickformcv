from fastapi import APIRouter, Depends
from ..middleware.authMiddleware import AuthMiddleware
from .endpoints.userEndpoints import routers as user_routers
from ..middleware.authMiddleware import PUBLIC_PATHS
from ..core.auth import get_current_active_user

auth_middleware = AuthMiddleware()

ApiRouter = APIRouter(prefix="/api/v0")

def secure_router(router: APIRouter):
    """Add authentication to all endpoints in a router unless they're public"""
    secured_router = APIRouter()

    for route in router.routes:
        full_path = f"/api/v0{route.path}"
        route_kwargs = {
            "path": route.path,
            "endpoint": route.endpoint,
            "methods": route.methods,
        }

        # Copy other route attributes
        if hasattr(route, "response_model"):
            route_kwargs["response_model"] = route.response_model
        if hasattr(route, "name"):
            route_kwargs["name"] = route.name
        if hasattr(route, "description"):
            route_kwargs["description"] = route.description

        # Check if the route should be public
        if full_path in PUBLIC_PATHS:
            secured_router.add_api_route(**route_kwargs)
        else:
            # Add auth dependency only for protected routes
            route_kwargs["dependencies"] = [Depends(get_current_active_user)]
            secured_router.add_api_route(**route_kwargs)

    return secured_router

for router in user_routers:
    ApiRouter.include_router(secure_router(router))