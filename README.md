# Drive Sense — AI-Powered Vehicle Intelligence Platform

> **"Know the car. Know the risk. Know the price."**
> 
> *Do not build another car marketplace. Build the intelligence and trust layer around a vehicle purchase.*

---

## 1. Project Overview & Product Vision

**Drive Sense** is an enterprise-grade vehicle intelligence and decision-support platform designed to assist pre-owned car buyers, inspectors, and dealerships in evaluating vehicles before committing capital.

Instead of listing cars for sale, Drive Sense answers the buyer's most critical questions:
1. **Is this vehicle trustworthy?** (Calculated via a transparent **0–100 Vehicle Trust Score**)
2. **Does the car have hidden damage or undisclosed repairs?** (Multi-angle Computer Vision panel detection)
3. **Has the odometer been rolled back or tampered with?** (Chronological mileage regression analysis)
4. **Is the service history consistent?** (Invoice OCR with gap and frequency anomaly detection)
5. **What is the fair market value?** (Actuarial depreciation models adjusted for mileage and defects)
6. **What looming repairs will require capital soon?** (Predictive wear-and-tear models)
7. **What is the 5-year Total Cost of Ownership (TCO)?** (Fuel, insurance, tyres, maintenance, depreciation)
8. **Final Decision:** **🟢 BUY**, **🟡 NEGOTIATE**, or **🔴 AVOID** with mathematical justification.

---

## 2. System Architecture

```
                                  +---------------------------------------+
                                  |     CARX Next.js 16 Web Frontend      |
                                  |  (TypeScript, Tailwind CSS, Lucide)   |
                                  +-------------------+-------------------+
                                                      |
                                             REST API / JWT Auth
                                                      |
                                  +-------------------v-------------------+
                                  |       FastAPI Application Engine      |
                                  |          (Python 3.14 + ASGI)         |
                                  +---------+-------------------+---------+
                                            |                   |
                     +----------------------+                   +---------------------+
                     |                                                                |
         +-----------v------------+                                       +-----------v------------+
         |     Relational DB      |                                       |   Object Storage / FS  |
         |  (SQLite / PostgreSQL) |                                       |  (Invoices, Photos)    |
         +------------------------+                                       +------------------------+
                     |
         +-----------v----------------------------------------------------------------+
         |                       CARX Autonomous Intelligence Layer                   |
         |                                                                            |
         |  1. Transparent Trust Scoring Engine (0–100, 7 Weighted Categories)       |
         |  2. Mileage Consistency & Odometer Rollback Engine                         |
         |  3. Document Intelligence Pipeline (Asynchronous OCR Extraction)           |
         |  4. Multi-Angle Computer Vision Damage & Panel Alignment Detector          |
         |  5. Statistical Valuation & Depreciation Regression Curve                  |
         |  6. Total Cost of Ownership (3-Year & 5-Year TCO Financial Modeler)        |
         |  7. Predictive Maintenance Wear-and-Tear Forecaster                       |
         |  8. Human Certified Inspector & OBD-II Scanner Diagnostic Layer            |
         +----------------------------------------------------------------------------+
```

---

## 3. Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS (Tailwind v4), dark high-precision automotive engineering theme
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch with type-safe REST wrapper (`src/lib/api.ts`)

### Backend
- **Framework**: FastAPI (Asynchronous Python 3.14)
- **Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2.0 (Compatible with SQLite and PostgreSQL)
- **Data Validation**: Pydantic v2 & Pydantic-Settings
- **Security**: JWT (`python-jose`) + cryptographic password hashing (`bcrypt`)
- **Storage**: Sanitized local storage abstraction for documents and photos

---

## 4. Database Architecture (18 Relational Models)

The system uses a normalized relational architecture implemented in `backend/app/models/entities.py`:

