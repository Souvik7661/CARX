import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    total_services: 4,
    oem_verified_services: 4,
    frequency_score: 96,
    last_service_date: "2026-01-18",
    missed_services: 0,
    overall_health: "Excellent",
  });
}
