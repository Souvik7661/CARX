import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.scoring_engine import ScoringEngine
from app.services.mileage_service import MileageService
from app.services.valuation_engine import ValuationEngine
from app.services.ownership_service import OwnershipService

client = TestClient(app)

# ---------------------------------------------------------
# Unit Tests: Scoring Engine
# ---------------------------------------------------------
def test_scoring_engine_empty():
    res = ScoringEngine.calculate_trust_score(
        documents=[],
        service_records=[],
        mileage_analysis={"status": "Unable to verify", "rollback_risk": "None"},
        damage_findings=[],
        inspection=None,
        valuation=None,
        vehicle_meta={"year": 2021, "mileage": 45000, "has_images": False}
    )
    # When all evidence is missing, confidence should be low
    assert res["confidence_score"] <= 35
    assert 0 <= res["overall_score"] <= 100
    assert len(res["risk_factors"]) > 0

def test_scoring_engine_high_trust():
    res = ScoringEngine.calculate_trust_score(
        documents=[{"doc_type": "RC"}, {"doc_type": "INSURANCE"}, {"doc_type": "SERVICE_INVOICE"}],
        service_records=[
            {"date": "2022-01-01", "odometer": 10000, "is_flagged": False},
            {"date": "2023-01-01", "odometer": 20000, "is_flagged": False},
            {"date": "2024-01-01", "odometer": 30000, "is_flagged": False}
        ],
        mileage_analysis={"status": "Strong evidence of consistency", "rollback_risk": "None"},
        damage_findings=[],
        inspection={"obd_codes": [], "battery_voltage": 12.6, "engine_health": "EXCELLENT"},
        valuation={"recommendation": "BUY", "asking_price": 850000.0, "estimated_fair_max": 900000.0},
        vehicle_meta={"year": 2022, "mileage": 30000, "has_images": True}
    )
    assert res["overall_score"] >= 85
    assert res["confidence_score"] >= 80
    assert len(res["positive_factors"]) >= 3

# ---------------------------------------------------------
# Unit Tests: Mileage Anomaly Detection
# ---------------------------------------------------------
def test_mileage_rollback_detection():
    records = [
        {"date": "2022-01-01", "odometer": 20000, "source": "Dealer"},
        {"date": "2023-01-01", "odometer": 45000, "source": "Service Center"},
        {"date": "2024-01-01", "odometer": 30000, "source": "Current Inspection"}  # Rollback!
    ]
    res = MileageService.analyze_mileage(records)
    assert res["status"] == "Potential inconsistency"
    assert res["rollback_risk"] == "High"
    assert len(res["anomalies"]) > 0

def test_mileage_consistent():
    records = [
        {"date": "2021-01-01", "odometer": 12000},
        {"date": "2022-01-01", "odometer": 24000},
        {"date": "2023-01-01", "odometer": 35000},
        {"date": "2024-01-01", "odometer": 46000}
    ]
    res = MileageService.analyze_mileage(records)
    assert res["status"] == "Strong evidence of consistency"
    assert res["rollback_risk"] == "None"
    assert res["confidence"] >= 90

# ---------------------------------------------------------
# Unit Tests: Valuation Engine
# ---------------------------------------------------------
def test_valuation_fair_buy():
    res = ValuationEngine.calculate_fair_value(
        make="Hyundai",
        model="Creta",
        year=2021,
        mileage=45000,
        asking_price=920000.0,
        condition_score=85.0
    )
    assert res["estimated_fair_min"] <= res["estimated_fair_max"]
    assert res["recommendation"] in ["BUY", "NEGOTIATE"]

def test_valuation_overpriced_avoid():
    res = ValuationEngine.calculate_fair_value(
        make="Hyundai",
        model="Creta",
        year=2021,
        mileage=45000,
        asking_price=1600000.0,  # Ridiculously high
        condition_score=70.0
    )
    assert res["recommendation"] == "AVOID"

# ---------------------------------------------------------
# Unit Tests: Ownership Cost Calculator
# ---------------------------------------------------------
def test_ownership_tco_calculation():
    res = OwnershipService.calculate_tco(
        purchase_price=900000.0,
        term_years=5,
        annual_km=12000,
        fuel_price_per_litre=100.0,
        fuel_efficiency_kmpl=15.0
    )
    assert res["term_years"] == 5
    assert res["fuel_cost"] > 0
    assert res["total_cost"] > res["purchase_price"]
    assert res["estimated_resale_value"] < res["purchase_price"]

# ---------------------------------------------------------
# Integration Tests: API Endpoints
# ---------------------------------------------------------
def test_health_check_api():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

def test_list_demo_vehicles_api():
    response = client.get("/api/vehicles?is_demo=true")
    assert response.status_code == 200
    vehicles = response.json()
    assert len(vehicles) >= 3
    # Check that the 3 demo vehicles exist
    ids = {v["id"] for v in vehicles}
    assert "demo-vehicle-a" in ids
    assert "demo-vehicle-b" in ids
    assert "demo-vehicle-c" in ids

def test_get_single_vehicle_workspace():
    response = client.get("/api/vehicles/demo-vehicle-a")
    assert response.status_code == 200
    data = response.json()
    assert data["make"] == "Hyundai"
    assert data["model"] == "Creta"
    assert data["risk_score"] is not None
    assert data["risk_score"]["overall_score"] >= 80

def test_compare_endpoint():
    response = client.post("/api/compare", json={"vehicle_ids": ["demo-vehicle-a", "demo-vehicle-b", "demo-vehicle-c"]})
    assert response.status_code == 200
    data = response.json()
    assert len(data["vehicles"]) == 3
    assert data["best_overall_vehicle_id"] == "demo-vehicle-a"
    assert "Creta" in data["best_overall_title"]

def test_dealer_stats_endpoint():
    response = client.get("/api/dealer/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_inventory"] >= 3
    assert data["aging_inventory_count"] >= 1  # Vehicle B & C are aging

def test_admin_weights_endpoint():
    response = client.get("/api/admin/weights")
    assert response.status_code == 200
    weights = response.json()
    assert "documentation" in weights
    assert weights["documentation"] == 0.20
