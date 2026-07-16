"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { useUserLabel } from "@/hooks/useAuth";
import { payrollRecords } from "@/lib/mock-data";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

export default function CandidatePayrollPage() {
  const { name } = useUserLabel();
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      payrollRecords.filter(
        (r) =>
          r.month.toLowerCase().includes(q.toLowerCase()) ||
          r.status.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payroll</h2>
        <p className="text-sm text-gray-500">
          Salary records and payslips for <strong>{name}</strong>.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Latest Net Pay</p>
          <p className="mt-1 text-2xl font-bold text-brand-red">
            ₹{rows[0]?.net.toLocaleString() || "—"}
          </p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Records</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{rows.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Bank</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {rows[0]?.bank || "HDFC ****4521"}
          </p>
        </Card>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by month or status..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Table headers={["Month", "Gross", "Deductions", "Net Salary", "Status", "Payslip"]}>
        {rows.map((r) => (
          <tr key={r.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{r.month}</td>
            <td className="px-4 py-3">₹{r.gross.toLocaleString()}</td>
            <td className="px-4 py-3">₹{r.deductions.toLocaleString()}</td>
            <td className="px-4 py-3 font-semibold text-brand-red">
              ₹{r.net.toLocaleString()}
            </td>
            <td className="px-4 py-3">
              <Badge tone="green">{r.status}</Badge>
            </td>
            <td className="px-4 py-3">
              <button className="inline-flex items-center gap-1 text-sm font-medium text-brand-red hover:underline">
                <Download size={14} /> Download
              </button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
