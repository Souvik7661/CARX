from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- User & Auth Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "CONSUMER"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

# --- Vehicle Schemas ---
class VehicleCreate(BaseModel):
    vin: Optional[str] = None
    reg_no: Optional[str] = None
    make: str
    model: str
    variant: Optional[str] = None
    year: int
    fuel_type: Optional[str] = "Petrol"
    transmission: Optional[str] = "Manual"
    mileage: Optional[int] = None
    asking_price: Optional[float] = None
    location: Optional[str] = None
    image_url: Optional[str] = None

class VehicleUpdate(BaseModel):
    vin: Optional[str] = None
    reg_no: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    variant: Optional[str] = None
    year: Optional[int] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    mileage: Optional[int] = None
    asking_price: Optional[float] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class VehicleImageOut(BaseModel):
    id: str
    vehicle_id: str
    angle: str
    image_url: str
    detected_damages: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DamageFindingOut(BaseModel):
    id: str
    panel: str
    damage_type: str
    severity: str
    confidence: float
    bbox_coords: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# --- Service Record Schemas ---
class ServiceRecordCreate(BaseModel):
    date: str
    odometer: int
    service_type: str
    workshop: Optional[str] = None
    total_cost: Optional[float] = 0.0
    parts_replaced: Optional[str] = None
    notes: Optional[str] = None
    source: Optional[str] = "MANUAL"

class ServiceRecordOut(BaseModel):
    id: str
    date: str
    odometer: int
    service_type: str
    workshop: Optional[str] = None
    total_cost: float
    parts_replaced: Optional[str] = None
    notes: Optional[str] = None
    is_flagged: bool
    flag_reason: Optional[str] = None
    source: str

    class Config:
        from_attributes = True

class ServiceTimelineAnalysis(BaseModel):
    total_records: int
    confidence_score: int
    confidence_reason: str
    anomalies: List[str]
    timeline: List[ServiceRecordOut]

# --- Mileage Schemas ---
class MileageAnalysisOut(BaseModel):
    status: str  # Consistent, Potential inconsistency, Unable to verify, Strong evidence of consistency
    confidence: int  # %
    summary: str
    data_points: List[Dict[str, Any]]  # [{"date": "...", "odometer": 1234, "source": "..."}]
    rollback_risk: str  # None, Low, High
    annual_average_km: Optional[float] = None

# --- Document Schemas ---
class DocumentOut(BaseModel):
    id: str
    vehicle_id: str
    doc_type: str
    file_name: str
    file_size: int
    status: str
    confidence: float
    uploaded_at: datetime
    extracted_data: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class DocumentExtractionUpdate(BaseModel):
    extracted_data: Dict[str, Any]
    is_verified: bool = True

# --- Inspection & OBD Schemas ---
class InspectionFindingCreate(BaseModel):
    category: str
    item_name: str
    condition: str  # Pass, Attention, Fail
    estimated_repair_cost: Optional[float] = 0.0
    severity: Optional[str] = "LOW"
    notes: Optional[str] = None

class InspectionFindingOut(BaseModel):
    id: str
    category: str
    item_name: str
    condition: str
    estimated_repair_cost: float
    severity: str
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class InspectionCreate(BaseModel):
    obd_codes: Optional[List[Dict[str, str]]] = None  # [{"code": "P0300", "description": "Misfire"}]
    battery_voltage: Optional[float] = None
    coolant_temp: Optional[float] = None
    engine_health: Optional[str] = "GOOD"
    notes: Optional[str] = None
    mechanic_name: Optional[str] = None
    findings: Optional[List[InspectionFindingCreate]] = None

class InspectionOut(BaseModel):
    id: str
    vehicle_id: str
    battery_voltage: Optional[float] = None
    coolant_temp: Optional[float] = None
    engine_health: Optional[str] = None
    notes: Optional[str] = None
    mechanic_name: Optional[str] = None
    is_completed: bool
    completed_at: Optional[datetime] = None
    obd_codes: Optional[List[Dict[str, str]]] = None
    findings: List[InspectionFindingOut] = []

    class Config:
        from_attributes = True

# --- Risk Score & Valuation Schemas ---
class RiskScoreOut(BaseModel):
    overall_score: int
    confidence_score: int
    documentation_score: Optional[float] = None
    service_history_score: Optional[float] = None
    mileage_score: Optional[float] = None
    visual_score: Optional[float] = None
    mechanical_score: Optional[float] = None
    market_score: Optional[float] = None
    ownership_score: Optional[float] = None
    positive_factors: List[str]
    risk_factors: List[str]
    weights_used: Dict[str, float]
    calculated_at: datetime

    class Config:
        from_attributes = True

