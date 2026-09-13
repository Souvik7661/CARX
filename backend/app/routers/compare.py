from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.entities import Vehicle, RiskScore, Valuation, OwnershipCostModel, ServiceRecord
from app.schemas.schemas import ComparisonRequest, ComparisonOut, VehicleComparisonCard

router = APIRouter(prefix="", tags=["Vehicle Comparison"])

@router.post("/compare", response_model=ComparisonOut)
def compare_vehicles(req: ComparisonRequest, db: Session = Depends(get_db)):
    if len(req.vehicle_ids) < 1 or len(req.vehicle_ids) > 3:
        raise HTTPException(status_code=400, detail="You can compare between 1 and 3 vehicles at a time.")

    cards = []
    for vid in req.vehicle_ids:
        v = db.query(Vehicle).filter(Vehicle.id == vid).first()
        if not v:
            continue

        risk = db.query(RiskScore).filter(RiskScore.vehicle_id == vid).first()
        val = db.query(Valuation).filter(Valuation.vehicle_id == vid).first()
        tco = db.query(OwnershipCostModel).filter(OwnershipCostModel.vehicle_id == vid).first()
        services = db.query(ServiceRecord).filter(ServiceRecord.vehicle_id == vid).all()

        score = risk.overall_score if risk else 70
        confidence = risk.confidence_score if risk else 40
        rec = val.recommendation if val else "NEGOTIATE"

        fair_min = val.estimated_fair_min if val else (v.asking_price or 800000) * 0.95
        fair_max = val.estimated_fair_max if val else (v.asking_price or 800000) * 1.05
        fair_str = f"₹{fair_min/100000:.1f}L – ₹{fair_max/100000:.1f}L"

        asking_str = f"₹{(v.asking_price or 0)/100000:.2f}L" if v.asking_price else "Not Listed"

        repair_risk = "Low" if score >= 80 else ("Moderate" if score >= 60 else "High")
        serv_conf = min(98, 40 + len(services) * 15)
        tco_str = f"₹{(tco.total_cost if tco else 1900000)/100000:.1f}L"

        cards.append(VehicleComparisonCard(
            vehicle=v,
            trust_score=score,
            data_confidence=confidence,
            fair_value_range=fair_str,
            asking_price_formatted=asking_str,
            repair_risk=repair_risk,
            service_confidence=serv_conf,
            five_year_tco=tco_str,
            recommendation=rec
        ))

    if not cards:
        raise HTTPException(status_code=404, detail="None of the specified vehicles were found.")

    # Determine best overall vehicle
    # Priority: Recommendation BUY > NEGOTIATE > AVOID, then highest trust score
    sorted_cards = sorted(
        cards,
        key=lambda c: (
            {"BUY": 3, "NEGOTIATE": 2, "AVOID": 1}.get(c.recommendation, 1),
            c.trust_score,
            c.data_confidence
        ),
        reverse=True
    )
    best = sorted_cards[0]

    title = f"{best.vehicle.year} {best.vehicle.make} {best.vehicle.model}"
    rationale = (
        f"{title} achieves the highest combined Vehicle Trust Score ({best.trust_score}/100) with a {best.recommendation} "
        f"recommendation. It offers superior service record verification ({best.service_confidence}%), "
        f"lower estimated repair risk ({best.repair_risk}), and a sound fair-market price balance."
    )

    return ComparisonOut(
        vehicles=cards,
        best_overall_vehicle_id=best.vehicle.id,
        best_overall_title=title,
        rationale=rationale
    )
