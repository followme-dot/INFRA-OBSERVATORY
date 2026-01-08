from fastapi import APIRouter
from app.routers import health, platforms, services, overview

api_router = APIRouter()

# Health check routes
api_router.include_router(health.router, tags=["Health"])

# Overview routes
api_router.include_router(overview.router, prefix="/overview", tags=["Overview"])

# Platform routes
api_router.include_router(platforms.router, prefix="/platforms", tags=["Platforms"])

# Service routes
api_router.include_router(services.router, prefix="/services", tags=["Services"])
