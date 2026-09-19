import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json([
    {
      id: "sr-1",
      date: "2026-01-18",
      odometer: 28450,
      service_type: "Periodic Maintenance (20k/1-yr)",
      workshop: "Apex Honda Authorized Care",
      total_cost: 5800,
      parts_replaced: "Engine Oil, Oil Filter, Drain Plug Washer",
      is_flagged: false,
      source: "OEM Dealer Database",
    },
    {
      id: "sr-2",
      date: "2025-04-20",
      odometer: 19800,
      service_type: "General Inspection & Wheel Alignment",
      workshop: "Apex Honda Authorized Care",
      total_cost: 2100,
      parts_replaced: "None",
      is_flagged: false,
      source: "OEM Dealer Database",
    },
  ]);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const created = {
    id: `sr-${Date.now()}`,
    date: body.date || new Date().toISOString().split("T")[0],
    odometer: body.odometer || 0,
    service_type: body.service_type || "Service",
    workshop: body.workshop || "Authorized Center",
    total_cost: body.total_cost || 0,
    parts_replaced: body.parts_replaced || "",
    is_flagged: false,
    source: "User Upload",
  };
  return NextResponse.json(created, { status: 201 });
}
