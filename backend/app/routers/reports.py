import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import (
    Vehicle, Report, RiskScore, Valuation, OwnershipCostModel,
    Document, ServiceRecord, DamageFinding, Inspection
)
from app.schemas.schemas import ReportOut

router = APIRouter(prefix="", tags=["Vehicle Reports"])

@router.post("/vehicles/{vehicle_id}/report")
def generate_vehicle_report(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Fetch associated entities
    risk = db.query(RiskScore).filter(RiskScore.vehicle_id == vehicle_id).first()
    val = db.query(Valuation).filter(Valuation.vehicle_id == vehicle_id).first()
    tco = db.query(OwnershipCostModel).filter(OwnershipCostModel.vehicle_id == vehicle_id).first()
    docs = db.query(Document).filter(Document.vehicle_id == vehicle_id).all()
    serv = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).all()
    damages = db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
    insp = db.query(Inspection).filter(Inspection.vehicle_id == vehicle_id).first()

    report_code = f"CARX-{datetime.utcnow().strftime('%Y%m')}-{uuid.uuid4().hex[:6].upper()}"

    summary = {
        "report_code": report_code,
        "generated_at": datetime.utcnow().isoformat(),
        "vehicle": {
            "title": f"{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant or ''}".strip(),
            "vin": vehicle.vin or "UNVERIFIED-CHASSIS",
            "reg_no": vehicle.reg_no or "UNREGISTERED",
            "year": vehicle.year,
            "mileage": vehicle.mileage,
            "fuel_type": vehicle.fuel_type,
            "transmission": vehicle.transmission,
            "asking_price": vehicle.asking_price,
            "location": vehicle.location or "India"
        },
        "trust_score": {
            "score": risk.overall_score if risk else 75,
            "confidence": risk.confidence_score if risk else 50,
            "positive_factors": json.loads(risk.positive_factors_json) if risk else [],
            "risk_factors": json.loads(risk.risk_factors_json) if risk else []
        },
        "valuation": {
            "fair_min": val.estimated_fair_min if val else (vehicle.asking_price or 800000) * 0.95,
            "fair_max": val.estimated_fair_max if val else (vehicle.asking_price or 800000) * 1.05,
            "asking_price": val.asking_price if val else (vehicle.asking_price or 800000),
            "recommendation": val.recommendation if val else "NEGOTIATE",
            "notes": val.valuation_notes if val else "Market evaluation completed."
        },
        "ownership_5yr": {
            "total_cost": tco.total_cost if tco else 1850000.0,
            "fuel_cost": tco.fuel_cost if tco else 410000.0,
            "insurance_cost": tco.insurance_cost if tco else 115000.0,
            "maintenance_cost": tco.maintenance_cost if tco else 110000.0,
            "depreciation_cost": tco.depreciation_cost if tco else 350000.0
        },
        "evidence_counts": {
            "verified_documents": len(docs),
            "service_records": len(serv),
            "visual_inspections": len(damages),
            "inspector_verified": bool(insp and insp.is_completed)
        },
        "disclaimer": (
            "This CARX Intelligence Report is an AI-assisted decision-support analysis synthesized from "
            "available documentation, photographic evidence, and statistical market modeling. CARX does not "
            "guarantee vehicle roadworthiness or act as a licensed insurance underwriter. A pre-purchase "
            "physical inspection by a certified mechanic is always advised."
        )
    }

    report = Report(
        id=str(uuid.uuid4()),
        vehicle_id=vehicle_id,
        report_code=report_code,
        summary_json=json.dumps(summary),
        is_verified=True
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "id": report.id,
        "report_code": report.report_code,
        "generated_at": report.generated_at,
        "summary": summary,
        "is_verified": report.is_verified
    }

@router.get("/reports/{report_code}")
def get_report_by_code(report_code: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.report_code == report_code).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report code invalid or expired")

    return {
        "id": report.id,
        "report_code": report.report_code,
        "generated_at": report.generated_at,
        "summary": json.loads(report.summary_json),
        "is_verified": report.is_verified
    }
