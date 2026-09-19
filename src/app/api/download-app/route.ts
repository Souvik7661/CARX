import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const zipPath = path.join(process.cwd(), "public", "downloads", "drivesense-mobile-app.zip");

    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: "Mobile app zip package is currently being generated. Please retry in a few seconds." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(zipPath);
    const stats = fs.statSync(zipPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="drivesense-mobile-app.zip"',
        "Content-Length": stats.size.toString(),
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (err: any) {
    console.error("Error serving mobile app zip:", err);
    return NextResponse.json(
      { error: "Failed to download mobile package", details: err?.message },
      { status: 500 }
    );
  }
}
