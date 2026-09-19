import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, calculateValuation } from "@/lib/server-store";

export async function GET(
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
    estimated_fair_price: 1320000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const val = calculateValuation(vehicle as any);
  return NextResponse.json(val);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const vehicle = findVehicleById(id) || {
      id,
      make: "Honda",
      model: "City ZX",
      year: 2024,
      fuel_type: "Petrol",
      transmission: "Automatic",
      odometer: 28450,
      asking_price: body.asking_price || 1350000,
      estimated_fair_price: 1320000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const val = calculateValuation(vehicle as any, body.asking_price);
    return NextResponse.json(val);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to recalculate valuation" }, { status: 400 });
  }
}
