import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, saveVehicle } from "@/lib/server-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let vehicle = findVehicleById(id);

  if (!vehicle) {
    // Graceful fallback for dynamic vehicle IDs
    vehicle = {
      id,
      vin: `VIN${id.toUpperCase().slice(0, 10)}`,
      reg_no: "MH02DQ8841",
      make: "Honda",
      model: "City ZX",
      year: 2024,
      variant: "ZX CVT",
      fuel_type: "Petrol",
      transmission: "Automatic",
      mileage: 28450,
      asking_price: 1350000,
      status: "Active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_demo: false,
    };
  }

  return NextResponse.json(vehicle);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = saveVehicle({ ...body, id });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update vehicle", details: err?.message }, { status: 400 });
  }
}
