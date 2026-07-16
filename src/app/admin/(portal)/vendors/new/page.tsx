"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewVendorPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    company: "",
    contactPerson: "",
    contact: "",
    phone: "",
    website: "",
    location: "",
    agreementDate: "",
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push("/admin/vendors");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/vendors" className="text-sm text-brand-red hover:underline">
          ← Back to vendors
        </Link>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Add New Vendor</h2>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
          <Input label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required />
          <Input label="Contact Email" type="email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <div className="sm:col-span-2">
            <Input label="Agreement Date" type="date" value={form.agreementDate} onChange={(e) => setForm({ ...form, agreementDate: e.target.value })} required />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">Save Vendor</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
