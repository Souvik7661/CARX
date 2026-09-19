import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json([
    {
      id: "doc-1",
      vehicle_id: id,
      doc_type: "Registration Certificate (RC)",
      file_name: "rc_digital_smartcard.pdf",
      file_size: 245000,
      status: "Verified",
      confidence: 0.98,
      uploaded_at: "2026-01-15T10:30:00Z",
    },
    {
      id: "doc-2",
      vehicle_id: id,
      doc_type: "Insurance Policy",
      file_name: "hdfc_ergo_comprehensive.pdf",
      file_size: 420000,
      status: "Active (Exp: Nov 2026)",
      confidence: 0.96,
      uploaded_at: "2026-01-15T10:35:00Z",
    },
  ]);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id: `doc-${Date.now()}`,
    vehicle_id: id,
    status: "Uploaded & Queued for OCR",
    confidence: 0.95,
  });
}
