import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import (
    Vehicle, Document, ServiceRecord, Inspection, DamageFinding,
    RiskScore, Valuation, OwnershipCostModel, Report, SystemConfig,
    AIProcessingJob, AuditLog
)
from app.schemas.schemas import RiskScoreOut
from app.services.scoring_engine import scoring_engine
from app.services.valuation_engine import valuation_engine
from app.services.mileage_service import mileage_service
from app.services.ownership_service import ownership_service

router = APIRouter(prefix="", tags=["Vehicle Intelligence & Analysis"])

@router.post("/vehicles/{vehicle_id}/analyze")
def trigger_vehicle_analysis(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Create job
    job = AIProcessingJob(
        id=str(uuid.uuid4()),
        vehicle_id=vehicle_id,
        job_type="HOLISTIC_ANALYSIS",
        status="PROCESSING",
        progress=20,
        created_at=datetime.utcnow()
    )
    db.add(job)
    db.commit()

    # 1. Fetch all vehicle artifacts
    documents = db.query(Document).filter(Document.vehicle_id == vehicle_id).all()
    doc_dicts = [{"doc_type": d.doc_type, "confidence": d.confidence} for d in documents]

    service_records = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vehicle_id).order_by(ServiceRecord.date.asc()).all()
    serv_dicts = [
        {"date": s.date, "odometer": s.odometer, "is_flagged": s.is_flagged, "flag_reason": s.flag_reason, "source": s.source}
        for s in service_records
    ]

    mileage_analysis = mileage_service.analyze_mileage(serv_dicts, declared_odometer=vehicle.mileage)

    damage_findings = db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
    damage_dicts = [
        {"panel": d.panel, "damage_type": d.damage_type, "severity": d.severity, "confidence": d.confidence}
        for d in damage_findings
    ]

    inspection = db.query(Inspection).filter(Inspection.vehicle_id == vehicle_id).first()
    insp_dict = None
    if inspection:
        insp_dict = {
            "obd_codes": inspection.obd_codes_json,
            "battery_voltage": inspection.battery_voltage,
            "coolant_temp": inspection.coolant_temp,
            "engine_health": inspection.engine_health
        }

    # 2. Check for custom scoring weights in SystemConfig
    custom_weights = None
    config_weights = db.query(SystemConfig).filter(SystemConfig.key == "scoring_weights").first()
    if config_weights:
        try:
            custom_weights = json.loads(config_weights.value_json)
        except Exception:
            custom_weights = None

    # 3. Calculate Valuation first
    asking = vehicle.asking_price or 850000.0
    val_result = valuation_engine.calculate_fair_value(
        make=vehicle.make,
        model=vehicle.model,
        year=vehicle.year,
        mileage=vehicle.mileage or 40000,
        asking_price=asking,
        condition_score=85.0,
        damage_findings=damage_dicts
    )

    # Save / Update Valuation
    val_model = db.query(Valuation).filter(Valuation.vehicle_id == vehicle_id).first()
    if not val_model:
        val_model = Valuation(
            id=str(uuid.uuid4()),
            vehicle_id=vehicle_id,
            estimated_fair_min=val_result["estimated_fair_min"],
            estimated_fair_max=val_result["estimated_fair_max"],
            asking_price=val_result["asking_price"],
            price_difference=val_result["price_difference"],
            recommendation=val_result["recommendation"],
            valuation_notes=val_result["valuation_notes"]
        )
        db.add(val_model)
    else:
        val_model.estimated_fair_min = val_result["estimated_fair_min"]
        val_model.estimated_fair_max = val_result["estimated_fair_max"]
        val_model.asking_price = val_result["asking_price"]
        val_model.price_difference = val_result["price_difference"]
        val_model.recommendation = val_result["recommendation"]
        val_model.valuation_notes = val_result["valuation_notes"]
        val_model.calculated_at = datetime.utcnow()

    # 4. Calculate Holistic Trust Score
    vehicle_meta = {
        "year": vehicle.year,
        "mileage": vehicle.mileage,
        "has_images": len(vehicle.images) > 0
    }
    score_result = scoring_engine.calculate_trust_score(
        documents=doc_dicts,
        service_records=serv_dicts,
        mileage_analysis=mileage_analysis,
        damage_findings=damage_dicts,
        inspection=insp_dict,
        valuation=val_result,
        vehicle_meta=vehicle_meta,
        custom_weights=custom_weights
    )

    # Save / Update RiskScore
    risk_model = db.query(RiskScore).filter(RiskScore.vehicle_id == vehicle_id).first()
    if not risk_model:
        risk_model = RiskScore(
            id=str(uuid.uuid4()),
            vehicle_id=vehicle_id,
            overall_score=score_result["overall_score"],
            confidence_score=score_result["confidence_score"],
            documentation_score=score_result["documentation_score"],
            service_history_score=score_result["service_history_score"],
            mileage_score=score_result["mileage_score"],
            visual_score=score_result["visual_score"],
            mechanical_score=score_result["mechanical_score"],
            market_score=score_result["market_score"],
            ownership_score=score_result["ownership_score"],
            positive_factors_json=json.dumps(score_result["positive_factors"]),
            risk_factors_json=json.dumps(score_result["risk_factors"]),
            weights_used_json=json.dumps(score_result["weights_used"]),
            calculated_at=datetime.utcnow()
        )
        db.add(risk_model)
    else:
        risk_model.overall_score = score_result["overall_score"]
        risk_model.confidence_score = score_result["confidence_score"]
        risk_model.documentation_score = score_result["documentation_score"]
        risk_model.service_history_score = score_result["service_history_score"]
        risk_model.mileage_score = score_result["mileage_score"]
        risk_model.visual_score = score_result["visual_score"]
        risk_model.mechanical_score = score_result["mechanical_score"]
        risk_model.market_score = score_result["market_score"]
        risk_model.ownership_score = score_result["ownership_score"]
        risk_model.positive_factors_json = json.dumps(score_result["positive_factors"])
        risk_model.risk_factors_json = json.dumps(score_result["risk_factors"])
        risk_model.weights_used_json = json.dumps(score_result["weights_used"])
        risk_model.calculated_at = datetime.utcnow()

    # 5. Default 5-Year Ownership Model if not existing
    own_model = db.query(OwnershipCostModel).filter(OwnershipCostModel.vehicle_id == vehicle_id).first()
    if not own_model:
        tco_res = ownership_service.calculate_tco(
            purchase_price=asking,
            term_years=5,
            annual_km=12000,
            fuel_type=vehicle.fuel_type
        )
        own_model = OwnershipCostModel(
            id=str(uuid.uuid4()),
            vehicle_id=vehicle_id,
            term_years=5,
            purchase_price=tco_res["purchase_price"],
            fuel_cost=tco_res["fuel_cost"],
            insurance_cost=tco_res["insurance_cost"],
            maintenance_cost=tco_res["maintenance_cost"],
            tyres_cost=tco_res["tyres_cost"],
            depreciation_cost=tco_res["depreciation_cost"],
            total_cost=tco_res["total_cost"],
            assumptions_json=json.dumps(tco_res["assumptions"]),
            calculated_at=datetime.utcnow()
        )
        db.add(own_model)

    # Update vehicle status
    vehicle.status = "ANALYZED"
    job.status = "COMPLETED"
    job.progress = 100
    job.result_json = json.dumps({
        "overall_score": score_result["overall_score"],
        "recommendation": val_result["recommendation"]
    })
    job.completed_at = datetime.utcnow()

    audit = AuditLog(
        id=str(uuid.uuid4()),
        action="VEHICLE_ANALYSIS_COMPLETED",
        entity_type="Vehicle",
        entity_id=vehicle_id,
        details_json=json.dumps({"score": score_result["overall_score"], "decision": val_result["recommendation"]})
    )
    db.add(audit)

    db.commit()

    return {
        "status": "success",
        "vehicle_id": vehicle_id,
        "trust_score": score_result["overall_score"],
        "confidence": score_result["confidence_score"],
        "recommendation": val_result["recommendation"],
        "fair_min": val_result["estimated_fair_min"],
        "fair_max": val_result["estimated_fair_max"]
    }

@router.get("/vehicles/{vehicle_id}/score", response_model=RiskScoreOut)
def get_vehicle_score(vehicle_id: str, db: Session = Depends(get_db)):
    risk = db.query(RiskScore).filter(RiskScore.vehicle_id == vehicle_id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Score not calculated yet. Run POST /vehicles/{id}/analyze first.")

    return {
        "overall_score": risk.overall_score,
        "confidence_score": risk.confidence_score,
        "documentation_score": risk.documentation_score,
        "service_history_score": risk.service_history_score,
        "mileage_score": risk.mileage_score,
        "visual_score": risk.visual_score,
        "mechanical_score": risk.mechanical_score,
        "market_score": risk.market_score,
        "ownership_score": risk.ownership_score,
        "positive_factors": json.loads(risk.positive_factors_json),
        "risk_factors": json.loads(risk.risk_factors_json),
        "weights_used": json.loads(risk.weights_used_json),
        "calculated_at": risk.calculated_at
    }
