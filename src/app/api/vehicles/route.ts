import { NextRequest, NextResponse } from "next/server";
import { getStoredVehicles, saveVehicle } from "@/lib/server-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase();
  const isDemo = searchParams.get("is_demo");

  let list = getStoredVehicles();

  if (query) {
    list = list.filter(
      (v) =>
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.reg_no?.toLowerCase().includes(query) ||
        v.vin?.toLowerCase().includes(query)
    );
  }

  if (isDemo !== null && isDemo !== undefined) {
    const isDemoBool = isDemo === "true";
    list = list.filter((v) => !!v.is_demo === isDemoBool);
  }

  return NextResponse.json(list);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = saveVehicle(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid vehicle data", details: err?.message }, { status: 400 });
  }
}
