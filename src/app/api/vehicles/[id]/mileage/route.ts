import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    current_odometer: 28450,
    annual_average: 14225,
    tampering_risk: "Low Risk",
    consistency_score: 95,
    flagged: false,
    history_points: [
      { date: "2024-03-10", odometer: 1200 },
      { date: "2024-09-15", odometer: 10450 },
      { date: "2025-04-20", odometer: 19800 },
      { date: "2026-01-18", odometer: 28450 },
    ],
  });
}
