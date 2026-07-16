"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { employees as seed } from "@/lib/mock-data";
import Link from "next/link";
import { useState } from "react";

export default function EmployeesPage() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-500">Add and edit employee details.</p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Add Employee</Button>
      </div>

      <Table headers={["Name", "Email", "Phone", "Role", "Status", "Actions"]}>
        {rows.map((e) => (
          <tr key={e.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{e.name}</td>
            <td className="px-4 py-3">{e.email}</td>
            <td className="px-4 py-3">{e.phone}</td>
            <td className="px-4 py-3">{e.role}</td>
            <td className="px-4 py-3">
              <Badge tone="blue">{e.status}</Badge>
            </td>
            <td className="px-4 py-3">
              <Link href={`/admin/employees/${e.id}`} className="text-sm font-semibold text-brand-red hover:underline">
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </Table>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Employee">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setRows((prev) => [
              {
                id: `e${Date.now()}`,
                ...form,
                status: "Logged Out",
                breakHrs: "0h 00m",
                workHrs: "0h 00m",
                crmAccess: false,
              },
              ...prev,
            ]);
            setOpen(false);
            setForm({ name: "", email: "", phone: "", role: "" });
          }}
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <Button type="submit" className="w-full">Save Employee</Button>
        </form>
      </Modal>
    </div>
  );
}
