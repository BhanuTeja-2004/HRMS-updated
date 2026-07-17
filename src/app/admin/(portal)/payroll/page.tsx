"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Table } from "@/components/ui/Table";
import { CYCLE_OPTIONS, formatWorkedMinutes } from "@/lib/payroll-calc";
import type { Employee } from "@/types/employee";
import type { Payroll } from "@/types/payroll";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function statusTone(status: string): "green" | "gray" | "orange" | "blue" | "red" {
  switch (status) {
    case "Approved":
      return "green";
    case "Rejected":
      return "red";
    case "Generated":
      return "blue";
    default:
      return "gray";
  }
}

const emptyGen = { employeeId: "", month: "", cycleDays: "30", monthlyCtc: "", extraDeductions: "" };

export default function AdminPayrollPage() {
  const router = useRouter();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [genOpen, setGenOpen] = useState(false);
  const [gen, setGen] = useState(emptyGen);
  const [genErr, setGenErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const [edit, setEdit] = useState<Payroll | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [pr, emp] = await Promise.all([
        fetch("/api/payroll").then((r) => r.json()),
        fetch("/api/employees").then((r) => r.json()),
      ]);
      setPayrolls(pr.payrolls ?? []);
      setEmployees(emp.employees ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setGenErr({});
    try {
      const res = await fetch("/api/payroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: Number(gen.employeeId),
          month: gen.month,
          cycleDays: Number(gen.cycleDays),
          monthlyCtc: gen.monthlyCtc,
          extraDeductions: gen.extraDeductions,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setGenErr(d.errors ?? { form: d.error ?? "Failed to generate." });
        return;
      }
      setGenOpen(false);
      setGen(emptyGen);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/payroll/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!edit) return;
    setBusy(true);
    try {
      await fetch(`/api/payroll/${edit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edit),
      });
      setEdit(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function openPayslip(p: Payroll) {
    // Create the payslip if needed, then open the editable payslip page.
    const res = await fetch("/api/payslip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payrollId: p.id, clauseDays: p.cycleDays }),
    });
    const d = await res.json();
    if (d.payslip?.id) router.push(`/admin/payslip/${d.payslip.id}`);
  }

  const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
          <p className="text-sm text-gray-500">
            Generate, edit and approve payroll. Worked hours are pulled from attendance automatically.
          </p>
        </div>
        <Button onClick={() => { setGen(emptyGen); setGenErr({}); setGenOpen(true); }}>
          + Generate Payroll
        </Button>
      </div>

      <Table headers={["Employee", "Month", "Worked Hrs", "Gross", "Deductions", "Net", "Status", "Actions"]}>
        {loading ? (
          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
        ) : payrolls.length === 0 ? (
          <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No payroll yet. Click Generate Payroll.</td></tr>
        ) : (
          payrolls.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3">
                <p className="font-medium">{p.employee?.name ?? "-"}</p>
                <p className="text-xs text-gray-500">{p.employee?.employeeId}</p>
              </td>
              <td className="px-4 py-3">{p.month}</td>
              <td className="px-4 py-3">{formatWorkedMinutes(Math.round(p.workedHours * 60))}</td>
              <td className="px-4 py-3">{inr(p.gross)}</td>
              <td className="px-4 py-3">{inr(p.deductions)}</td>
              <td className="px-4 py-3 font-semibold text-brand-red">{inr(p.net)}</td>
              <td className="px-4 py-3"><Badge tone={statusTone(p.status)}>{p.status}</Badge></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button className="text-sm font-semibold text-brand-red hover:underline" onClick={() => setEdit(p)}>Edit</button>
                  {p.status !== "Approved" && (
                    <button className="text-sm font-semibold text-emerald-600 hover:underline" onClick={() => setStatus(p.id, "Approved")}>Approve</button>
                  )}
                  {p.status !== "Rejected" && (
                    <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => setStatus(p.id, "Rejected")}>Reject</button>
                  )}
                  <button className="text-sm font-semibold text-gray-700 hover:underline" onClick={() => openPayslip(p)}>Payslip</button>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      {/* Generate */}
      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="Generate Payroll">
        <form className="space-y-3" onSubmit={generate}>
          <Select
            label="Employee"
            value={gen.employeeId}
            onChange={(e) => setGen({ ...gen, employeeId: e.target.value })}
            options={[{ value: "", label: "Select employee" }, ...employees.map((e) => ({ value: String(e.id), label: `${e.name} (${e.employeeId})` }))]}
          />
          {genErr.employeeId && <p className="text-xs text-red-500">{genErr.employeeId}</p>}
          <Input label="Month" type="month" value={gen.month} onChange={(e) => setGen({ ...gen, month: e.target.value })} error={genErr.month} required />
          <Select
            label="Cycle (days)"
            value={gen.cycleDays}
            onChange={(e) => setGen({ ...gen, cycleDays: e.target.value })}
            options={[{ value: "30", label: "30 (monthly)" }, ...CYCLE_OPTIONS.map((d) => ({ value: String(d), label: `${d} days` }))]}
          />
          <Input label="Monthly CTC (optional override)" type="number" value={gen.monthlyCtc} onChange={(e) => setGen({ ...gen, monthlyCtc: e.target.value })} placeholder="e.g. 45000" />
          <Input label="Extra Deductions" type="number" value={gen.extraDeductions} onChange={(e) => setGen({ ...gen, extraDeductions: e.target.value })} placeholder="0" />
          {genErr.form && <p className="text-sm text-red-500">{genErr.form}</p>}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Generating..." : "Generate"}</Button>
        </form>
      </Modal>

      {/* Edit */}
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Payroll">
        {edit && (
          <form className="space-y-3" onSubmit={saveEdit}>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Worked Hours" type="number" value={String(edit.workedHours)} onChange={(e) => setEdit({ ...edit, workedHours: Number(e.target.value) })} />
              <Input label="Cycle Days" type="number" value={String(edit.cycleDays)} onChange={(e) => setEdit({ ...edit, cycleDays: Number(e.target.value) })} />
              <Input label="Basic" type="number" value={String(edit.basic)} onChange={(e) => setEdit({ ...edit, basic: Number(e.target.value) })} />
              <Input label="Allowances" type="number" value={String(edit.allowances)} onChange={(e) => setEdit({ ...edit, allowances: Number(e.target.value) })} />
              <Input label="Gross" type="number" value={String(edit.gross)} onChange={(e) => { const gross = Number(e.target.value); setEdit({ ...edit, gross, net: Math.max(0, gross + (edit.bonus || 0) - edit.deductions) }); }} />
              <Input label="Bonus" type="number" value={String(edit.bonus ?? 0)} onChange={(e) => { const bonus = Number(e.target.value); setEdit({ ...edit, bonus, net: Math.max(0, edit.gross + bonus - edit.deductions) }); }} />
              <Input label="Deductions" type="number" value={String(edit.deductions)} onChange={(e) => { const deductions = Number(e.target.value); setEdit({ ...edit, deductions, net: Math.max(0, edit.gross + (edit.bonus || 0) - deductions) }); }} />
              <Input label="Net (auto)" type="number" value={String(edit.net)} readOnly />
            </div>
            <Input label="Remarks" value={edit.remarks ?? ""} onChange={(e) => setEdit({ ...edit, remarks: e.target.value })} />
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Saving..." : "Save Changes"}</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
