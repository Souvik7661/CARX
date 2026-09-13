import os
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models.entities import Vehicle
from app.scripts.seed import seed_database

# Routers
from app.routers import (
    auth,
    vehicles,
    documents,
    images,
    services,
    mileage,
    analysis,
    valuation,
    ownership,
    repairs,
    inspections,
    reports,
    compare,
    dealer,
    admin,
    demo
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-grade AI Vehicle Intelligence and Decision-Support Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js local frontend and any network client
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount local uploads directory for document & photo storage abstraction
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Global latency and error tracking middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(round(process_time, 4))
        return response
    except Exception as e:
        process_time = time.time() - start_time
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error", "error": str(e)},
            headers={"X-Process-Time": str(round(process_time, 4))}
        )

# Health endpoint (Section 31)
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "CARX Vehicle Intelligence API",
        "database": "connected",
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Register API Routers under /api
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(vehicles.router, prefix=api_prefix)
app.include_router(documents.router, prefix=api_prefix)
app.include_router(images.router, prefix=api_prefix)
app.include_router(services.router, prefix=api_prefix)
app.include_router(mileage.router, prefix=api_prefix)
app.include_router(analysis.router, prefix=api_prefix)
app.include_router(valuation.router, prefix=api_prefix)
app.include_router(ownership.router, prefix=api_prefix)
app.include_router(repairs.router, prefix=api_prefix)
app.include_router(inspections.router, prefix=api_prefix)
app.include_router(reports.router, prefix=api_prefix)
app.include_router(compare.router, prefix=api_prefix)
app.include_router(dealer.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)
app.include_router(demo.router, prefix=api_prefix)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        # Check if vehicles exist, if not seed initial demo data
        count = db.query(Vehicle).count()
        if count == 0:
            print("No vehicles found in database. Seeding demo archetypes...")
            seed_database()
        else:
            print(f"CARX Engine started with {count} vehicles in registry.")
    finally:
        db.close()
