import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseId(id: string): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// GET /api/payroll/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  const payroll = await prisma.payroll.findUnique({
    where: { id },
    include: { employee: true, payslip: true },
  });
  if (!payroll) return NextResponse.json({ error: "Payroll not found." }, { status: 404 });
  return NextResponse.json({ payroll });
}

// PUT /api/payroll/[id]  — edit amounts / worked hours / cycle
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const num = (v: unknown, fallback = 0) => (v === undefined || v === null || v === "" ? fallback : Number(v));

  const basic = num(body.basic);
  const allowances = num(body.allowances);
  const deductions = num(body.deductions);
  const gross = body.gross !== undefined ? num(body.gross) : basic + allowances;
  const bonus = num(body.bonus);
  const net = body.net !== undefined ? num(body.net) : Math.max(0, gross + bonus - deductions);

  try {
    const payroll = await prisma.payroll.update({
      where: { id },
      data: {
        workedHours: num(body.workedHours),
        cycleDays: num(body.cycleDays, 30),
        basic,
        allowances,
        deductions,
        gross,
        bonus,
        net,
        remarks: body.remarks !== undefined ? (body.remarks ? String(body.remarks) : null) : undefined,
        ...(body.status ? { status: String(body.status) } : {}),
      },
      include: { employee: true, payslip: true },
    });
    return NextResponse.json({ payroll });
  } catch (err) {
    console.error("PUT /api/payroll/[id]", err);
    return NextResponse.json({ error: "Failed to update payroll." }, { status: 500 });
  }
}

// PATCH /api/payroll/[id]  — approve / reject
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const status = String(body.status || "");
  if (!["Draft", "Generated", "Approved", "Rejected"].includes(status)) {
    return NextResponse.json({ errors: { status: "Invalid status." } }, { status: 400 });
  }

  try {
    const payroll = await prisma.payroll.update({
      where: { id },
      data: { status, ...(body.remarks !== undefined ? { remarks: String(body.remarks) } : {}) },
      include: { employee: true, payslip: true },
    });
    return NextResponse.json({ payroll });
  } catch (err) {
    console.error("PATCH /api/payroll/[id]", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}

// DELETE /api/payroll/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseId(params.id);
  if (id === null) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  try {
    await prisma.payroll.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/payroll/[id]", err);
    return NextResponse.json({ error: "Failed to delete payroll." }, { status: 500 });
  }
}
