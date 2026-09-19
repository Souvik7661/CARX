from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.entities import Vehicle, DealerInventory, Valuation, RiskScore, Inspection
from app.schemas.schemas import DealerStatsOut, DealerInventoryItem

router = APIRouter(prefix="/dealer", tags=["Dealer Intelligence"])

@router.get("/stats", response_model=DealerStatsOut)
def get_dealer_dashboard_stats(db: Session = Depends(get_db)):
    vehicles = db.query(Vehicle).all()
    
    total_inventory = len(vehicles)
    aging_count = 0
    price_risk_count = 0
    inspection_req_count = 0
    total_score = 0
    scored_count = 0
    items = []

    for v in vehicles:
        inv = db.query(DealerInventory).filter(DealerInventory.vehicle_id == v.id).first()
        val = db.query(Valuation).filter(Valuation.vehicle_id == v.id).first()
        risk = db.query(RiskScore).filter(RiskScore.vehicle_id == v.id).first()
        insp = db.query(Inspection).filter(Inspection.vehicle_id == v.id).first()

        days = inv.days_in_stock if inv else 15
        is_aging = days > 60
        if is_aging:
            aging_count += 1

        price_risk = False
        if val and v.asking_price and v.asking_price > val.estimated_fair_max:
            price_risk = True
            price_risk_count += 1

        insp_req = not bool(insp and insp.is_completed)
        if insp_req:
            inspection_req_count += 1

        score = risk.overall_score if risk else None
        if score is not None:
            total_score += score
            scored_count += 1

        items.append(DealerInventoryItem(
            vehicle_id=v.id,
            title=f"{v.year} {v.make} {v.model} {v.variant or ''}".strip(),
            year=v.year,
            mileage=v.mileage,
            asking_price=v.asking_price,
            estimated_fair_min=val.estimated_fair_min if val else None,
            estimated_fair_max=val.estimated_fair_max if val else None,
            trust_score=score,
            recommendation=val.recommendation if val else None,
            days_in_stock=days,
            is_aging=is_aging,
            price_risk=price_risk,
            inspection_required=insp_req
        ))

    avg_score = round(total_score / max(1, scored_count), 1) if scored_count > 0 else 75.0

    return DealerStatsOut(
        total_inventory=total_inventory,
        aging_inventory_count=aging_count,
        price_risk_count=price_risk_count,
        inspection_required_count=inspection_req_count,
        average_trust_score=avg_score,
        items=items
    )
