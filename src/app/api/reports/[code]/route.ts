import { NextRequest, NextResponse } from "next/server";
import { initialVehicles, calculateRiskScore, calculateValuation } from "@/lib/server-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const vehicle = initialVehicles[0];

  return NextResponse.json({
    report_code: code,
    vehicle_id: vehicle.id,
    vehicle,
    risk_score: calculateRiskScore(vehicle),
    valuation: calculateValuation(vehicle),
    generated_at: new Date().toISOString(),
    verification_badge: "CARX Verified Authentic",
  });
}
