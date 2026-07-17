import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const owner = req.nextUrl.searchParams.get("owner");
  const where = owner ? { owner } : {};
  const candidates = await prisma.candidate.findMany({ where, orderBy: { addedAt: "desc" } });
  return NextResponse.json({ candidates });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!body.name) return NextResponse.json({ errors: { name: "Name is required." } }, { status: 400 });
  const candidate = await prisma.candidate.create({
    data: {
      name: String(body.name),
      phone: body.phone ? String(body.phone) : null,
      email: body.email ? String(body.email) : null,
      itType: body.itType ? String(body.itType) : null,
      qualification: body.qualification ? String(body.qualification) : null,
      languages: Array.isArray(body.languages) ? body.languages : [],
      location: body.location ? String(body.location) : null,
      remarks: body.remarks ? String(body.remarks) : null,
      status: String(body.status || "New Lead"),
      process: body.process ? String(body.process) : null,
      shortlisted: String(body.shortlisted || "No"),
      interviewDate: body.interviewDate ? new Date(String(body.interviewDate)) : null,
      doj: body.doj ? new Date(String(body.doj)) : null,
      owner: body.owner ? String(body.owner) : null,
    },
  });
  return NextResponse.json({ candidate }, { status: 201 });
}
