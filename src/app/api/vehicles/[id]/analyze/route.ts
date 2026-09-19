import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, calculateRiskScore } from "@/lib/server-store";

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

  const score = calculateRiskScore(vehicle as any);
  return NextResponse.json({ status: "success", risk_score: score });
}
