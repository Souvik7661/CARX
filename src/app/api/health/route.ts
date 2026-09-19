import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DriveSense & CARX Vehicle Intelligence Platform",
    platform: "Vercel Serverless Full-Stack",
    database: "connected",
    version: "1.0.0",
    timestamp: Date.now() / 1000
  });
}
