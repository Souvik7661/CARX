import uuid
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, ServiceRecord, AuditLog
from app.schemas.schemas import ServiceRecordCreate, ServiceRecordOut, ServiceTimelineAnalysis

router = APIRouter(prefix="", tags=["Service History"])

@router.post("/vehicles/{vehicle_id}/service-records", response_model=ServiceRecordOut)
def add_service_record(
    vehicle_id: str,
    record_in: ServiceRecordCreate,
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    rec_id = str(uuid.uuid4())
    record = ServiceRecord(
        id=rec_id,
        vehicle_id=vehicle_id,
        date=record_in.date,
        odometer=record_in.odometer,
        service_type=record_in.service_type,
        workshop=record_in.workshop,
        total_cost=record_in.total_cost or 0.0,
        parts_replaced=record_in.parts_replaced,
        notes=record_in.notes,
        is_flagged=False,
        source=record_in.source or "MANUAL"
    )

    # Anomaly check against previous records
    all_recs = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).all()
    for prev in all_recs:
        if prev.date < record.date and prev.odometer > record.odometer:
            record.is_flagged = True
            record.flag_reason = f"Odometer rollback: previous record on {prev.date} was {prev.odometer} km"
        elif prev.date > record.date and prev.odometer < record.odometer:
            record.is_flagged = True
            record.flag_reason = f"Odometer rollback: subsequent record on {prev.date} was {prev.odometer} km"

    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/vehicles/{vehicle_id}/service-records", response_model=List[ServiceRecordOut])
def get_service_records(vehicle_id: str, db: Session = Depends(get_db)):
    return db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).order_by(ServiceRecord.date.asc()).all()

@router.get("/vehicles/{vehicle_id}/service-history", response_model=ServiceTimelineAnalysis)
def get_service_history_analysis(vehicle_id: str, db: Session = Depends(get_db)):
    records = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).order_by(ServiceRecord.date.asc()).all()
    
    if not records:
        return {
            "total_records": 0,
            "confidence_score": 15,
            "confidence_reason": "No documented service records exist in the repository. Complete maintenance history cannot be confirmed.",
            "anomalies": ["Missing historical service documentation"],
            "timeline": []
        }

    anomalies = []
    confidence = 60 + min(35, len(records) * 10)
    
    # Check intervals and gaps
    for i in range(len(records) - 1):
        r1 = records[i]
        r2 = records[i+1]
        try:
            d1 = datetime.strptime(r1.date[:10], "%Y-%m-%d")
            d2 = datetime.strptime(r2.date[:10], "%Y-%m-%d")
            months = (d2.year - d1.year) * 12 + (d2.month - d1.month)
            if months > 14:
                anomalies.append(f"Unusually long service gap: {months} months between {r1.date} and {r2.date}")
                confidence -= 10
        except Exception:
            pass

        if r2.odometer < r1.odometer:
            anomalies.append(f"Odometer discrepancy: {r1.odometer:,} km on {r1.date} vs {r2.odometer:,} km on {r2.date}")
            confidence -= 25

    # Check expensive repairs or repeated parts
    expensive = [r for r in records if r.total_cost and r.total_cost > 35000]
    if expensive:
        for ex in expensive:
            anomalies.append(f"High-cost repair bill of ₹{ex.total_cost:,.0f} recorded on {ex.date} ({ex.service_type})")

    confidence = max(10, min(100, confidence))

    if not anomalies and len(records) >= 3:
        reason = f"Excellent documentation across {len(records)} continuous maintenance events with verified periodic intervals."
    elif anomalies:
        reason = f"Documented history identified {len(anomalies)} caution item(s) regarding service timing or repair magnitude."
    else:
        reason = f"Basic service log with {len(records)} entry(s). Maintenance history appears acceptable but limited."

    return {
        "total_records": len(records),
        "confidence_score": confidence,
        "confidence_reason": reason,
        "anomalies": anomalies,
        "timeline": records
    }
