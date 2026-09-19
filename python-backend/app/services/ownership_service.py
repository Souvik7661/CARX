from typing import Dict, Any

class OwnershipService:
    """
    Computes 3-year and 5-year Total Cost of Ownership (TCO) models,
    accounting for purchase price, fuel, insurance renewals, periodic maintenance,
    tyre/battery wear, and depreciation.
    """

    @staticmethod
    def calculate_tco(
        purchase_price: float,
        term_years: int = 5,
        annual_km: int = 12000,
        fuel_price_per_litre: float = 102.0,
        fuel_efficiency_kmpl: float = 14.5,
        insurance_annual: float = 24000.0,
        fuel_type: str = "Petrol"
    ) -> Dict[str, Any]:
        term_years = max(1, min(10, term_years))
        total_km = annual_km * term_years

        # 1. Fuel cost
        if fuel_type.lower() == "electric":
            # ~₹1.5 per km
            fuel_cost = round(total_km * 1.5, 2)
        elif fuel_type.lower() == "diesel":
            kmpl = max(1.0, fuel_efficiency_kmpl * 1.2)
            litres = total_km / kmpl
            fuel_cost = round(litres * (fuel_price_per_litre * 0.9), 2)
        else:
            kmpl = max(1.0, fuel_efficiency_kmpl)
            litres = total_km / kmpl
            fuel_cost = round(litres * fuel_price_per_litre, 2)

        # 2. Insurance with depreciation on IDV
        insurance_total = 0.0
        curr_insurance = insurance_annual
        for _ in range(term_years):
            insurance_total += curr_insurance
            curr_insurance *= 0.92  # Slight decline in IDV premium
        insurance_cost = round(insurance_total, 2)

        # 3. Scheduled Maintenance
        # ~₹15,000 - ₹22,000 / year on average for mainstream segment
        maintenance_cost = round(term_years * 22000.0, 2)

        # 4. Tyres and battery
        # Set of tyres every 45,000 km (~₹28,000) + 1 battery every 3-4 years (~₹7,000)
        tyre_sets = max(1, total_km // 45000)
        tyres_cost = round((tyre_sets * 28000.0) + (7000.0 if term_years >= 3 else 0.0), 2)

        # 5. Depreciation
        # For used cars, depreciation typically runs ~8-10% compounded annually on purchase price
        salvage_ratio = (0.90) ** term_years
        depreciation_cost = round(purchase_price * (1.0 - salvage_ratio), 2)

        total_cost = round(purchase_price + fuel_cost + insurance_cost + maintenance_cost + tyres_cost, 2)

        return {
            "term_years": term_years,
            "purchase_price": purchase_price,
            "fuel_cost": fuel_cost,
            "insurance_cost": insurance_cost,
            "maintenance_cost": maintenance_cost,
            "tyres_cost": tyres_cost,
            "depreciation_cost": depreciation_cost,
            "total_cost": total_cost,
            "estimated_resale_value": round(purchase_price - depreciation_cost, 2),
            "assumptions": {
                "annual_km": annual_km,
                "fuel_price_per_litre": fuel_price_per_litre,
                "fuel_efficiency_kmpl": fuel_efficiency_kmpl,
                "insurance_annual": insurance_annual,
                "fuel_type": fuel_type
            }
        }

ownership_service = OwnershipService()
