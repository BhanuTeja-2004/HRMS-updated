import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { computeInvoiceStatus } from "@/lib/invoice-status";

export const dynamic = "force-dynamic";

// Reminders are derived live from invoices (clause days reached) plus any stored reminders.
export async function GET() {
  const [stored, invoices] = await Promise.all([
    prisma.reminder.findMany({ orderBy: { dueDate: "asc" } }),
    prisma.invoice.findMany({ where: { raised: false }, orderBy: { invoiceDate: "asc" } }),
  ]);
  const today = new Date();
  const invoiceReminders = invoices
    .filter((i) => i.invoiceDate && computeInvoiceStatus(i.invoiceDate, i.raised, today) === "GREEN")
    .map((i) => ({
      id: `inv-${i.id}`,
      type: "Invoice",
      refId: i.candidateRef,
      title: `Raise invoice for ${i.candidateName}`,
      message: i.company ?? undefined,
      dueDate: i.invoiceDate,
      status: "Pending",
    }));
  return NextResponse.json({ reminders: [...invoiceReminders, ...stored] });
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  if (!body.title) return NextResponse.json({ errors: { title: "Title required." } }, { status: 400 });
  const reminder = await prisma.reminder.create({
    data: {
      type: String(body.type || "General"),
      refId: body.refId ? String(body.refId) : null,
      title: String(body.title),
      message: body.message ? String(body.message) : null,
      dueDate: body.dueDate ? new Date(String(body.dueDate)) : null,
      status: String(body.status || "Pending"),
    },
  });
  return NextResponse.json({ reminder }, { status: 201 });
}
