"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { jobOpenings as seed, vendors } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AdminJobOpeningsPage() {
  const [jobs, setJobs] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    role: "",
    vendorId: vendors[0]?.id || "",
    process: "Voice",
    skills: "",
    languages: "",
    salary: "",
    ctc: "",
    takeHome: "",
    location: "",
    jd: "",
    invoiceDate: "",
    clauseDate: "",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Openings Management</h2>
          <p className="text-sm text-gray-500">
            Create jobs with CTC, take-home, invoice & clause dates per company.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Create Job</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{job.role}</h3>
                <p className="text-sm text-brand-red">{job.company}</p>
              </div>
              <Badge tone="red">{job.process}</Badge>
            </div>
            <p className="mt-2 text-sm text-gray-500">{job.location}</p>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>Salary: ₹{job.salary}</p>
              <p>CTC: {job.ctc}</p>
              <p>Take-home: ₹{job.takeHome}</p>
              <p className="text-xs text-gray-400">
                Invoice {formatDate(job.invoiceDate)} · Clause {formatDate(job.clauseDate)}
              </p>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">{job.jd}</p>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create Job Opening" wide>
        <form
          className="grid max-h-[70vh] gap-3 overflow-y-auto sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const company =
              vendors.find((v) => v.id === form.vendorId)?.company || "Company";
            setJobs((prev) => [
              {
                id: String(Date.now()),
                vendorId: form.vendorId,
                company,
                role: form.role,
                process: form.process,
                skills: form.skills,
                languages: form.languages,
                salary: form.salary,
                ctc: form.ctc,
                takeHome: form.takeHome,
                location: form.location,
                jd: form.jd,
                invoiceDate: form.invoiceDate || new Date().toISOString().slice(0, 10),
                clauseDate: form.clauseDate || new Date().toISOString().slice(0, 10),
              },
              ...prev,
            ]);
            setOpen(false);
          }}
        >
          <Input label="Job Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
          <Select
            label="Company / Vendor"
            value={form.vendorId}
            onChange={(e) => setForm({ ...form, vendorId: e.target.value })}
            options={vendors.map((v) => ({ value: v.id, label: v.company }))}
          />
          <Select
            label="Process"
            value={form.process}
            onChange={(e) => setForm({ ...form, process: e.target.value })}
            options={[
              { value: "Voice", label: "Voice" },
              { value: "Non-Voice", label: "Non-Voice" },
            ]}
          />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Skills" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <Input label="Languages" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
          <Input label="Salary Range" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="18,000 - 22,000" />
          <Input label="CTC" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} placeholder="2.4 LPA" required />
          <Input label="Take-home Salary" value={form.takeHome} onChange={(e) => setForm({ ...form, takeHome: e.target.value })} placeholder="18500" required />
          <Input label="Invoice Date" type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
          <Input label="Clause Date" type="date" value={form.clauseDate} onChange={(e) => setForm({ ...form, clauseDate: e.target.value })} />
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold">Job Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-red"
              rows={3}
              value={form.jd}
              onChange={(e) => setForm({ ...form, jd: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">
              Create Job
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
