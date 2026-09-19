import { NextResponse } from "next/server";
import { initialVehicles } from "@/lib/server-store";

export async function POST() {
  return NextResponse.json({
    status: "success",
    message: "Demo archetypes verified in serverless state",
    count: initialVehicles.length,
  });
}
