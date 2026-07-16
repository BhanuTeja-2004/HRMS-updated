"use client";

import type { Payslip, PayslipLine } from "@/types/payroll";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export default function PayslipPrintPage() {
  const params = useParams();
  const id = String(params.id);
  const [ps, setPs] = useState<Payslip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/payslip/${id}`);
      if (res.ok) setPs((await res.json()).payslip);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (ps) {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [ps]);

  if (loading) return <div style={{ padding: 40, fontFamily: "sans-serif" }}>Loading...</div>;
  if (!ps) return <div style={{ padding: 40, fontFamily: "sans-serif" }}>Payslip not found.</div>;

  const earnings: PayslipLine[] = Array.isArray(ps.earnings) ? ps.earnings : [];
  const deductions: PayslipLine[] = Array.isArray(ps.deductions) ? ps.deductions : [];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: 32, fontFamily: "Arial, sans-serif", color: "#111" }}>
      <style>{`@media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; } }`}</style>

      <div className="no-print" style={{ marginBottom: 16, textAlign: "right" }}>
        <button onClick={() => window.print()} style={{ background: "#C8102E", color: "#fff", border: 0, padding: "8px 16px", borderRadius: 6, cursor: "pointer" }}>
          Download / Print PDF
        </button>
      </div>

      <div style={{ borderBottom: "3px solid #C8102E", paddingBottom: 12, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, color: "#C8102E" }}>RedFoxa Careerlink</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#555" }}>Salary Payslip — {ps.month}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 12, color: "#555" }}>
          <p style={{ margin: 0 }}>Status: <strong>{ps.status}</strong></p>
          <p style={{ margin: "2px 0 0" }}>Worked Hours: {ps.workedHours}</p>
        </div>
      </div>

      <table style={{ width: "100%", fontSize: 13, marginBottom: 20, borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>Employee</td>
            <td style={{ padding: "4px 0", fontWeight: 700 }}>{ps.employeeName}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>Employee Code</td>
            <td style={{ padding: "4px 0", fontWeight: 700 }}>{ps.employeeCode}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>Designation</td>
            <td style={{ padding: "4px 0" }}>{ps.designation || "-"}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>Department</td>
            <td style={{ padding: "4px 0" }}>{ps.department || "-"}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>Date of Joining</td>
            <td style={{ padding: "4px 0" }}>{fmt(ps.doj)}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>Invoice Date</td>
            <td style={{ padding: "4px 0" }}>{fmt(ps.invoiceDate)}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>Bank</td>
            <td style={{ padding: "4px 0" }}>{ps.bankName || "-"}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>Account No.</td>
            <td style={{ padding: "4px 0" }}>{ps.accountNumber || "-"}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>IFSC</td>
            <td style={{ padding: "4px 0" }}>{ps.ifsc || "-"}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>PAN</td>
            <td style={{ padding: "4px 0" }}>{ps.panNumber || "-"}</td>
          </tr>
          <tr>
            <td style={{ padding: "4px 0", color: "#666" }}>Aadhaar</td>
            <td style={{ padding: "4px 0" }}>{ps.aadhaarNumber || "-"}</td>
            <td style={{ padding: "4px 0", color: "#666" }}>Clause Days</td>
            <td style={{ padding: "4px 0" }}>{ps.clauseDays ?? "-"}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", gap: 20 }}>
        <table style={{ flex: 1, borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={{ textAlign: "left", borderBottom: "2px solid #eee", padding: "6px 0", color: "#C8102E" }}>Earnings</th><th style={{ textAlign: "right", borderBottom: "2px solid #eee", padding: "6px 0" }}>Amount</th></tr></thead>
          <tbody>
            {earnings.map((l, i) => (
              <tr key={i}><td style={{ padding: "5px 0" }}>{l.label}</td><td style={{ padding: "5px 0", textAlign: "right" }}>{inr(l.amount)}</td></tr>
            ))}
            <tr><td style={{ padding: "6px 0", fontWeight: 700, borderTop: "1px solid #eee" }}>Gross</td><td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, borderTop: "1px solid #eee" }}>{inr(ps.grossPay)}</td></tr>
          </tbody>
        </table>
        <table style={{ flex: 1, borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={{ textAlign: "left", borderBottom: "2px solid #eee", padding: "6px 0", color: "#C8102E" }}>Deductions</th><th style={{ textAlign: "right", borderBottom: "2px solid #eee", padding: "6px 0" }}>Amount</th></tr></thead>
          <tbody>
            {deductions.map((l, i) => (
              <tr key={i}><td style={{ padding: "5px 0" }}>{l.label}</td><td style={{ padding: "5px 0", textAlign: "right" }}>{inr(l.amount)}</td></tr>
            ))}
            <tr><td style={{ padding: "6px 0", fontWeight: 700, borderTop: "1px solid #eee" }}>Total</td><td style={{ padding: "6px 0", textAlign: "right", fontWeight: 700, borderTop: "1px solid #eee" }}>{inr(ps.totalDeductions)}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24, background: "#FCE8EB", padding: "14px 18px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: 16 }}>Net Pay</span>
        <span style={{ fontWeight: 700, fontSize: 18, color: "#C8102E" }}>{inr(ps.netPay)}</span>
      </div>

      <p style={{ marginTop: 28, fontSize: 11, color: "#999", textAlign: "center" }}>
        This is a system-generated payslip and does not require a signature.
      </p>
    </div>
  );
}
