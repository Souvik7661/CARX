import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, AuditLog, DealerInventory
from app.schemas.schemas import VehicleCreate, VehicleUpdate, VehicleOut

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.post("", response_model=VehicleOut)
def create_vehicle(vehicle_in: VehicleCreate, db: Session = Depends(get_db)):
    vehicle_id = str(uuid.uuid4())
    
    # Smart fallback image if not provided
    default_img = vehicle_in.image_url or "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80"
    
    vehicle = Vehicle(
        id=vehicle_id,
        vin=vehicle_in.vin.upper() if vehicle_in.vin else None,
        reg_no=vehicle_in.reg_no.upper() if vehicle_in.reg_no else None,
        make=vehicle_in.make.strip(),
        model=vehicle_in.model.strip(),
        variant=vehicle_in.variant.strip() if vehicle_in.variant else None,
        year=vehicle_in.year,
        fuel_type=vehicle_in.fuel_type or "Petrol",
        transmission=vehicle_in.transmission or "Manual",
        mileage=vehicle_in.mileage,
        asking_price=vehicle_in.asking_price,
        location=vehicle_in.location,
        image_url=default_img,
        status="DRAFT",
        is_demo=False
    )
    db.add(vehicle)

    # Automatically add to dealer inventory if asking price exists
    dealer_inv = DealerInventory(
        id=str(uuid.uuid4()),
        vehicle_id=vehicle_id,
        days_in_stock=12,
        purchase_cost=(vehicle_in.asking_price * 0.92) if vehicle_in.asking_price else None,
        target_margin=8.0
    )
    db.add(dealer_inv)

    audit = AuditLog(
        id=str(uuid.uuid4()),
        action="VEHICLE_CREATED",
        entity_type="Vehicle",
        entity_id=vehicle_id
    )
    db.add(audit)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.get("", response_model=List[VehicleOut])
def list_vehicles(
    query: Optional[str] = None,
    is_demo: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    q = db.query(Vehicle)
    if is_demo is not None:
        q = q.filter(Vehicle.is_demo == is_demo)
    if query:
        search = f"%{query}%"
        q = q.filter(
            (Vehicle.make.ilike(search)) |
            (Vehicle.model.ilike(search)) |
            (Vehicle.reg_no.ilike(search)) |
            (Vehicle.vin.ilike(search))
        )
    return q.order_by(Vehicle.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: str, vehicle_update: VehicleUpdate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    update_data = vehicle_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)

    audit = AuditLog(
        id=str(uuid.uuid4()),
        action="VEHICLE_UPDATED",
        entity_type="Vehicle",
        entity_id=vehicle_id
    )
    db.add(audit)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db.delete(vehicle)
    db.commit()
    return {"status": "success", "message": "Vehicle deleted successfully"}
