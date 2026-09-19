import datetime
import json
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="CONSUMER")  # CONSUMER, INSPECTOR, DEALER, ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicles = relationship("Vehicle", back_populates="owner")
    inspections = relationship("Inspection", back_populates="inspector")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    vin = Column(String(100), index=True, nullable=True)
    reg_no = Column(String(50), index=True, nullable=True)
    make = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    variant = Column(String(100), nullable=True)
    year = Column(Integer, nullable=False)
    fuel_type = Column(String(50), default="Petrol")  # Petrol, Diesel, Electric, Hybrid, CNG
    transmission = Column(String(50), default="Manual")  # Manual, Automatic
    mileage = Column(Integer, nullable=True)  # in km
    asking_price = Column(Float, nullable=True)  # in INR
    location = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    status = Column(String(50), default="DRAFT")  # DRAFT, ANALYZED, ARCHIVED
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="vehicles")
    images = relationship("VehicleImage", back_populates="vehicle", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="vehicle", cascade="all, delete-orphan")
    service_records = relationship("ServiceRecord", back_populates="vehicle", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="vehicle", cascade="all, delete-orphan")
    damage_findings = relationship("DamageFinding", back_populates="vehicle", cascade="all, delete-orphan")
    risk_score = relationship("RiskScore", back_populates="vehicle", uselist=False, cascade="all, delete-orphan")
    valuation = relationship("Valuation", back_populates="vehicle", uselist=False, cascade="all, delete-orphan")
    ownership_models = relationship("OwnershipCostModel", back_populates="vehicle", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="vehicle", cascade="all, delete-orphan")
    jobs = relationship("AIProcessingJob", back_populates="vehicle", cascade="all, delete-orphan")
    inventory_item = relationship("DealerInventory", back_populates="vehicle", uselist=False, cascade="all, delete-orphan")

class VehicleImage(Base):
    __tablename__ = "vehicle_images"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    angle = Column(String(50), nullable=False)  # front, rear, left, right, interior, engine, tyres, dashboard, closeup
    image_url = Column(String(500), nullable=False)
    file_path = Column(String(500), nullable=True)
    detected_damages_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="images")
    damage_findings = relationship("DamageFinding", back_populates="image")

    @property
    def detected_damages(self):
        if self.detected_damages_json:
            try:
                return json.loads(self.detected_damages_json)
            except Exception:
                return []
        return []

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    doc_type = Column(String(50), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    status = Column(String(50), default="PENDING")
    confidence = Column(Float, default=0.0)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="documents")
    extractions = relationship("DocumentExtraction", back_populates="document", uselist=False, cascade="all, delete-orphan")

    @property
    def extracted_data(self):
        if self.extractions and self.extractions.extracted_data_json:
            try:
                return json.loads(self.extractions.extracted_data_json)
            except Exception:
                return None
        return None

