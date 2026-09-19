import { NextRequest, NextResponse } from "next/server";

let weightsState = {
  documentation: 0.25,
  service_history: 0.20,
  mileage: 0.15,
  mechanical: 0.20,
  visual: 0.10,
  market: 0.10,
};

export async function GET() {
  return NextResponse.json(weightsState);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    weightsState = { ...weightsState, ...body };
    return NextResponse.json(weightsState);
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update scoring weights" }, { status: 400 });
  }
}
