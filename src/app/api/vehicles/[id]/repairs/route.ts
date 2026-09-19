import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    predicted_repairs: [
      {
        component: "Brake Pads (Front)",
        estimated_cost: 4500,
        timeline_months: 6,
        probability: 0.65,
        severity: "Medium",
      },
      {
        component: "Cabin Air Filter",
        estimated_cost: 850,
        timeline_months: 2,
        probability: 0.9,
        severity: "Low",
      },
    ],
    total_estimated_12m_cost: 5350,
  });
}
