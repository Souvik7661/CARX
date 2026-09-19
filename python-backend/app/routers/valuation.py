from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.entities import Vehicle, Valuation, DamageFinding
from app.schemas.schemas import ValuationOut, ValuationCalculateRequest
from app.services.valuation_engine import valuation_engine

router = APIRouter(prefix="", tags=["Valuation"])

@router.get("/vehicles/{vehicle_id}/valuation", response_model=ValuationOut)
def get_vehicle_valuation(vehicle_id: str, db: Session = Depends(get_db)):
    val = db.query(Valuation).filter(Valuation.vehicle_id == vehicle_id).first()
    if not val:
        # Calculate dynamically if not yet stored
        vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
        
        damages = db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
        damage_dicts = [{"panel": d.panel, "severity": d.severity} for d in damages]
        
        res = valuation_engine.calculate_fair_value(
            make=vehicle.make,
            model=vehicle.model,
            year=vehicle.year,
            mileage=vehicle.mileage or 40000,
            asking_price=vehicle.asking_price or 900000.0,
            damage_findings=damage_dicts
        )
        val = Valuation(
            id=vehicle_id,
            vehicle_id=vehicle_id,
            estimated_fair_min=res["estimated_fair_min"],
            estimated_fair_max=res["estimated_fair_max"],
            asking_price=res["asking_price"],
            price_difference=res["price_difference"],
            recommendation=res["recommendation"],
            valuation_notes=res["valuation_notes"]
        )
        db.add(val)
        db.commit()
        db.refresh(val)

    return val

@router.post("/vehicles/{vehicle_id}/valuation", response_model=ValuationOut)
def recalculate_valuation(
    vehicle_id: str,
    req: ValuationCalculateRequest,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle.asking_price = req.asking_price

    damages = db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
    damage_dicts = [{"panel": d.panel, "severity": d.severity} for d in damages]

    res = valuation_engine.calculate_fair_value(
        make=vehicle.make,
        model=vehicle.model,
        year=vehicle.year,
        mileage=vehicle.mileage or 40000,
        asking_price=req.asking_price,
        damage_findings=damage_dicts
    )

    val = db.query(Valuation).filter(Valuation.vehicle_id == vehicle_id).first()
    if not val:
        val = Valuation(id=vehicle_id, vehicle_id=vehicle_id)
        db.add(val)

    val.estimated_fair_min = res["estimated_fair_min"]
    val.estimated_fair_max = res["estimated_fair_max"]
    val.asking_price = res["asking_price"]
    val.price_difference = res["price_difference"]
    val.recommendation = res["recommendation"]
    val.valuation_notes = res["valuation_notes"]
    val.calculated_at = datetime.utcnow()

    db.commit()
    db.refresh(val)
    return val
