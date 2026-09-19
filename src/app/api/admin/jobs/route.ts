import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "job-101",
      name: "Daily Valuation Sync",
      status: "Completed",
      last_run: "2026-09-19T02:00:00Z",
    },
    {
      id: "job-102",
      name: "OBD-II Telemetry Compression",
      status: "Idle",
      last_run: "2026-09-19T06:00:00Z",
    },
  ]);
}
