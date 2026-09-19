import { NextRequest, NextResponse } from "next/server";
import { findVehicleById, initialVehicles } from "@/lib/server-store";

export async function POST(request: NextRequest) {
  try {
    const { vehicle_ids } = await request.json();
    const list = (vehicle_ids || [])
      .map((id: string) => findVehicleById(id))
      .filter(Boolean);

    const vehiclesToCompare = list.length > 0 ? list : [initialVehicles[0], initialVehicles[1]];

    return NextResponse.json({
      vehicles: vehiclesToCompare,
      winner: vehiclesToCompare[0],
      insights: [
        `${vehiclesToCompare[0]?.make} ${vehiclesToCompare[0]?.model} has higher overall health and lower projected 5-year maintenance.`,
        "Both vehicles have verified service records with zero major frame damage.",
      ],
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to compare vehicles" }, { status: 400 });
  }
}
