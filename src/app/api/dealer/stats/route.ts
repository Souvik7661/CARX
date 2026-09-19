import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    total_inventory: 24,
    avg_turnaround_days: 14.2,
    ready_for_sale_count: 19,
    pending_inspection_count: 5,
    gross_inventory_value: 48500000,
    top_demanded_brands: ["Honda", "Hyundai", "Toyota", "BMW"],
    risk_distribution: {
      low_risk: 18,
      medium_risk: 5,
      high_risk: 1,
    },
  });
}