class ValuationOut(BaseModel):
    estimated_fair_min: float
    estimated_fair_max: float
    asking_price: float
    price_difference: float
    recommendation: str  # BUY, NEGOTIATE, AVOID
    valuation_notes: Optional[str] = None
    calculated_at: datetime

    class Config:
        from_attributes = True

class ValuationCalculateRequest(BaseModel):
    asking_price: float

# --- Ownership Cost Schemas ---
class OwnershipCostOut(BaseModel):
    term_years: int
    purchase_price: float
    fuel_cost: float
    insurance_cost: float
    maintenance_cost: float
    tyres_cost: float
    depreciation_cost: float
    total_cost: float
    assumptions: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class OwnershipCalculateRequest(BaseModel):
    term_years: int = 5
    annual_km: int = 12000
    fuel_price_per_litre: float = 102.0
    fuel_efficiency_kmpl: float = 14.5
    insurance_annual: float = 24000.0

# --- Repair Prediction Schemas ---
class RepairPredictionItem(BaseModel):
    component: str
    estimated_min: float
    estimated_max: float
    priority: str  # Low, Medium, High
    reason: str
    category: str  # Detected Issue, Predicted Maintenance, User-Entered

class RepairPredictionOut(BaseModel):
    vehicle_id: str
    total_estimated_repair_min: float
    total_estimated_repair_max: float
    predictions: List[RepairPredictionItem]

# --- Vehicle Comprehensive Out ---
class VehicleOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    vin: Optional[str] = None
    reg_no: Optional[str] = None
    make: str
    model: str
    variant: Optional[str] = None
    year: int
    fuel_type: str
    transmission: str
    mileage: Optional[int] = None
    asking_price: Optional[float] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    status: str
    is_demo: bool
    created_at: datetime
    updated_at: datetime

    # Related items included if available
    risk_score: Optional[RiskScoreOut] = None
    valuation: Optional[ValuationOut] = None
    images: List[VehicleImageOut] = []
    documents: List[DocumentOut] = []
    service_records: List[ServiceRecordOut] = []
    damage_findings: List[DamageFindingOut] = []
    inspections: List[InspectionOut] = []

    class Config:
        from_attributes = True

# --- Comparison Schemas ---
class ComparisonRequest(BaseModel):
    vehicle_ids: List[str]

class VehicleComparisonCard(BaseModel):
    vehicle: VehicleOut
    trust_score: int
    data_confidence: int
    fair_value_range: str
    asking_price_formatted: str
    repair_risk: str
    service_confidence: int
    five_year_tco: str
    recommendation: str

class ComparisonOut(BaseModel):
    vehicles: List[VehicleComparisonCard]
    best_overall_vehicle_id: str
    best_overall_title: str
    rationale: str

# --- Report Schemas ---
class ReportOut(BaseModel):
    id: str
    report_code: str
    generated_at: datetime
    summary: Dict[str, Any]
    is_verified: bool

class AIProcessingJobOut(BaseModel):
    id: str
    vehicle_id: str
    job_type: str
    status: str
    progress: int
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

class DealerInventoryItem(BaseModel):
    vehicle_id: str
    title: str
    year: int
    mileage: Optional[int]
    asking_price: Optional[float]
    estimated_fair_min: Optional[float]
    estimated_fair_max: Optional[float]
    trust_score: Optional[int]
    recommendation: Optional[str]
    days_in_stock: int
    is_aging: bool  # > 60 days
    price_risk: bool  # asking > fair_max
    inspection_required: bool

class DealerStatsOut(BaseModel):
    total_inventory: int
    aging_inventory_count: int
    price_risk_count: int
    inspection_required_count: int
    average_trust_score: float
    items: List[DealerInventoryItem]

class ScoringWeightsConfig(BaseModel):
    documentation: float = 0.20
    service_history: float = 0.15
    mileage_consistency: float = 0.15
    visual_condition: float = 0.15
    mechanical_diagnostic: float = 0.15
    market_price_risk: float = 0.10
    ownership_usage_risk: float = 0.10

class SystemStatusOut(BaseModel):
    status: str
    database: str
    uptime_seconds: float
    total_vehicles: int
    total_jobs: int
    active_jobs: int
    weights: ScoringWeightsConfig
