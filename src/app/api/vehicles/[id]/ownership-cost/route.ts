import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, calculateOwnershipCost } from "@/lib/server-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const term = parseInt(searchParams.get("term_years") || "5", 10);

  const vehicle = findVehicleById(id) || {
    id,
    make: "Honda",
    model: "City ZX",
    year: 2024,
    fuel_type: "Petrol",
    transmission: "Automatic",
    odometer: 28450,
    asking_price: 1350000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const cost = calculateOwnershipCost(vehicle as any, term);
  return NextResponse.json(cost);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const term = body.term_years || 5;

    const vehicle = findVehicleById(id) || {
      id,
      make: "Honda",
      model: "City ZX",
      year: 2024,
      fuel_type: "Petrol",
      transmission: "Automatic",
      odometer: 28450,
      asking_price: 1350000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const cost = calculateOwnershipCost(vehicle as any, term);
    return NextResponse.json(cost);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to recalculate ownership cost" }, { status: 400 });
  }
}
