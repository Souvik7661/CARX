import uuid
import json
from datetime import datetime, timedelta
from app.database import Base, engine, SessionLocal
from app.models.entities import (
    User, Vehicle, VehicleImage, Document, DocumentExtraction,
    ServiceRecord, Inspection, InspectionFinding, DamageFinding,
    RiskScore, Valuation, OwnershipCostModel, Report, DealerInventory, SystemConfig
)
from app.routers.auth import get_password_hash
from app.services.scoring_engine import ScoringEngine

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing demo data
    try:
        # 1. System Config
        if not db.query(SystemConfig).filter(SystemConfig.key == "scoring_weights").first():
            db.add(SystemConfig(
                key="scoring_weights",
                value_json=json.dumps(ScoringEngine.DEFAULT_WEIGHTS)
            ))

        # 2. Seed Users for each role
        admin_user = db.query(User).filter(User.email == "admin@carx.ai").first()
        if not admin_user:
            admin_user = User(
                id="user-admin-01",
                email="admin@carx.ai",
                hashed_password=get_password_hash("admin123"),
                full_name="Chief Architect (Admin)",
                role="ADMIN"
            )
            db.add(admin_user)

        dealer_user = db.query(User).filter(User.email == "dealer@carx.ai").first()
        if not dealer_user:
            dealer_user = User(
                id="user-dealer-01",
                email="dealer@carx.ai",
                hashed_password=get_password_hash("dealer123"),
                full_name="Apex Motors Dealership",
                role="DEALER"
            )
            db.add(dealer_user)

        inspector_user = db.query(User).filter(User.email == "inspector@carx.ai").first()
        if not inspector_user:
            inspector_user = User(
                id="user-inspector-01",
                email="inspector@carx.ai",
                hashed_password=get_password_hash("inspector123"),
                full_name="Rajesh Sharma (Senior Master Technician)",
                role="INSPECTOR"
            )
            db.add(inspector_user)

        consumer_user = db.query(User).filter(User.email == "consumer@carx.ai").first()
        if not consumer_user:
            consumer_user = User(
                id="user-consumer-01",
                email="consumer@carx.ai",
                hashed_password=get_password_hash("consumer123"),
                full_name="Vikram Mehta",
                role="CONSUMER"
            )
            db.add(consumer_user)

        db.commit()

        # ----------------------------------------------------
        # VEHICLE A: High Trust, Fair Price -> 🟢 BUY
        # 2021 Hyundai Creta 1.5 SX
        # ----------------------------------------------------
        v_a = db.query(Vehicle).filter(Vehicle.id == "demo-vehicle-a").first()
        if not v_a:
            v_a = Vehicle(
                id="demo-vehicle-a",
                user_id=consumer_user.id,
                vin="MALC281CM8M129482",
                reg_no="MH 12 QX 4921",
                make="Hyundai",
                model="Creta",
                variant="1.5 SX Executive",
                year=2021,
                fuel_type="Petrol",
                transmission="Manual",
                mileage=48230,
                asking_price=925000.0,
                location="Pune, Maharashtra",
                image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
                status="ANALYZED",
                is_demo=True
            )
            db.add(v_a)

            # Images
            img_front = VehicleImage(
                id="img-a-1",
                vehicle_id=v_a.id,
                angle="front",
                image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
                detected_damages_json=json.dumps([
                    {"panel": "Front Bumper Lower", "damage_type": "Minor stone chips", "severity": "LOW", "confidence": 0.92, "bbox_coords": "40,70,20,10"}
                ])
            )
            db.add(img_front)

            # Damage findings
            db.add(DamageFinding(
                id=str(uuid.uuid4()),
                vehicle_id=v_a.id,
                image_id=img_front.id,
                panel="Front Bumper Lower",
                damage_type="Minor stone chips",
                severity="LOW",
                confidence=0.92,
                notes="Superficial stone chip abrasion on lower plastic lip. Reinforcement intact."
            ))

            # Documents
            doc_rc = Document(
                id="doc-a-rc",
                vehicle_id=v_a.id,
                doc_type="RC",
                file_name="rc_smartcard_mh12qx4921.pdf",
                file_path="/uploads/demo/rc.pdf",
                file_size=1048576,
                status="EXTRACTED",
                confidence=99.0
            )
            db.add(doc_rc)
            db.add(DocumentExtraction(
                id=str(uuid.uuid4()),
                document_id=doc_rc.id,
                extracted_data_json=json.dumps({
                    "reg_no": "MH 12 QX 4921",
                    "vin": "MALC281CM8M129482",
                    "owner": "1st Owner",
                    "fuel": "Petrol",
                    "reg_date": "2021-03-12"
                }),
                is_verified=True
            ))

            doc_inv = Document(
                id="doc-a-inv",
                vehicle_id=v_a.id,
                doc_type="SERVICE_INVOICE",
                file_name="hyundai_service_invoice_48k.pdf",
                file_path="/uploads/demo/inv.pdf",
                file_size=2097152,
                status="EXTRACTED",
                confidence=96.0
            )
            db.add(doc_inv)
            db.add(DocumentExtraction(
                id=str(uuid.uuid4()),
                document_id=doc_inv.id,
                extracted_data_json=json.dumps({
                    "odometer": 48230,
                    "date": "2024-04-18",
                    "workshop": "Speed Hyundai Authorized",
                    "total_cost": 14691.0
                }),
                is_verified=True
            ))

            # Service Records (Full consistent history)
            services_a = [
                ("2021-09-10", 10200, "1st Free Service & Inspection", "Speed Hyundai", 0.0),
                ("2022-04-15", 20400, "Periodic Oil Service + Filter", "Speed Hyundai", 4800.0),
                ("2023-03-22", 31400, "Major 30,000 km Service & AC Disinfection", "Speed Hyundai", 11200.0),
                ("2023-11-19", 39800, "Front Brake Pads Replacement & Alignment", "Speed Hyundai", 6500.0),
                ("2024-04-18", 48230, "Scheduled 50,000 km Service", "Speed Hyundai", 14691.0)
            ]
            for d, odo, st, ws, cost in services_a:
                db.add(ServiceRecord(
                    id=str(uuid.uuid4()),
                    vehicle_id=v_a.id,
                    date=d,
                    odometer=odo,
                    service_type=st,
                    workshop=ws,
                    total_cost=cost,
                    is_flagged=False,
                    source="EXTRACTED"
                ))

            # Inspection
            db.add(Inspection(
                id="insp-a",
                vehicle_id=v_a.id,
                inspector_id=inspector_user.id,
                obd_codes_json=json.dumps([]),
                battery_voltage=12.7,
                coolant_temp=89.0,
                engine_health="EXCELLENT",
                notes="Engine starts smoothly with immediate idle stabilization. Gear shifts crisp. AC cooling delta 8.2°C.",
                mechanic_name="Rajesh Sharma (Master Tech)",
                is_completed=True,
                completed_at=datetime.utcnow() - timedelta(days=2)
            ))

            # Valuation
            db.add(Valuation(
                id="val-a",
                vehicle_id=v_a.id,
                estimated_fair_min=910000.0,
                estimated_fair_max=960000.0,
                asking_price=925000.0,
                price_difference=-10000.0,
                recommendation="BUY",
                valuation_notes="Asking price is well within fair market range (₹9.10L – ₹9.60L). Complete service records and verified single ownership strongly validate asking value."
            ))

            # Risk Score
            db.add(RiskScore(
                id="risk-a",
                vehicle_id=v_a.id,
                overall_score=86,
                confidence_score=92,
                documentation_score=95.0,
                service_history_score=98.0,
                mileage_score=96.0,
                visual_score=92.0,
                mechanical_score=95.0,
                market_score=92.0,
                ownership_score=90.0,
                positive_factors_json=json.dumps([
                    "Complete chronological service timeline with zero gaps",
                    "Single registered private owner confirmed via RC",
                    "Clean OBD-II diagnostic scan (0 trouble codes detected)",
                    "Asking price sits fairly within estimated market band",
                    "No frame, apron, or structural damage detected"
                ]),
                risk_factors_json=json.dumps([
                    "Front tyres show ~3.2mm tread depth; replacement in ~8,000 km",
                    "Minor superficial stone chips on lower front apron"
                ]),
                weights_used_json=json.dumps(ScoringEngine.DEFAULT_WEIGHTS)
            ))

            # Ownership Model
            db.add(OwnershipCostModel(
                id="tco-a",
                vehicle_id=v_a.id,
                term_years=5,
                purchase_price=925000.0,
                fuel_cost=422000.0,
                insurance_cost=118000.0,
                maintenance_cost=110000.0,
                tyres_cost=63000.0,
                depreciation_cost=379000.0,
                total_cost=1638000.0,
                assumptions_json=json.dumps({"annual_km": 12000, "kmpl": 14.5, "fuel_price": 102.0})
            ))

            # Report
            db.add(Report(
                id="rep-a",
                vehicle_id=v_a.id,
                report_code="CARX-2026-CRTA86",
                summary_json=json.dumps({
                    "verdict": "BUY",
                    "score": 86,
                    "highlights": "Clean provenance, single owner, no rollback, competitive price."
                }),
                is_verified=True
            ))

            # Dealer inventory
            db.add(DealerInventory(
                id="inv-a",
                vehicle_id=v_a.id,
                days_in_stock=18,
                inquiry_count=14,
                purchase_cost=860000.0,
                target_margin=7.5
            ))

        # ----------------------------------------------------
        # VEHICLE B: Medium Trust, Overpriced -> 🟡 NEGOTIATE
        # 2019 Jeep Compass Limited 2.0
        # ----------------------------------------------------
        v_b = db.query(Vehicle).filter(Vehicle.id == "demo-vehicle-b").first()
        if not v_b:
            v_b = Vehicle(
                id="demo-vehicle-b",
                user_id=consumer_user.id,
                vin="1C4NJDBB6KD294012",
                reg_no="DL 3C CE 8821",
                make="Jeep",
                model="Compass",
                variant="Limited Plus 2.0 4x2",
                year=2019,
                fuel_type="Diesel",
                transmission="Manual",
                mileage=64200,
                asking_price=1550000.0,
                location="Delhi, NCR",
                image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
                status="ANALYZED",
                is_demo=True
            )
            db.add(v_b)

            img_b_side = VehicleImage(
                id="img-b-1",
                vehicle_id=v_b.id,
                angle="right",
                image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80",
                detected_damages_json=json.dumps([
                    {"panel": "Front Right Door", "damage_type": "Potential paint blend / respray", "severity": "MEDIUM", "confidence": 0.87, "bbox_coords": "30,40,35,35"}
                ])
            )
            db.add(img_b_side)

            db.add(DamageFinding(
                id=str(uuid.uuid4()),
                vehicle_id=v_b.id,
                image_id=img_b_side.id,
                panel="Front Right Door",
                damage_type="Possible previous paint repair detected",
                severity="MEDIUM",
                confidence=0.87,
                notes="Paint micrometer variation and orange peel texture indicate previous refinishing."
            ))

            # Service records with a 16-month gap
            services_b = [
                ("2020-01-14", 15000, "15,000 km Scheduled Service", "Landmark Jeep Delhi", 12500.0),
                ("2020-11-20", 28400, "30,000 km Service", "Landmark Jeep Delhi", 18200.0),
                ("2022-03-18", 44200, "Oil + Clutch Fluid + Brake Pads", "Independent Workshop", 24000.0),  # 16-month gap
                ("2023-08-11", 57800, "Suspension Bushings & Service", "Landmark Jeep Delhi", 38000.0)
            ]
            for d, odo, st, ws, cost in services_b:
                is_flg = (ws == "Independent Workshop")
                db.add(ServiceRecord(
                    id=str(uuid.uuid4()),
                    vehicle_id=v_b.id,
                    date=d,
                    odometer=odo,
                    service_type=st,
                    workshop=ws,
                    total_cost=cost,
                    is_flagged=is_flg,
                    flag_reason="Service interval gap > 15 months and serviced at unverified facility" if is_flg else None,
                    source="EXTRACTED"
                ))

            # Valuation (Overpriced by ~1.4L)
            db.add(Valuation(
                id="val-b",
                vehicle_id=v_b.id,
                estimated_fair_min=1380000.0,
                estimated_fair_max=1430000.0,
                asking_price=1550000.0,
                price_difference=145000.0,
                recommendation="NEGOTIATE",
                valuation_notes="Vehicle is priced approximately ₹1,45,000 above fair market threshold. The paint repair on right door and service history gap justify a counter-offer around ₹13.9L."
            ))

            # Risk Score
            db.add(RiskScore(
                id="risk-b",
                vehicle_id=v_b.id,
                overall_score=69,
                confidence_score=82,
                documentation_score=75.0,
                service_history_score=68.0,
                mileage_score=82.0,
                visual_score=72.0,
                mechanical_score=80.0,
                market_score=65.0,
                ownership_score=75.0,
                positive_factors_json=json.dumps([
                    "Engine pulls strongly with robust low-end diesel torque",
                    "Suspension overhaul completed at 57,800 km",
                    "Air conditioning and infotainment diagnostics clear"
                ]),
                risk_factors_json=json.dumps([
                    "Asking price is ₹1,45,000 higher than calculated fair market range",
                    "Front right door shows paint thickness inconsistency (possible respray)",
                    "16-month gap between service visits (Nov 2020 to Mar 2022)",
                    "Tyres nearing wear indicator bars; ~₹32,000 expense required"
                ]),
                weights_used_json=json.dumps(ScoringEngine.DEFAULT_WEIGHTS)
            ))

            db.add(OwnershipCostModel(
                id="tco-b",
                vehicle_id=v_b.id,
                term_years=5,
                purchase_price=1550000.0,
                fuel_cost=490000.0,
                insurance_cost=155000.0,
                maintenance_cost=165000.0,
                tyres_cost=75000.0,
                depreciation_cost=635000.0,
                total_cost=2435000.0,
                assumptions_json=json.dumps({"annual_km": 14000, "kmpl": 12.8, "fuel_price": 92.0})
            ))

            db.add(DealerInventory(
                id="inv-b",
                vehicle_id=v_b.id,
                days_in_stock=74,
                inquiry_count=6,
                purchase_cost=1340000.0,
                target_margin=15.6
            ))

        # ----------------------------------------------------
        # VEHICLE C: Low Trust, Rollback & Structural Issue -> 🔴 AVOID
        # 2018 BMW 320d Luxury Line
        # ----------------------------------------------------
        v_c = db.query(Vehicle).filter(Vehicle.id == "demo-vehicle-c").first()
        if not v_c:
            v_c = Vehicle(
                id="demo-vehicle-c",
                user_id=consumer_user.id,
                vin="WBA3D3100JK771924",
                reg_no="KA 03 MN 3109",
                make="BMW",
                model="3 Series",
                variant="320d Luxury Line",
                year=2018,
                fuel_type="Diesel",
                transmission="Automatic",
                mileage=54200,  # Falsified lower reading!
                asking_price=2150000.0,
                location="Bengaluru, Karnataka",
                image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80",
                status="ANALYZED",
                is_demo=True
            )
            db.add(v_c)

            # Rollback service records!
            services_c = [
                ("2019-06-12", 22000, "Condition Based Service", "Navnit Motors BMW", 32000.0),
                ("2021-02-19", 48000, "Major Brake & Transmission Flush", "Navnit Motors BMW", 64000.0),
                ("2023-05-14", 82400, "Engine Mounts & Fuel Injector Check", "Navnit Motors BMW", 88000.0)  # was 82k in 2023!
            ]
            for d, odo, st, ws, cost in services_c:
                db.add(ServiceRecord(
                    id=str(uuid.uuid4()),
                    vehicle_id=v_c.id,
                    date=d,
                    odometer=odo,
                    service_type=st,
                    workshop=ws,
                    total_cost=cost,
                    is_flagged=(odo > 54200),
                    flag_reason=f"Historic reading ({odo:,} km) exceeds current declared odometer (54,200 km)",
                    source="EXTRACTED"
                ))

            # Damage findings (structural / apron rework)
            db.add(DamageFinding(
                id=str(uuid.uuid4()),
                vehicle_id=v_c.id,
                panel="Front Left Apron & Radiator Core Support",
                damage_type="Non-OEM weld & sealant bead observed",
                severity="HIGH",
                confidence=0.94,
                notes="Structural repair indicator: Inner apron sealant differs from factory robotic application. Radiator carrier replaced."
            ))

            # OBD faults
            db.add(Inspection(
                id="insp-c",
                vehicle_id=v_c.id,
                inspector_id=inspector_user.id,
                obd_codes_json=json.dumps([
                    {"code": "P0401", "description": "EGR Flow Insufficient Detected"},
                    {"code": "P0299", "description": "Turbocharger Underboost Condition"}
                ]),
                battery_voltage=11.8,
                coolant_temp=94.0,
                engine_health="POOR",
                notes="Looming turbocharger wastegate actuator failure. Odometer manipulation evident. Front structural re-welding flagged.",
                mechanic_name="Rajesh Sharma (Master Tech)",
                is_completed=True,
                completed_at=datetime.utcnow() - timedelta(days=1)
            ))

            # Valuation (High Risk, avoid)
            db.add(Valuation(
                id="val-c",
                vehicle_id=v_c.id,
                estimated_fair_min=1450000.0,
                estimated_fair_max=1600000.0,
                asking_price=2150000.0,
                price_difference=625000.0,
                recommendation="AVOID",
                valuation_notes="AVOID RECOMMENDED. Severe odometer tampering detected (declared 54,200 km vs verified 82,400 km in 2023). Apron rework and turbo DTCs pose catastrophic repair liability."
            ))

            # Risk Score (Low score 44)
            db.add(RiskScore(
                id="risk-c",
                vehicle_id=v_c.id,
                overall_score=44,
                confidence_score=94,
                documentation_score=45.0,
                service_history_score=35.0,
                mileage_score=15.0,
                visual_score=40.0,
                mechanical_score=35.0,
                market_score=30.0,
                ownership_score=50.0,
                positive_factors_json=json.dumps([
                    "Prestige brand and luxury interior aesthetics"
                ]),
                risk_factors_json=json.dumps([
                    "CRITICAL: Odometer rollback detected (recorded 82,400 km in 2023, declared 54,200 km)",
                    "Front structural apron shows non-OEM welding and sealant rework",
                    "Active diagnostic trouble codes: P0401 (EGR) and P0299 (Turbocharger underboost)",
                    "Battery resting voltage low (11.8V); alternator or battery near failure",
                    "Asking price exceeds actual risk-adjusted fair market value by > ₹6,00,000"
                ]),
                weights_used_json=json.dumps(ScoringEngine.DEFAULT_WEIGHTS)
            ))

            db.add(OwnershipCostModel(
                id="tco-c",
                vehicle_id=v_c.id,
                term_years=5,
                purchase_price=2150000.0,
                fuel_cost=580000.0,
                insurance_cost=210000.0,
                maintenance_cost=420000.0,  # High repair burden
                tyres_cost=110000.0,
                depreciation_cost=980000.0,
                total_cost=3470000.0,
                assumptions_json=json.dumps({"annual_km": 15000, "kmpl": 11.2, "fuel_price": 92.0})
            ))

            db.add(DealerInventory(
                id="inv-c",
                vehicle_id=v_c.id,
                days_in_stock=89,
                inquiry_count=3,
                purchase_cost=1850000.0,
                target_margin=16.2
            ))

        db.commit()
        print("Database seed completed successfully with all 3 archetypes and sample users!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
