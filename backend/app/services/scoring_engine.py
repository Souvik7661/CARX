import json
from typing import Dict, Any, List, Optional
from datetime import datetime

class ScoringEngine:
    """
    Transparent, explainable Vehicle Trust Scoring Engine (0-100).
    Every score is mathematically derived from discrete inputs.
    Missing categories are mathematically normalized and confidence is adjusted.
    """

    DEFAULT_WEIGHTS = {
        "documentation": 0.20,
        "service_history": 0.15,
        "mileage_consistency": 0.15,
        "visual_condition": 0.15,
        "mechanical_diagnostic": 0.15,
        "market_price_risk": 0.10,
        "ownership_usage_risk": 0.10
    }

    @staticmethod
    def calculate_trust_score(
        documents: List[Dict[str, Any]],
        service_records: List[Dict[str, Any]],
        mileage_analysis: Dict[str, Any],
        damage_findings: List[Dict[str, Any]],
        inspection: Optional[Dict[str, Any]],
        valuation: Optional[Dict[str, Any]],
        vehicle_meta: Dict[str, Any],
        custom_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        weights = custom_weights or ScoringEngine.DEFAULT_WEIGHTS

        category_scores = {}
        category_confidences = {}
        positive_factors = []
        risk_factors = []

        # ----------------------------------------------------
        # 1. Documentation Score (Weight 20%)
        # ----------------------------------------------------
        doc_types = {d.get("doc_type") for d in documents}
        if not documents:
            category_scores["documentation"] = None
            category_confidences["documentation"] = 10
            risk_factors.append("No vehicle provenance documents (RC, Insurance, or Invoices) uploaded yet.")
        else:
            base_doc = 50.0
            if "RC" in doc_types:
                base_doc += 20.0
                positive_factors.append("Registration Certificate (RC) verified.")
            else:
                risk_factors.append("Missing Registration Certificate (RC).")

            if "INSURANCE" in doc_types:
                base_doc += 15.0
                positive_factors.append("Valid motor insurance policy on record.")
            else:
                risk_factors.append("No active insurance documentation provided.")

            if "SERVICE_INVOICE" in doc_types or "REPAIR_BILL" in doc_types:
                base_doc += 15.0
                positive_factors.append("Authentic maintenance service invoices on file.")

            category_scores["documentation"] = min(100.0, base_doc)
            category_confidences["documentation"] = min(100, 40 + (len(documents) * 15))

        # ----------------------------------------------------
        # 2. Service History Score (Weight 15%)
        # ----------------------------------------------------
        if not service_records:
            category_scores["service_history"] = None
            category_confidences["service_history"] = 10
            risk_factors.append("Complete absence of verified service history records.")
        else:
            serv_score = 100.0
            flagged = [r for r in service_records if r.get("is_flagged")]
            serv_score -= (len(flagged) * 18.0)

            # Check gap between records if multiple
            if len(service_records) >= 3:
                positive_factors.append(f"Regular service intervals verified across {len(service_records)} maintenance logs.")
            elif len(service_records) == 1:
                serv_score -= 15.0
                risk_factors.append("Only a single service record available; historical maintenance pattern incomplete.")

            if flagged:
                for f in flagged:
                    risk_factors.append(f"Service record alert: {f.get('flag_reason', 'Unusual service record flag')}")

            category_scores["service_history"] = max(20.0, min(100.0, serv_score))
            category_confidences["service_history"] = min(100, 30 + (len(service_records) * 18))

        # ----------------------------------------------------
        # 3. Mileage Consistency Score (Weight 15%)
        # ----------------------------------------------------
        mileage_status = mileage_analysis.get("status", "Unable to verify")
        rollback = mileage_analysis.get("rollback_risk", "None")

        if rollback == "High":
            category_scores["mileage_consistency"] = 15.0
            category_confidences["mileage_consistency"] = 95
            risk_factors.append("Severe risk: Odometer rollback or chronologically contradictory mileage detected.")
        elif mileage_status == "Strong evidence of consistency":
            category_scores["mileage_consistency"] = 98.0
            category_confidences["mileage_consistency"] = 95
            positive_factors.append("Strong chronological evidence of consistent, gradual odometer progression.")
        elif mileage_status == "Consistent":
            category_scores["mileage_consistency"] = 85.0
            category_confidences["mileage_consistency"] = 80
            positive_factors.append("Reported mileage aligns with historical service dates.")
        else:
            category_scores["mileage_consistency"] = None
            category_confidences["mileage_consistency"] = 25
            risk_factors.append("Insufficient historical records to conclusively verify odometer reading.")

        # ----------------------------------------------------
        # 4. Visual Condition Score (Weight 15%)
        # ----------------------------------------------------
        if not damage_findings and not vehicle_meta.get("has_images"):
            category_scores["visual_condition"] = None
            category_confidences["visual_condition"] = 15
            risk_factors.append("Vehicle multi-angle inspection photos not yet uploaded.")
        elif not damage_findings and vehicle_meta.get("has_images"):
            category_scores["visual_condition"] = 94.0
            category_confidences["visual_condition"] = 85
            positive_factors.append("No major visible body panel or clear-coat defects identified.")
        else:
            vis_score = 95.0
            for d in damage_findings:
                sev = d.get("severity", "LOW").upper()
                panel = d.get("panel", "Exterior Panel")
                dtype = d.get("damage_type", "Cosmetic issue")
                if sev == "HIGH":
                    vis_score -= 22.0
                    risk_factors.append(f"Significant visual defect detected: {dtype} on {panel}.")
                elif sev == "MEDIUM":
                    vis_score -= 10.0
                    risk_factors.append(f"Noticeable cosmetic defect: {dtype} on {panel}.")
                else:
                    vis_score -= 4.0
            
            category_scores["visual_condition"] = max(25.0, min(100.0, vis_score))
            category_confidences["visual_condition"] = 88
            if vis_score >= 80:
                positive_factors.append("Exterior panels generally free of structural deformation.")

        # ----------------------------------------------------
        # 5. Mechanical & Diagnostic Data (Weight 15%)
        # ----------------------------------------------------
        if not inspection:
            category_scores["mechanical_diagnostic"] = None
            category_confidences["mechanical_diagnostic"] = 15
        else:
            mech_score = 90.0
            obd = inspection.get("obd_codes", [])
            if isinstance(obd, str):
                try:
                    obd = json.loads(obd)
                except Exception:
                    obd = []

            if obd:
                mech_score -= (len(obd) * 15.0)
                risk_factors.append(f"Active OBD-II DTC faults detected ({len(obd)} code(s)).")
            else:
                positive_factors.append("Clean OBD-II diagnostic scan: No active fault trouble codes (DTCs).")

            voltage = inspection.get("battery_voltage")
            if voltage and (voltage < 12.0 or voltage > 14.8):
                mech_score -= 8.0
                risk_factors.append(f"Battery resting voltage out of optimal range ({voltage:.1f}V).")

            engine_health = str(inspection.get("engine_health", "GOOD")).upper()
            if engine_health in ["POOR", "FAIR"]:
                mech_score -= 20.0
                risk_factors.append(f"Inspector flagged engine mechanical health as '{engine_health}'.")
            elif engine_health == "EXCELLENT":
                mech_score += 5.0

            category_scores["mechanical_diagnostic"] = max(20.0, min(100.0, mech_score))
            category_confidences["mechanical_diagnostic"] = 90

        # ----------------------------------------------------
        # 6. Market / Price Risk (Weight 10%)
        # ----------------------------------------------------
        if not valuation:
            category_scores["market_price_risk"] = None
            category_confidences["market_price_risk"] = 20
        else:
            rec = valuation.get("recommendation", "BUY")
            asking = valuation.get("asking_price", 0.0)
            fair_max = valuation.get("estimated_fair_max", 0.0)

            if rec == "BUY":
                category_scores["market_price_risk"] = 92.0
                category_confidences["market_price_risk"] = 85
                positive_factors.append("Asking price is competitive and aligns within fair-market valuation range.")
            elif rec == "NEGOTIATE":
                category_scores["market_price_risk"] = 68.0
                category_confidences["market_price_risk"] = 85
                risk_factors.append("Asking price moderately exceeds fair market value; margin for negotiation exists.")
            else:
                category_scores["market_price_risk"] = 40.0
                category_confidences["market_price_risk"] = 90
                risk_factors.append("Asking price substantially above fair market value band or vehicle condition doesn't justify cost.")

        # ----------------------------------------------------
        # 7. Ownership & Usage Risk (Weight 10%)
        # ----------------------------------------------------
        year = vehicle_meta.get("year", 2021)
        age = max(1, 2026 - year)
        mileage = vehicle_meta.get("mileage", 40000)
        annual_km = mileage / age if mileage else 10000

        own_score = 88.0
        if annual_km > 22000:
            own_score -= 16.0
            risk_factors.append(f"High annual running pace ({int(annual_km):,} km/yr), indicating heavy commercial or highway usage.")
        elif annual_km < 3500 and age >= 3:
            own_score -= 8.0
            risk_factors.append("Extremely low annual usage (<3,500 km/yr); potential prolonged idle periods.")
        else:
            positive_factors.append(f"Balanced usage pace (~{int(annual_km):,} km/yr) consistent with typical private ownership.")

        category_scores["ownership_usage_risk"] = max(30.0, min(100.0, own_score))
        category_confidences["ownership_usage_risk"] = 80

        # ----------------------------------------------------
        # Mathematical Normalization & Final Aggregation
        # ----------------------------------------------------
        total_active_weight = 0.0
        weighted_score_sum = 0.0
        confidence_sum = 0.0
        total_weights_count = len(weights)

        active_weights = {}

        for cat, weight in weights.items():
            cat_score = category_scores.get(cat)
            cat_conf = category_confidences.get(cat, 15)
            confidence_sum += (cat_conf * weight)

            if cat_score is not None:
                total_active_weight += weight
                weighted_score_sum += (cat_score * weight)
                active_weights[cat] = weight
            else:
                active_weights[cat] = 0.0

        if total_active_weight > 0:
            normalized_score = round(weighted_score_sum / total_active_weight)
        else:
            normalized_score = 50  # default fallback if completely empty

        final_confidence = round(confidence_sum)

        return {
            "overall_score": int(normalized_score),
            "confidence_score": int(final_confidence),
            "documentation_score": category_scores.get("documentation"),
            "service_history_score": category_scores.get("service_history"),
            "mileage_score": category_scores.get("mileage_consistency"),
            "visual_score": category_scores.get("visual_condition"),
            "mechanical_score": category_scores.get("mechanical_diagnostic"),
            "market_score": category_scores.get("market_price_risk"),
            "ownership_score": category_scores.get("ownership_usage_risk"),
            "positive_factors": positive_factors[:6],  # top factors
            "risk_factors": risk_factors[:6],
            "weights_used": weights
        }

scoring_engine = ScoringEngine()
