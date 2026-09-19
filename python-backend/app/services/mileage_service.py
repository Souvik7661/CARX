from typing import List, Dict, Any
from datetime import datetime

class MileageService:
    @staticmethod
    def analyze_mileage(records: List[Dict[str, Any]], declared_odometer: int = None) -> Dict[str, Any]:
        """
        Analyzes chronological mileage records for consistency, rollbacks, and unusual usage patterns.
        """
        data_points = []
        for r in records:
            if "date" in r and "odometer" in r and r["odometer"] is not None:
                try:
                    # Clean date
                    dt = datetime.strptime(str(r["date"])[:10], "%Y-%m-%d")
                    data_points.append({
                        "date": str(r["date"])[:10],
                        "timestamp": dt.timestamp(),
                        "odometer": int(r["odometer"]),
                        "source": r.get("source", "Service Record")
                    })
                except Exception:
                    continue

        if declared_odometer is not None and declared_odometer > 0:
            today_str = datetime.utcnow().strftime("%Y-%m-%d")
            data_points.append({
                "date": today_str,
                "timestamp": datetime.utcnow().timestamp(),
                "odometer": declared_odometer,
                "source": "Current Declared"
            })

        # Sort chronologically
        data_points.sort(key=lambda x: x["timestamp"])

        if len(data_points) < 2:
            return {
                "status": "Unable to verify",
                "confidence": 20,
                "summary": "Insufficient chronological evidence to verify mileage consistency. Additional service or inspection records required.",
                "data_points": data_points,
                "rollback_risk": "Low",
                "annual_average_km": None
            }

        anomalies = []
        rollback_detected = False
        total_km_diff = 0
        total_days = 0

        for i in range(len(data_points) - 1):
            curr = data_points[i]
            nxt = data_points[i + 1]
            km_diff = nxt["odometer"] - curr["odometer"]
            days_diff = max(1, (nxt["timestamp"] - curr["timestamp"]) / (24 * 3600))
            
            total_km_diff += max(0, km_diff)
            total_days += days_diff

            # Rollback check
            if km_diff < 0:
                rollback_detected = True
                anomalies.append(
                    f"Odometer rollback detected between {curr['date']} ({curr['odometer']:,} km) and {nxt['date']} ({nxt['odometer']:,} km): decrease of {abs(km_diff):,} km."
                )
            elif days_diff > 0:
                # Pace check: e.g. more than 200 km per day average over a year or abnormal spike
                daily_pace = km_diff / days_diff
                if daily_pace > 300:
                    anomalies.append(
                        f"Unusual high-mileage surge between {curr['date']} and {nxt['date']} (+{km_diff:,} km in {int(days_diff)} days)."
                    )

        annual_avg = None
        if total_days > 60:
            annual_avg = round((total_km_diff / total_days) * 365, 0)

        if rollback_detected:
            return {
                "status": "Potential inconsistency",
                "confidence": 92,
                "summary": "Critical mileage inconsistency detected. One or more records indicate an odometer rollback, indicating high risk of tampering.",
                "data_points": data_points,
                "rollback_risk": "High",
                "annual_average_km": annual_avg,
                "anomalies": anomalies
            }
        elif len(data_points) >= 4 and len(anomalies) == 0:
            return {
                "status": "Strong evidence of consistency",
                "confidence": 95,
                "summary": f"Chronological odometer progression across {len(data_points)} independent records shows consistent usage (~{int(annual_avg or 0):,} km/yr) without rollback anomalies.",
                "data_points": data_points,
                "rollback_risk": "None",
                "annual_average_km": annual_avg,
                "anomalies": []
            }
        elif len(anomalies) == 0:
            return {
                "status": "Consistent",
                "confidence": 75,
                "summary": f"Available records align with expected progression. Average estimated annual running is ~{int(annual_avg or 0):,} km.",
                "data_points": data_points,
                "rollback_risk": "None",
                "annual_average_km": annual_avg,
                "anomalies": []
            }
        else:
            return {
                "status": "Potential inconsistency",
                "confidence": 70,
                "summary": f"Records exhibit usage anomalies: {'; '.join(anomalies)}",
                "data_points": data_points,
                "rollback_risk": "Low",
                "annual_average_km": annual_avg,
                "anomalies": anomalies
            }

mileage_service = MileageService()
