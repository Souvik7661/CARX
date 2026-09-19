import { NextResponse } from "next/server";
import { initialVehicles } from "@/lib/server-store";

export async function GET() {
  return NextResponse.json(initialVehicles);
}
