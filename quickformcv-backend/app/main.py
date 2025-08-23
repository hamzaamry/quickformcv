import os
from contextlib import asynccontextmanager
import time
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from .api.routes import ApiRouter
from .Database import verify_database_connection
from .utils.logging_config import logger
from .utils.startup import display_startup_sequence
from .core.config import settings

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Skip logging for health checks in production
        if request.url.path == "/health":
            return await call_next(request)

        logger.info(f"→ {request.method} {request.url.path}")

        try:
            response = await call_next(request)
            process_time = (time.time() - start_time) * 1000

            logger.info(
                f"← {request.method} {request.url.path} "
                f"[{response.status_code}] "
                f"{process_time:.2f}ms"
            )

            return response

        except Exception as e:
            process_time = (time.time() - start_time) * 1000
            logger.error(
                f"✗ {request.method} {request.url.path} failed after {process_time:.2f}ms: {str(e)}"
            )
            raise

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Add CSP header for production
        if not settings.DEBUG:
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self'; "
                "connect-src 'self'"
            )

        return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    display_startup_sequence(logger)

    try:
        verify_database_connection()
        logger.info("Database connection verified successfully")
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

    yield

    logger.info("Shutting down application...")

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application
    """
    app = FastAPI(
        title="Clara - AI Interviewer",
        version="0.1.0",
        description="AI-powered interviewer API",
        lifespan=lifespan,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
    )

    # Add security middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # Add trusted host middleware for production
    if not settings.DEBUG:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.ALLOWED_HOSTS
        )

    # Add gzip compression
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # Add request logging middleware
    app.add_middleware(RequestLoggingMiddleware)

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"]
    )

    # Include API routes
    app.include_router(ApiRouter)

    # Health check endpoint
    @app.get("/health", include_in_schema=False)
    async def health_check():
        """Health check endpoint for load balancers and monitoring"""
        try:
            # You can add more health checks here (database, redis, etc.)
            return {"status": "healthy", "service": "clara-api"}
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            raise HTTPException(status_code=503, detail="Service unhealthy")

    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception on {request.method} {request.url}: {str(exc)}")

        if settings.DEBUG:
            # In debug mode, show the actual error
            return JSONResponse(
                status_code=500,
                content={"detail": str(exc), "type": type(exc).__name__}
            )
        else:
            # In production, return a generic error
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error"}
            )

    return app

app = create_app()

if __name__ == "__main__":
    # This is only used for local development
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning",
        access_log=settings.DEBUG,
    )