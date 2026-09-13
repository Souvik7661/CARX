import json
import time
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import AIProcessingJob, SystemConfig, AuditLog, Vehicle, User
from app.schemas.schemas import AIProcessingJobOut, ScoringWeightsConfig, SystemStatusOut
from app.services.scoring_engine import ScoringEngine

router = APIRouter(prefix="/admin", tags=["Admin & System Configuration"])

_START_TIME = time.time()

@router.get("/health", response_model=SystemStatusOut)
def get_system_health(db: Session = Depends(get_db)):
    try:
        # DB probe
        vehicle_count = db.query(Vehicle).count()
        total_jobs = db.query(AIProcessingJob).count()
        active_jobs = db.query(AIProcessingJob).filter(AIProcessingJob.status.in_(["QUEUED", "PROCESSING"])).count()
        
        # Get weights
        conf = db.query(SystemConfig).filter(SystemConfig.key == "scoring_weights").first()
        if conf:
            weights = ScoringWeightsConfig(**json.loads(conf.value_json))
        else:
            weights = ScoringWeightsConfig(**ScoringEngine.DEFAULT_WEIGHTS)

        return SystemStatusOut(
            status="healthy",
            database="connected",
            uptime_seconds=round(time.time() - _START_TIME, 1),
            total_vehicles=vehicle_count,
            total_jobs=total_jobs,
            active_jobs=active_jobs,
            weights=weights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@router.get("/jobs", response_model=List[AIProcessingJobOut])
def get_ai_jobs(limit: int = 50, db: Session = Depends(get_db)):
    jobs = db.query(AIProcessingJob).order_by(AIProcessingJob.created_at.desc()).limit(limit).all()
    out = []
    for j in jobs:
        res = None
        if j.result_json:
            try:
                res = json.loads(j.result_json)
            except Exception:
                res = None
        out.append(AIProcessingJobOut(
            id=j.id,
            vehicle_id=j.vehicle_id,
            job_type=j.job_type,
            status=j.status,
            progress=j.progress,
            result=res,
            error_message=j.error_message,
            created_at=j.created_at,
            completed_at=j.completed_at
        ))
    return out

@router.get("/weights", response_model=ScoringWeightsConfig)
def get_scoring_weights(db: Session = Depends(get_db)):
    conf = db.query(SystemConfig).filter(SystemConfig.key == "scoring_weights").first()
    if conf:
        return ScoringWeightsConfig(**json.loads(conf.value_json))
    return ScoringWeightsConfig(**ScoringEngine.DEFAULT_WEIGHTS)

@router.put("/weights", response_model=ScoringWeightsConfig)
def update_scoring_weights(weights_in: ScoringWeightsConfig, db: Session = Depends(get_db)):
    conf = db.query(SystemConfig).filter(SystemConfig.key == "scoring_weights").first()
    weights_dict = weights_in.model_dump()
    if not conf:
        conf = SystemConfig(key="scoring_weights", value_json=json.dumps(weights_dict))
        db.add(conf)
    else:
        conf.value_json = json.dumps(weights_dict)

    audit = AuditLog(
        id=str(time.time()),
        action="SCORING_WEIGHTS_UPDATED",
        entity_type="SystemConfig",
        entity_id="scoring_weights",
        details_json=json.dumps(weights_dict)
    )
    db.add(audit)
    db.commit()

    return weights_in

@router.get("/audit-logs")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "created_at": l.created_at,
            "details": json.loads(l.details_json) if l.details_json else None
        }
        for l in logs
    ]
