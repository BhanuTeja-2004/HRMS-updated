"use client";

import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { payrollRecords } from "@/lib/mock-data";

export default function AdminPayrollPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Payroll & Payslips</h2>
        <p className="text-sm text-gray-500">Manage salary details and bank info overview.</p>
      </div>
      <Table headers={["Employee", "Month", "Gross", "Deductions", "Net Salary", "Status"]}>
        {payrollRecords.map((r) => (
          <tr key={r.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{r.employee}</td>
            <td className="px-4 py-3">{r.month}</td>
            <td className="px-4 py-3">₹{r.gross.toLocaleString()}</td>
            <td className="px-4 py-3">₹{r.deductions.toLocaleString()}</td>
            <td className="px-4 py-3 font-semibold text-brand-red">
              ₹{r.net.toLocaleString()}
            </td>
            <td className="px-4 py-3">
              <Badge tone="green">{r.status}</Badge>
            </td>
          </tr>
        ))}
      </Table>
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">
        Bank details demo: HDFC Bank · A/C ****4521 · IFSC HDFC0001234
      </div>
    </div>
  );
}
