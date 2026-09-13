import uuid
import json
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, VehicleImage, DamageFinding, AIProcessingJob, AuditLog
from app.schemas.schemas import VehicleImageOut, DamageFindingOut
from app.services.storage_service import storage_service
from app.services.ai_vision_service import ai_vision_service

router = APIRouter(prefix="", tags=["Images & Computer Vision"])

@router.post("/vehicles/{vehicle_id}/images", response_model=VehicleImageOut)
async def upload_vehicle_image(
    vehicle_id: str,
    angle: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    stored = await storage_service.save_file(file, subfolder="images")
    image_id = str(uuid.uuid4())

    # Create job
    job = AIProcessingJob(
        id=str(uuid.uuid4()),
        vehicle_id=vehicle_id,
        job_type="VISION_DAMAGE",
        status="PROCESSING",
        progress=50,
        created_at=datetime.utcnow()
    )
    db.add(job)

    # Analyze with Computer Vision service
    detected_damages = ai_vision_service.analyze_vehicle_image(angle, stored["url"])

    # Create VehicleImage
    img = VehicleImage(
        id=image_id,
        vehicle_id=vehicle_id,
        angle=angle.lower(),
        image_url=stored["url"],
        file_path=stored["file_path"],
        detected_damages_json=json.dumps(detected_damages)
    )
    db.add(img)

    # Set as primary vehicle image if it's the front view
    if angle.lower() == "front" or not vehicle.image_url or "unsplash" in vehicle.image_url:
        vehicle.image_url = stored["url"]

    # Save individual damage findings
    for d in detected_damages:
        finding = DamageFinding(
            id=str(uuid.uuid4()),
            vehicle_id=vehicle_id,
            image_id=image_id,
            panel=d["panel"],
            damage_type=d["damage_type"],
            severity=d["severity"],
            confidence=d["confidence"],
            bbox_coords=d.get("bbox_coords"),
            notes=d.get("notes")
        )
        db.add(finding)

    job.status = "COMPLETED"
    job.progress = 100
    job.result_json = json.dumps({"findings_count": len(detected_damages)})
    job.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(img)

    return {
        "id": img.id,
        "vehicle_id": img.vehicle_id,
        "angle": img.angle,
        "image_url": img.image_url,
        "detected_damages": detected_damages,
        "created_at": img.created_at
    }

@router.get("/vehicles/{vehicle_id}/images", response_model=List[VehicleImageOut])
def get_vehicle_images(vehicle_id: str, db: Session = Depends(get_db)):
    images = db.query(VehicleImage).filter(VehicleImage.vehicle_id == vehicle_id).all()
    results = []
    for img in images:
        damages = []
        if img.detected_damages_json:
            try:
                damages = json.loads(img.detected_damages_json)
            except Exception:
                damages = []
        results.append({
            "id": img.id,
            "vehicle_id": img.vehicle_id,
            "angle": img.angle,
            "image_url": img.image_url,
            "detected_damages": damages,
            "created_at": img.created_at
        })
    return results

@router.get("/vehicles/{vehicle_id}/damages", response_model=List[DamageFindingOut])
def get_vehicle_damages(vehicle_id: str, db: Session = Depends(get_db)):
    return db.query(DamageFinding).filter(DamageFinding.vehicle_id == vehicle_id).all()
