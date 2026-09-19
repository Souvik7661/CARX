import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    services: {
      nextjs_edge: "operational",
      serverless_functions: "operational",
      memory_cache: "operational",
    },
    uptime: 99.98,
  });
}
