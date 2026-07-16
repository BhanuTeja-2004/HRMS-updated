import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { validateEmployee } from "@/lib/validation/employee";

export const dynamic = "force-dynamic";

// GET /api/employees  — list all employees (newest first), optional ?q= search
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  const where: Prisma.EmployeeWhereInput = q
    ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { employeeId: { contains: q } },
          { department: { contains: q } },
          { designation: { contains: q } },
        ],
      }
    : {};

  const employees = await prisma.employee.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ employees });
}

// POST /api/employees  — create a new employee
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = validateEmployee(body);
  if (!result.ok || !result.data) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const { doj, ...rest } = result.data;

  try {
    const employee = await prisma.employee.create({
      data: {
        ...rest,
        doj: doj ? new Date(doj) : null,
      },
    });
    return NextResponse.json({ employee }, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
      return NextResponse.json(
        { errors: { [target.includes("email") ? "email" : "employeeId"]: `That ${target} already exists.` } },
        { status: 409 }
      );
    }
    console.error("POST /api/employees", err);
    return NextResponse.json({ error: "Failed to create employee." }, { status: 500 });
  }
}
