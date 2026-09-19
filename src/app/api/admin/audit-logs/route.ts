import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "log-1",
      action: "Vehicle Created",
      target: "Honda City ZX",
      user: "Souvik Kundu",
      timestamp: "2026-09-19T18:00:00Z",
    },
    {
      id: "log-2",
      action: "Valuation Recalculated",
      target: "BMW 320d",
      user: "System Automator",
      timestamp: "2026-09-19T17:30:00Z",
    },
  ]);
}
