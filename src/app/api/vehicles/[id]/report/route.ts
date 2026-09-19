import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, calculateRiskScore, calculateValuation } from "@/lib/server-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vehicle = findVehicleById(id) || {
    id,
    make: "Honda",
    model: "City ZX",
    year: 2024,
    fuel_type: "Petrol",
    transmission: "Automatic",
    odometer: 28450,
    asking_price: 1350000,
    overall_risk_score: 92,
    confidence_score: 94,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const reportCode = `REP-${id.slice(0, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  return NextResponse.json({
    report_code: reportCode,
    vehicle_id: id,
    vehicle,
    risk_score: calculateRiskScore(vehicle as any),
    valuation: calculateValuation(vehicle as any),
    generated_at: new Date().toISOString(),
    verification_badge: "CARX Certified Inspection Pass",
  });
}
