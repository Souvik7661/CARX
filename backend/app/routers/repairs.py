import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, DamageFinding, ServiceRecord, Inspection
from app.schemas.schemas import RepairPredictionOut
from app.services.ai_repair_service import ai_repair_service

router = APIRouter(prefix="", tags=["Repair Predictions"])

@router.get("/vehicles/{vehicle_id}/repairs", response_model=RepairPredictionOut)
def get_repair_predictions(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    damages = db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
    damage_dicts = [{"panel": d.panel, "damage_type": d.damage_type, "severity": d.severity} for d in damages]

    records = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).all()
    record_dicts = [{"service_type": r.service_type, "parts_replaced": r.parts_replaced} for r in records]

    insp = db.query(Inspection).filter(Inspection.vehicle_id == vehicle_id).first()
    obd_list = []
    if insp and insp.obd_codes_json:
        try:
            obd_list = json.loads(insp.obd_codes_json)
        except Exception:
            obd_list = []

    res = ai_repair_service.predict_repairs(
        year=vehicle.year,
        mileage=vehicle.mileage or 40000,
        damage_findings=damage_dicts,
        service_records=record_dicts,
        obd_codes=obd_list
    )
    res["vehicle_id"] = vehicle_id
    return res
