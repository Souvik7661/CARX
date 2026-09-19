from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, ServiceRecord
from app.schemas.schemas import MileageAnalysisOut
from app.services.mileage_service import mileage_service

router = APIRouter(prefix="", tags=["Mileage Analysis"])

@router.get("/vehicles/{vehicle_id}/mileage", response_model=MileageAnalysisOut)
def get_mileage_analysis(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    records = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).all()
    record_dicts = [
        {"date": r.date, "odometer": r.odometer, "source": r.source or "Service Record"}
        for r in records
    ]

    analysis = mileage_service.analyze_mileage(record_dicts, declared_odometer=vehicle.mileage)
    return analysis