| Model | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `User` | Role-based authorization | `id`, `email`, `role` (CONSUMER, INSPECTOR, DEALER, ADMIN) |
| `Vehicle` | Central vehicle entity | `vin`, `reg_no`, `make`, `model`, `year`, `mileage`, `asking_price` |
| `VehicleImage` | Multi-angle inspection photos | `angle`, `image_url`, `detected_damages_json` |
| `Document` | Uploaded provenance files | `doc_type` (RC, INSURANCE, INVOICE), `file_path`, `confidence` |
| `DocumentExtraction` | Extracted telemetry fields | `extracted_data_json`, `is_verified`, `verified_by` |
| `ServiceRecord` | Chronological maintenance log | `date`, `odometer`, `service_type`, `total_cost`, `is_flagged` |
| `Inspection` | Certified physical & OBD scan | `obd_codes_json`, `battery_voltage`, `coolant_temp`, `engine_health` |
| `InspectionFinding` | Physical checklist items | `category`, `item_name`, `condition`, `estimated_repair_cost` |
| `DamageFinding` | Visual panel defects | `panel`, `damage_type`, `severity` (LOW, MED, HIGH), `confidence` |
| `RiskScore` | Transparent 0–100 score | `overall_score`, `confidence_score`, category scores, `positive_factors`, `risk_factors` |
| `Valuation` | Fair market evaluation | `estimated_fair_min`, `estimated_fair_max`, `price_difference`, `recommendation` |
| `OwnershipCostModel` | 3-yr / 5-yr TCO breakdown | `fuel_cost`, `insurance_cost`, `maintenance_cost`, `tyres_cost`, `depreciation` |
| `Report` | Cryptographic public reports | `report_code`, `summary_json`, `is_verified` |
| `AIProcessingJob` | Asynchronous processing queue | `job_type`, `status` (QUEUED, PROCESSING, COMPLETED), `progress` |
| `AuditLog` | Security & data audit log | `user_id`, `action`, `entity_type`, `details_json` |
| `DealerInventory` | Dealership portfolio metrics | `days_in_stock`, `inquiry_count`, `purchase_cost`, `target_margin` |
| `SystemConfig` | Live configurable parameters | `key`, `value_json` (e.g. scoring category weights) |

---

## 5. Scoring & Intelligence Methodology

### Transparent Vehicle Trust Score (0–100)
CARX rejects black-box arbitrary AI scores. The score is mathematically calculated across 7 configurable categories:
1. **Documentation** (20% default weight)
2. **Service History** (15% default weight)
3. **Mileage Consistency** (15% default weight)
4. **Visual Condition** (15% default weight)
5. **Mechanical / Diagnostic Data** (15% default weight)
6. **Market / Price Risk** (10% default weight)
7. **Ownership / Usage Profile** (10% default weight)

**Missing Data Normalization**: If evidence for a category is missing (e.g. no OBD scan or photos uploaded yet), CARX dynamically normalizes the score across available categories so the score remains on a fair 0–100 scale, while proportionally adjusting the **Data Confidence %**.

### Computer Vision Damage Analysis
Evaluates 9 discrete photographic angles: Front, Rear, Left, Right, Interior, Engine Bay, Tyres, Dashboard, and Close-ups.
- Detects scratches, stone chips, dents, non-OEM paint texture, and tyre wear depth.
- **Strict Non-Assertive Phrasing**: Reports *"Possible previous paint repair detected"* rather than making speculative accident assertions.

### Mileage Consistency & Rollback Engine
Parses chronological records to detect:
- Odometer rollbacks (subsequent reading lower than historical log)
- High-mileage surges (>300 km/day pace)
- Verified classification: *"Consistent"*, *"Potential inconsistency"*, *"Unable to verify"*, or *"Strong evidence of consistency"*.

---

## 6. The 3 Controlled Demo Archetypes

CARX includes 3 realistic pre-seeded vehicles in the demo sandbox:

| Vehicle | Archetype | Trust Score | Price Disparity | Verdict | Key Finding |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **2021 Hyundai Creta 1.5 SX** | Prime Verified | **86 / 100** | Aligned (Asking ₹9.25L vs Fair ₹9.1L–₹9.6L) | **🟢 BUY** | Full dealer service timeline, 0 OBD faults, single owner. |
| **2019 Jeep Compass Limited** | Overpriced / Gaps | **69 / 100** | +₹1,45,000 above fair market band | **🟡 NEGOTIATE** | Right door paint blend, 16-month service gap, tyre wear. |
| **2018 BMW 320d Luxury** | Rollback & Structural | **44 / 100** | +₹6,25,000 above risk-adjusted value | **🔴 AVOID** | Declared 54,200 km vs 82,400 km in 2023, apron non-OEM weld, EGR fault code. |

---

## 7. API Documentation

