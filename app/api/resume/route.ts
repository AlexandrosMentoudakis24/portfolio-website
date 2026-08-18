import { NextResponse } from "next/server";
import { getResume } from "@/lib/models/resume";

export async function GET() {
  try {
    const doc = await getResume();
    if (!doc) {
      return NextResponse.json({ error: "No resume uploaded yet" }, { status: 404 });
    }
    const safeName = String(doc.filename).replace(/["\r\n]/g, "");
    return new NextResponse(doc.data, {
      headers: {
        "Content-Type": doc.contentType,
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
    });
  } catch (err) {
    console.error("Resume fetch error:", err);
    return NextResponse.json({ error: "Failed to retrieve resume" }, { status: 500 });
  }
}