import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  STANDARD_MONTHLY_HOURS,
  computeSalary,
  minutesToHours,
  monthPeriod,
} from "@/lib/payroll-calc";

export const dynamic = "force-dynamic";

// GET /api/payroll  — payroll history (newest first)
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const where: Record<string, unknown> = {};
  if (sp.get("employeeId")) where.employeeId = Number(sp.get("employeeId"));
  if (sp.get("status")) where.status = sp.get("status");

  const payrolls = await prisma.payroll.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { employee: true, payslip: true },
  });

  return NextResponse.json({ payrolls });
}

// POST /api/payroll  — generate payroll (auto worked hours + auto salary)
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const employeeId = Number(body.employeeId);
  const month = String(body.month || "").trim(); // yyyy-mm
  if (!employeeId) return NextResponse.json({ errors: { employeeId: "Select an employee." } }, { status: 400 });
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ errors: { month: "Month must be yyyy-mm." } }, { status: 400 });

  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee) return NextResponse.json({ error: "Employee not found." }, { status: 404 });

  const cycleDays = Number(body.cycleDays) || 30;
  const { start, end } = monthPeriod(month);

  // Auto worked hours from attendance for the period.
  const attendance = await prisma.attendance.findMany({
    where: {
      employeeId,
      date: { gte: new Date(start), lte: new Date(end + "T23:59:59") },
    },
  });
  const workedMinutes = attendance.reduce((s, a) => s + (a.workedMinutes || 0), 0);
  let workedHours = minutesToHours(workedMinutes);
  // No attendance recorded yet -> assume a full standard month so salary is not zero.
  if (attendance.length === 0) workedHours = STANDARD_MONTHLY_HOURS;

  const monthlyCtc =
    body.monthlyCtc !== undefined && body.monthlyCtc !== null && body.monthlyCtc !== ""
      ? Number(body.monthlyCtc)
      : employee.monthlyCtc ?? 0;
  const extraDeductions = Number(body.extraDeductions) || 0;

  const salary = computeSalary({
    monthlyCtc,
    hourlyRate: employee.hourlyRate ?? 0,
    workedHours,
    extraDeductions,
  });

  try {
    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        month,
        periodStart: new Date(start),
        periodEnd: new Date(end),
        cycleDays,
        workedHours,
        basic: salary.basic,
        allowances: salary.allowances,
        deductions: salary.deductions,
        gross: salary.gross,
        net: salary.net,
        status: "Generated",
        remarks: body.remarks ? String(body.remarks) : null,
      },
      include: { employee: true, payslip: true },
    });
    return NextResponse.json({ payroll }, { status: 201 });
  } catch (err) {
    console.error("POST /api/payroll", err);
    return NextResponse.json({ error: "Failed to generate payroll." }, { status: 500 });
  }
}
