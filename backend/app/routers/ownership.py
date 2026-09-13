import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.entities import Vehicle, OwnershipCostModel
from app.schemas.schemas import OwnershipCostOut, OwnershipCalculateRequest
from app.services.ownership_service import ownership_service

router = APIRouter(prefix="", tags=["Ownership Cost"])

@router.get("/vehicles/{vehicle_id}/ownership-cost", response_model=OwnershipCostOut)
def get_ownership_cost(vehicle_id: str, term_years: int = 5, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    model = db.query(OwnershipCostModel).filter(
        OwnershipCostModel.vehicle_id == vehicle_id,
        OwnershipCostModel.term_years == term_years
    ).first()

    if not model:
        # Calculate dynamic model
        price = vehicle.asking_price or 850000.0
        res = ownership_service.calculate_tco(
            purchase_price=price,
            term_years=term_years,
            fuel_type=vehicle.fuel_type
        )
        return {
            "term_years": res["term_years"],
            "purchase_price": res["purchase_price"],
            "fuel_cost": res["fuel_cost"],
            "insurance_cost": res["insurance_cost"],
            "maintenance_cost": res["maintenance_cost"],
            "tyres_cost": res["tyres_cost"],
            "depreciation_cost": res["depreciation_cost"],
            "total_cost": res["total_cost"],
            "assumptions": res["assumptions"]
        }

    return {
        "term_years": model.term_years,
        "purchase_price": model.purchase_price,
        "fuel_cost": model.fuel_cost,
        "insurance_cost": model.insurance_cost,
        "maintenance_cost": model.maintenance_cost,
        "tyres_cost": model.tyres_cost,
        "depreciation_cost": model.depreciation_cost,
        "total_cost": model.total_cost,
        "assumptions": json.loads(model.assumptions_json) if model.assumptions_json else None
    }

@router.post("/vehicles/{vehicle_id}/ownership-cost", response_model=OwnershipCostOut)
def recalculate_ownership_cost(
    vehicle_id: str,
    req: OwnershipCalculateRequest,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    price = vehicle.asking_price or 850000.0
    res = ownership_service.calculate_tco(
        purchase_price=price,
        term_years=req.term_years,
        annual_km=req.annual_km,
        fuel_price_per_litre=req.fuel_price_per_litre,
        fuel_efficiency_kmpl=req.fuel_efficiency_kmpl,
        insurance_annual=req.insurance_annual,
        fuel_type=vehicle.fuel_type
    )

    # Save to database
    model = db.query(OwnershipCostModel).filter(
        OwnershipCostModel.vehicle_id == vehicle_id,
        OwnershipCostModel.term_years == req.term_years
    ).first()

    if not model:
        model = OwnershipCostModel(id=f"{vehicle_id}-{req.term_years}", vehicle_id=vehicle_id)
        db.add(model)

    model.term_years = res["term_years"]
    model.purchase_price = res["purchase_price"]
    model.fuel_cost = res["fuel_cost"]
    model.insurance_cost = res["insurance_cost"]
    model.maintenance_cost = res["maintenance_cost"]
    model.tyres_cost = res["tyres_cost"]
    model.depreciation_cost = res["depreciation_cost"]
    model.total_cost = res["total_cost"]
    model.assumptions_json = json.dumps(res["assumptions"])
    model.calculated_at = datetime.utcnow()

    db.commit()

    return {
        "term_years": res["term_years"],
        "purchase_price": res["purchase_price"],
        "fuel_cost": res["fuel_cost"],
        "insurance_cost": res["insurance_cost"],
        "maintenance_cost": res["maintenance_cost"],
        "tyres_cost": res["tyres_cost"],
        "depreciation_cost": res["depreciation_cost"],
        "total_cost": res["total_cost"],
        "assumptions": res["assumptions"]
    }
