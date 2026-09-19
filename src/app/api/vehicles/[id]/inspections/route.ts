import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json([
    {
      id: "insp-1",
      vehicle_id: id,
      battery_voltage: 12.6,
      coolant_temp: 89,
      engine_health: "Optimal",
      mechanic_name: "AI Diagnostics System",
      is_completed: true,
      completed_at: "2026-09-19T18:00:00Z",
      obd_codes: [],
      findings: [
        {
          id: "f-1",
          category: "Chassis & Frame",
          item_name: "Underbody Floor Pan",
          condition: "Pass",
          estimated_repair_cost: 0,
          severity: "None",
        },
        {
          id: "f-2",
          category: "Braking System",
          item_name: "Brake Pad Thickness (Front)",
          condition: "Pass",
          estimated_repair_cost: 0,
          severity: "None",
          notes: "7.2mm remaining",
        },
      ],
    },
  ]);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({
    id: `insp-${Date.now()}`,
    vehicle_id: id,
    ...body,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });
}