### Core Endpoints (`/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | System health, database connection probe, active jobs |
| `GET` | `/api/vehicles` | List vehicles (filters: `query`, `is_demo`) |
| `POST` | `/api/vehicles` | Initialize vehicle workspace with progressive enrichment |
| `GET` | `/api/vehicles/{id}` | Complete vehicle intelligence dossier |
| `POST` | `/api/vehicles/{id}/analyze` | Trigger end-to-end multi-modal scoring and valuation |
| `POST` | `/api/vehicles/{id}/documents` | Asynchronously upload and OCR extract service/RC documents |
| `PUT` | `/api/documents/{doc_id}/extraction` | Manual review and correction of OCR fields |
| `POST` | `/api/vehicles/{id}/images` | Upload angle perspective and run computer vision analysis |
| `GET` | `/api/vehicles/{id}/service-history` | Chronological service timeline with gap and cost anomaly flags |
| `GET` | `/api/vehicles/{id}/mileage` | Mileage progression, annual pace, and rollback probability |
| `POST` | `/api/vehicles/{id}/valuation` | Recalculate fair market value against counter-offers |
| `POST` | `/api/vehicles/{id}/ownership-cost` | Simulate 3-yr / 5-yr TCO with custom fuel and mileage parameters |
| `GET` | `/api/vehicles/{id}/repairs` | Predictive wear-and-tear component schedule |
| `POST` | `/api/vehicles/{id}/inspections` | Certified mechanic physical findings & OBD-II scanner logs |
| `POST` | `/api/vehicles/{id}/report` | Generate verifiable public report with unique report code |
| `GET` | `/api/reports/{code}` | Retrieve verified report by cryptographic code |
| `POST` | `/api/compare` | Side-by-side comparison of up to 3 candidate vehicles |
| `GET` | `/api/dealer/stats` | Real calculated dealership metrics (inventory, aging stock, margin risk) |
| `GET` | `/api/admin/weights` | Retrieve current scoring category weights |
| `PUT` | `/api/admin/weights` | Dynamically update category weights in real-time |

---

## 8. Local Setup & Quick Start

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node.js v25.8)
- npm or pnpm

### 1. Clone & Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Seed the database with the 3 realistic archetypes
python -m app.scripts.seed

# Start the FastAPI API server (defaults to port 8000)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Build to verify production readiness
npm run build

# Start the Next.js dev server (defaults to port 3000)
npm run dev
```

### 3. Access Platform
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Demo Archetypes**: [http://localhost:3000/demo](http://localhost:3000/demo)
- **Side-by-Side Comparison**: [http://localhost:3000/compare](http://localhost:3000/compare)
- **Dealer Hub**: [http://localhost:3000/dealer](http://localhost:3000/dealer)
- **Inspector Portal**: [http://localhost:3000/inspector](http://localhost:3000/inspector)
- **Admin Configuration**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **FastAPI Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 9. Running Tests

The backend includes a comprehensive unit and integration test suite covering scoring engine edge cases, rollback anomalies, valuation curves, and API endpoints:

```bash
cd backend
PYTHONPATH=. venv/bin/pytest -v tests/
```

Test coverage includes:
- `test_scoring_engine_empty`: Zero data normalization and confidence degradation.
- `test_scoring_engine_high_trust`: Multi-evidence synthesis with positive factors.
- `test_mileage_rollback_detection`: Accurate detection of odometer reversal.
- `test_mileage_consistent`: Chronological timeline verification.
- `test_valuation_fair_buy`: Valuation alignment with asking prices.
- `test_valuation_overpriced_avoid`: Disparity threshold detection.
- `test_ownership_tco_calculation`: 5-year TCO financial formula.
- `test_health_check_api`: `GET /health` operational probe.
- `test_list_demo_vehicles_api`: Demo archetype registry.
- `test_get_single_vehicle_workspace`: Relational data retrieval.
- `test_compare_endpoint`: 3-vehicle decision matrix.
- `test_dealer_stats_endpoint`: Inventory and aging calculations.
- `test_admin_weights_endpoint`: Dynamic weight configuration.

---

## 10. Future Roadmap

1. **Hardware OBD-II Bluetooth Integration**: Direct real-time CAN bus telemetry polling via ELM327 / STN1110 dongles.
2. **National Registry API Connectors**: Direct integration with government transport registries (e.g. Parivahan VAHAN API) and insurance claims bureaus.
3. **Advanced LLM Vision Multi-Shot**: Integration of Google Gemini 2.0 Flash / Pro Vision for micro-fracture paint swirl and underbody rust segmentation.
4. **Mobile Native App**: React Native / Expo companion app for on-site physical vehicle walk-arounds.
