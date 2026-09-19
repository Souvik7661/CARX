from typing import List, Dict, Any

class AIRepairService:
    """
    Predicts upcoming maintenance and wear-and-tear repairs based on vehicle age,
    accumulated mileage, service history gaps, and visual damage findings.
    Clearly distinguishes between detected faults and statistical wear predictions.
    """

    @staticmethod
    def predict_repairs(
        year: int,
        mileage: int = 45000,
        damage_findings: List[Dict[str, Any]] = None,
        service_records: List[Dict[str, Any]] = None,
        obd_codes: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        age = max(1, 2026 - year)
        mileage = mileage or 45000
        damage_findings = damage_findings or []
        service_records = service_records or []
        obd_codes = obd_codes or []

        predictions = []
        total_min = 0.0
        total_max = 0.0

        # 1. Tyres evaluation
        has_tyre_damage = any("tyre" in str(d.get("panel", "")).lower() or "tyre" in str(d.get("damage_type", "")).lower() for d in damage_findings)
        if mileage >= 40000 or has_tyre_damage:
            predictions.append({
                "component": "Tyre Set Replacement (4x All-Season)",
                "estimated_min": 24000.0,
                "estimated_max": 32000.0,
                "priority": "High" if (mileage > 50000 or has_tyre_damage) else "Medium",
                "reason": "Odometer indicates vehicle has traversed ~48,000 km. Factory tyre compound typically reaches safe minimum tread depth between 45k–55k km.",
                "category": "Detected Issue" if has_tyre_damage else "Predicted Maintenance"
            })
            total_min += 24000.0
            total_max += 32000.0

        # 2. Brake system
        recent_brake_service = any("brake" in str(r.get("service_type", "")).lower() or "brake" in str(r.get("parts_replaced", "")).lower() for r in service_records)
        if not recent_brake_service or mileage >= 40000:
            predictions.append({
                "component": "Front & Rear Brake Friction Pads",
                "estimated_min": 6000.0,
                "estimated_max": 10000.0,
                "priority": "Medium",
                "reason": "Standard wear interval for front disc brake friction material is 30,000–40,000 km depending on urban driving cycles.",
                "category": "Predicted Maintenance"
            })
            total_min += 6000.0
            total_max += 10000.0

        # 3. 12V Starter Battery
        if age >= 3:
            predictions.append({
                "component": "12V Sealed Lead-Acid / AGM Battery",
                "estimated_min": 5000.0,
                "estimated_max": 8500.0,
                "priority": "Medium" if age >= 4 else "Low",
                "reason": f"Vehicle is {age} years old. Typical tropical battery life expectancy is 36 to 48 months.",
                "category": "Predicted Maintenance"
            })
            total_min += 5000.0
            total_max += 8500.0

        # 4. Major Scheduled Fluid & Filter Service
        predictions.append({
            "component": "Full Synthetic Fluid & Filter Service (Engine, Transmission, Brake Fluid)",
            "estimated_min": 8500.0,
            "estimated_max": 14000.0,
            "priority": "Medium",
            "reason": "Pre-purchase baseline service recommended upon taking possession to reset all fluid maintenance cycles.",
            "category": "Predicted Maintenance"
        })
        total_min += 8500.0
        total_max += 14000.0

        # 5. OBD / Diagnostic codes
        for code in obd_codes:
            c = code.get("code", "")
            d = code.get("description", "Diagnostic trouble code active")
            predictions.append({
                "component": f"Diagnostic Rectification: {c}",
                "estimated_min": 7500.0,
                "estimated_max": 18000.0,
                "priority": "High",
                "reason": f"Active Diagnostic Trouble Code detected in vehicle ECU: {d}. Requires professional sensor/actuator diagnosis.",
                "category": "Detected Issue"
            })
            total_min += 7500.0
            total_max += 18000.0

        return {
            "vehicle_id": "",
            "total_estimated_repair_min": total_min,
            "total_estimated_repair_max": total_max,
            "predictions": predictions
        }

ai_repair_service = AIRepairService()
