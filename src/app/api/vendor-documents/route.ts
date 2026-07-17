import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const vendorId = req.nextUrl.searchParams.get("vendorId");
  const where = vendorId ? { vendorId: Number(vendorId) } : {};
  const documents = await prisma.vendorDocument.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const vendorId = Number(body.vendorId);
  const dataUrl = String(body.dataUrl || "");
  if (!vendorId || !dataUrl) return NextResponse.json({ errors: { file: "vendorId and file are required." } }, { status: 400 });
  try {
    const document = await prisma.vendorDocument.create({
      data: {
        vendorId,
        category: String(body.category || "Agreement"),
        fileName: String(body.fileName || "document"),
        fileType: body.fileType ? String(body.fileType) : null,
        dataUrl,
      },
    });
    return NextResponse.json({ document }, { status: 201 });
  } catch (err) { console.error(err); return NextResponse.json({ error: "Failed to upload." }, { status: 500 }); }
}
