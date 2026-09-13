from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle
from app.schemas.schemas import VehicleOut
from app.scripts.seed import seed_database

router = APIRouter(prefix="/demo", tags=["Demo Vehicles"])

@router.post("/seed")
def trigger_demo_seed():
    seed_database()
    return {"status": "success", "message": "Demo vehicles and sample users seeded successfully."}

@router.get("/vehicles", response_model=List[VehicleOut])
def get_demo_vehicles(db: Session = Depends(get_db)):
    # Ensure seeded
    demos = db.query(Vehicle).filter(Vehicle.is_demo == True).all()
    if not demos:
        seed_database()
        demos = db.query(Vehicle).filter(Vehicle.is_demo == True).all()
    return demos
