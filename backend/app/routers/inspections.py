import uuid
import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, Inspection, InspectionFinding, AuditLog
from app.schemas.schemas import InspectionCreate, InspectionOut, InspectionFindingCreate, InspectionFindingOut

router = APIRouter(prefix="", tags=["Inspector & OBD Diagnostics"])

@router.post("/vehicles/{vehicle_id}/inspections", response_model=InspectionOut)
def record_vehicle_inspection(
    vehicle_id: str,
    insp_in: InspectionCreate,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    inspection = db.query(Inspection).filter(Inspection.vehicle_id == vehicle_id).first()
    if not inspection:
        inspection = Inspection(
            id=str(uuid.uuid4()),
            vehicle_id=vehicle_id
        )
        db.add(inspection)

    inspection.battery_voltage = insp_in.battery_voltage or 12.6
    inspection.coolant_temp = insp_in.coolant_temp or 89.0
    inspection.engine_health = insp_in.engine_health or "GOOD"
    inspection.notes = insp_in.notes or "Comprehensive mechanical & OBD inspection completed."
    inspection.mechanic_name = insp_in.mechanic_name or "Certified Technician (ASE/CARX)"
    inspection.is_completed = True
    inspection.completed_at = datetime.utcnow()
    inspection.obd_codes_json = json.dumps(insp_in.obd_codes or [])

    # Delete existing findings and replace
    db.query(InspectionFinding).filter(InspectionFinding.inspection_id == inspection.id).delete()

    created_findings = []
    if insp_in.findings:
        for f in insp_in.findings:
            item = InspectionFinding(
                id=str(uuid.uuid4()),
                inspection_id=inspection.id,
                category=f.category,
                item_name=f.item_name,
                condition=f.condition,
                estimated_repair_cost=f.estimated_repair_cost or 0.0,
                severity=f.severity or "LOW",
                notes=f.notes
            )
            db.add(item)
            created_findings.append(item)

    audit = AuditLog(
        id=str(uuid.uuid4()),
        action="INSPECTION_SUBMITTED",
        entity_type="Inspection",
        entity_id=inspection.id,
        details_json=json.dumps({"mechanic": inspection.mechanic_name, "obd_count": len(insp_in.obd_codes or [])})
    )
    db.add(audit)

    db.commit()
    db.refresh(inspection)

    findings_out = db.query(InspectionFinding).filter(InspectionFinding.inspection_id == inspection.id).all()

    return {
        "id": inspection.id,
        "vehicle_id": inspection.vehicle_id,
        "battery_voltage": inspection.battery_voltage,
        "coolant_temp": inspection.coolant_temp,
        "engine_health": inspection.engine_health,
        "notes": inspection.notes,
        "mechanic_name": inspection.mechanic_name,
        "is_completed": inspection.is_completed,
        "completed_at": inspection.completed_at,
        "obd_codes": json.loads(inspection.obd_codes_json) if inspection.obd_codes_json else [],
        "findings": findings_out
    }

@router.get("/vehicles/{vehicle_id}/inspections", response_model=List[InspectionOut])
def get_vehicle_inspections(vehicle_id: str, db: Session = Depends(get_db)):
    inspections = db.query(Inspection).filter(Inspection.vehicle_id == vehicle_id).all()
    results = []
    for insp in inspections:
        obd = []
        if insp.obd_codes_json:
            try:
                obd = json.loads(insp.obd_codes_json)
            except Exception:
                obd = []
        findings = db.query(InspectionFinding).filter(InspectionFinding.inspection_id == insp.id).all()
        results.append({
            "id": insp.id,
            "vehicle_id": insp.vehicle_id,
            "battery_voltage": insp.battery_voltage,
            "coolant_temp": insp.coolant_temp,
            "engine_health": insp.engine_health,
            "notes": insp.notes,
            "mechanic_name": insp.mechanic_name,
            "is_completed": insp.is_completed,
            "completed_at": insp.completed_at,
            "obd_codes": obd,
            "findings": findings
        })
    return results
