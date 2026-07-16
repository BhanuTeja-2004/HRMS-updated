"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { employees } from "@/lib/mock-data";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function EmployeeEditPage() {
  const params = useParams();
  const id = String(params.id);
  const emp = useMemo(() => employees.find((e) => e.id === id), [id]);
  const [form, setForm] = useState({
    name: emp?.name || "",
    email: emp?.email || "",
    phone: emp?.phone || "",
    role: emp?.role || "",
  });
  const [saved, setSaved] = useState(false);

  if (!emp) {
    return (
      <Card>
        <p>Employee not found.</p>
        <Link href="/admin/employees" className="mt-3 inline-block text-brand-red">
          Back
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/admin/employees" className="text-sm text-brand-red hover:underline">
          ← Back to employees
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Edit Employee</h2>
      </div>
      <Card>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <Button type="submit" className="w-full">Save Changes</Button>
          {saved && <p className="text-sm text-emerald-600">Changes saved (demo).</p>}
        </form>
      </Card>
    </div>
  );
}
