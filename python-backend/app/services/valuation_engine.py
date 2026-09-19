from typing import Dict, Any, List

class ValuationEngine:
    """
    Statistical Valuation and Depreciation Engine.
    Estimates fair-market value band based on original ex-showroom baselines,
    year-over-year depreciation curves, mileage degradation multipliers,
    and detected damage adjustments.
    """

    BASE_ESTIMATES = {
        ("hyundai", "creta"): 1550000.0,
        ("honda", "city"): 1400000.0,
        ("jeep", "compass"): 2300000.0,
        ("bmw", "3 series"): 4800000.0,
        ("bmw", "320d"): 4800000.0,
        ("maruti", "swift"): 780000.0,
        ("tata", "nexon"): 1200000.0,
        ("mahindra", "xuv700"): 2200000.0,
        ("toyota", "innova"): 2500000.0
    }

    @staticmethod
    def calculate_fair_value(
        make: str,
        model: str,
        year: int,
        mileage: int = 40000,
        asking_price: float = 900000.0,
        condition_score: float = 85.0,
        damage_findings: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        make_clean = (make or "").strip().lower()
        model_clean = (model or "").strip().lower()
        
        # Determine baseline original cost
        original_price = 1500000.0
        for (m, mod), p in ValuationEngine.BASE_ESTIMATES.items():
            if m in make_clean and (mod in model_clean or model_clean in mod):
                original_price = p
                break

        # 1. Depreciation based on age (current year = 2026)
        age = max(0, 2026 - year)
        if age == 0:
            deprec_factor = 0.94
        elif age == 1:
            deprec_factor = 0.88
        elif age == 2:
            deprec_factor = 0.80
        elif age == 3:
            deprec_factor = 0.74
        elif age == 4:
            deprec_factor = 0.68
        elif age == 5:
            deprec_factor = 0.62
        else:
            deprec_factor = max(0.25, 0.62 - ((age - 5) * 0.05))

        depreciated_base = original_price * deprec_factor

        # 2. Mileage adjustment (baseline expected: 12,000 km/yr * age)
        expected_km = max(10000, age * 12000)
        actual_km = mileage or expected_km
        km_delta = actual_km - expected_km
        
        # +/- 1.5% per 10,000 km deviation
        km_multiplier = 1.0 - (km_delta / 10000.0) * 0.015
        km_multiplier = max(0.88, min(1.12, km_multiplier))

        # 3. Condition / Damage deduction
        damage_findings = damage_findings or []
        damage_penalty = len(damage_findings) * 0.02
        condition_multiplier = max(0.80, 0.92 + ((condition_score / 100.0) * 0.08) - damage_penalty)

        # Baseline fair midpoint
        fair_midpoint = depreciated_base * km_multiplier * condition_multiplier

        # Fair range +/- 3.5%
        fair_min = round(fair_midpoint * 0.965, -3)
        fair_max = round(fair_midpoint * 1.035, -3)

        # Asking price comparison
        price_diff = round(asking_price - fair_midpoint, -2)

        pct_over = ((asking_price - fair_max) / fair_max) * 100.0

        if asking_price <= fair_max * 1.04 and condition_score >= 75:
            recommendation = "BUY"
            notes = (
                f"Asking price (₹{asking_price:,.0f}) is aligned with estimated fair value range "
                f"(₹{fair_min:,.0f} – ₹{fair_max:,.0f}). Vehicle condition and historical data support this valuation."
            )
        elif pct_over <= 16.0 and condition_score >= 55:
            recommendation = "NEGOTIATE"
            notes = (
                f"Asking price is approximately ₹{price_diff:,.0f} (+{pct_over:.1f}%) above estimated fair value band. "
                f"Target a purchase price in the range of ₹{fair_min:,.0f} – ₹{fair_max:,.0f} during negotiations."
            )
        else:
            recommendation = "AVOID"
            notes = (
                f"Substantial valuation disparity detected. Asking price exceeds fair market range by +{pct_over:.1f}%, "
                f"or vehicle risk metrics indicate unfavorable purchase economics."
            )

        return {
            "estimated_fair_min": fair_min,
            "estimated_fair_max": fair_max,
            "asking_price": asking_price,
            "price_difference": price_diff,
            "recommendation": recommendation,
            "valuation_notes": notes
        }

valuation_engine = ValuationEngine()