class DocumentExtraction(Base):
    __tablename__ = "document_extractions"

    id = Column(String(36), primary_key=True, index=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    extracted_data_json = Column(Text, nullable=False)
    is_verified = Column(Boolean, default=False)
    verified_by = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    document = relationship("Document", back_populates="extractions")

class ServiceRecord(Base):
    __tablename__ = "service_records"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    odometer = Column(Integer, nullable=False)
    service_type = Column(String(100), nullable=False)
    workshop = Column(String(200), nullable=True)
    total_cost = Column(Float, default=0.0)
    parts_replaced = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    is_flagged = Column(Boolean, default=False)
    flag_reason = Column(String(255), nullable=True)
    source = Column(String(50), default="MANUAL")

    vehicle = relationship("Vehicle", back_populates="service_records")

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    inspector_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    obd_codes_json = Column(Text, nullable=True)
    battery_voltage = Column(Float, nullable=True)
    coolant_temp = Column(Float, nullable=True)
    engine_health = Column(String(50), default="GOOD")
    notes = Column(Text, nullable=True)
    mechanic_name = Column(String(100), nullable=True)
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    vehicle = relationship("Vehicle", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections")
    findings = relationship("InspectionFinding", back_populates="inspection", cascade="all, delete-orphan")

    @property
    def obd_codes(self):
        if self.obd_codes_json:
            try:
                return json.loads(self.obd_codes_json)
            except Exception:
                return []
        return []

class InspectionFinding(Base):
    __tablename__ = "inspection_findings"

    id = Column(String(36), primary_key=True, index=True)
    inspection_id = Column(String(36), ForeignKey("inspections.id"), nullable=False)
    category = Column(String(50), nullable=False)
    item_name = Column(String(100), nullable=False)
    condition = Column(String(50), nullable=False)
    estimated_repair_cost = Column(Float, default=0.0)
    severity = Column(String(20), default="LOW")
    notes = Column(Text, nullable=True)

    inspection = relationship("Inspection", back_populates="findings")

class DamageFinding(Base):
    __tablename__ = "damage_findings"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    image_id = Column(String(36), ForeignKey("vehicle_images.id"), nullable=True)
    panel = Column(String(100), nullable=False)
    damage_type = Column(String(100), nullable=False)
    severity = Column(String(20), default="LOW")
    confidence = Column(Float, default=0.0)
    bbox_coords = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    vehicle = relationship("Vehicle", back_populates="damage_findings")
    image = relationship("VehicleImage", back_populates="damage_findings")

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    overall_score = Column(Integer, nullable=False)
    confidence_score = Column(Integer, nullable=False)
    
    documentation_score = Column(Float, nullable=True)
    service_history_score = Column(Float, nullable=True)
    mileage_score = Column(Float, nullable=True)
    visual_score = Column(Float, nullable=True)
    mechanical_score = Column(Float, nullable=True)
    market_score = Column(Float, nullable=True)
    ownership_score = Column(Float, nullable=True)
    
    positive_factors_json = Column(Text, nullable=False)
    risk_factors_json = Column(Text, nullable=False)
    weights_used_json = Column(Text, nullable=False)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="risk_score")

    @property
    def positive_factors(self):
        if self.positive_factors_json:
            try:
                return json.loads(self.positive_factors_json)
            except Exception:
                return []
        return []

    @property
    def risk_factors(self):
        if self.risk_factors_json:
            try:
                return json.loads(self.risk_factors_json)
            except Exception:
                return []
        return []

    @property
    def weights_used(self):
        if self.weights_used_json:
            try:
                return json.loads(self.weights_used_json)
            except Exception:
                return {}
        return {}

class Valuation(Base):
    __tablename__ = "valuations"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    estimated_fair_min = Column(Float, nullable=False)
    estimated_fair_max = Column(Float, nullable=False)
    asking_price = Column(Float, nullable=False)
    price_difference = Column(Float, nullable=False)
    recommendation = Column(String(50), nullable=False)
    valuation_notes = Column(Text, nullable=True)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="valuation")

class OwnershipCostModel(Base):
    __tablename__ = "ownership_cost_models"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    term_years = Column(Integer, default=5)
    purchase_price = Column(Float, nullable=False)
    fuel_cost = Column(Float, nullable=False)
    insurance_cost = Column(Float, nullable=False)
    maintenance_cost = Column(Float, nullable=False)
    tyres_cost = Column(Float, nullable=False)
    depreciation_cost = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    assumptions_json = Column(Text, nullable=True)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="ownership_models")

    @property
    def assumptions(self):
        if self.assumptions_json:
            try:
                return json.loads(self.assumptions_json)
            except Exception:
                return {}
        return {}

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    report_code = Column(String(50), unique=True, index=True, nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    summary_json = Column(Text, nullable=False)
    is_verified = Column(Boolean, default=True)

    vehicle = relationship("Vehicle", back_populates="reports")

    @property
    def summary(self):
        if self.summary_json:
            try:
                return json.loads(self.summary_json)
            except Exception:
                return {}
        return {}

class AIProcessingJob(Base):
    __tablename__ = "ai_processing_jobs"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    job_type = Column(String(50), nullable=False)
    status = Column(String(50), default="QUEUED")
    progress = Column(Integer, default=0)
    result_json = Column(Text, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    vehicle = relationship("Vehicle", back_populates="jobs")

    @property
    def result(self):
        if self.result_json:
            try:
                return json.loads(self.result_json)
            except Exception:
                return None
        return None

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(36), nullable=True)
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    @property
    def details(self):
        if self.details_json:
            try:
                return json.loads(self.details_json)
            except Exception:
                return None
        return None

class DealerInventory(Base):
    __tablename__ = "dealer_inventory"

    id = Column(String(36), primary_key=True, index=True)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=False)
    dealer_id = Column(String(36), nullable=True)
    days_in_stock = Column(Integer, default=0)
    inquiry_count = Column(Integer, default=0)
    purchase_cost = Column(Float, nullable=True)
    target_margin = Column(Float, default=8.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vehicle = relationship("Vehicle", back_populates="inventory_item")

class SystemConfig(Base):
    __tablename__ = "system_configs"

    key = Column(String(100), primary_key=True)
    value_json = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
