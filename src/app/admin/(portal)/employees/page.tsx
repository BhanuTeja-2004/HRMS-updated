"use client";

import { EmployeeForm } from "@/components/employees/EmployeeForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { emptyEmployeeForm } from "@/lib/employee-form";
import { formatDate } from "@/lib/utils";
import type { Employee, EmployeeInput } from "@/types/employee";
import Link from "next/link";
import { useEffect, useState } from "react";

function statusTone(status: string): "green" | "gray" | "orange" | "blue" {
  switch (status) {
    case "Active":
      return "green";
    case "Inactive":
      return "gray";
    case "Notice Period":
      return "orange";
    default:
      return "blue";
  }
}

export default function EmployeesPage() {
  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EmployeeInput>(emptyEmployeeForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  async function load(q = "") {
    setLoading(true);
    try {
      const res = await fetch(`/api/employees${q ? `?q=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      setRows(data.employees ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors ?? { form: data.error ?? "Failed to save." });
        return;
      }
      setOpen(false);
      setForm(emptyEmployeeForm);
      await load(search);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-500">Add and edit employee details.</p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyEmployeeForm);
            setErrors({});
            setOpen(true);
          }}
        >
          + Add Employee
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Search by name, email, ID, department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table headers={["Employee ID", "Name", "Department", "Designation", "Email", "DOJ", "CRM", "Status", "Actions"]}>
        {loading ? (
          <tr>
            <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
              Loading...
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
              No employees yet. Click Add Employee to create one.
            </td>
          </tr>
        ) : (
          rows.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.employeeId}</td>
              <td className="px-4 py-3 font-medium">{e.name}</td>
              <td className="px-4 py-3">{e.department || "-"}</td>
              <td className="px-4 py-3">{e.designation || "-"}</td>
              <td className="px-4 py-3">{e.email}</td>
              <td className="px-4 py-3">{e.doj ? formatDate(e.doj) : "-"}</td>
              <td className="px-4 py-3">
                <Badge tone={e.crmEnabled ? "green" : "gray"}>
                  {e.crmEnabled ? "Enabled" : "Off"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(e.status)}>{e.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link href={`/admin/employees/${e.id}`} className="text-sm font-semibold text-brand-red hover:underline">
                    Edit
                  </Link>
                  <Link href={`/admin/employees/${e.id}?view=1`} className="text-sm font-semibold text-gray-600 hover:underline">
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Employee" wide>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <EmployeeForm
            values={form}
            errors={errors}
            onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
          />
          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Employee"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
