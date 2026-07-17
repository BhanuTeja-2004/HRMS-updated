"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useUserLabel } from "@/hooks/useAuth";
import { loadCandidates, saveCandidates } from "@/lib/crm-store";
import { CRM_STATUSES, CRMCandidate, LANGUAGES, LOCATIONS } from "@/lib/mock-data";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const IT_OPTIONS = ["IT", "Non-IT"];
const PROCESS_OPTIONS = [
  "Voice Process - Infosys",
  "Non-Voice - Wipro",
  "Customer Support - Infosys",
  "Data Entry - TCS",
  "HR Recruiter - Capgemini",
  "BPO - Cognizant",
  "Technical Support - Accenture",
  "Other",
];
const SHORTLIST_OPTIONS = ["Yes", "No", "Pending"];

const emptyForm = {
  name: "",
  phone: "",
  itType: "Non-IT",
  email: "",
  qualification: "",
  languages: ["English"] as string[],
  location: "Bangalore",
  remarks: "",
  status: "New Lead",
  process: "",
  shortlisted: "No" as string,
  interviewDate: "",
  doj: "",
};

function isToday(value: string | number | undefined): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
function isThisMonth(value: string | number | undefined): boolean {
  if (!value) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth();
}

export default function CRMPage() {
  const { label } = useUserLabel();
  const [rows, setRows] = useState<CRMCandidate[]>([]);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<CRMCandidate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    setRows(loadCandidates());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) saveCandidates(rows);
  }, [rows, ready]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.phone.includes(query) ||
        r.email.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.process.toLowerCase().includes(query)
    );
  }, [q, rows]);

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // Dynamic summary metrics
  const callsToday = rows.filter((r) => isToday(r.addedAt)).length;
  const shortlistedToday = rows.filter((r) => r.shortlisted === "Yes" && isToday(r.addedAt)).length;
  const interviewedToday = rows.filter(
    (r) => isToday(r.interviewDate) && ["Interview Scheduled", "Selected", "Joined"].includes(r.status)
  ).length;
  const scheduledInterviews = rows.filter((r) => isToday(r.interviewDate)).length;
  const joinedThisMonth = rows.filter((r) => r.status === "Joined" && (isThisMonth(r.doj) || isThisMonth(r.addedAt))).length;

  function addCandidate(e: React.FormEvent) {
    e.preventDefault();
    const id = String(Math.max(...rows.map((r) => Number(r.id) || 0), 5000) + 1);
    const row: CRMCandidate = {
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      itType: form.itType,
      qualification: form.qualification,
      languages: form.languages,
      location: form.location,
      remarks: form.remarks,
      status: form.status,
      process: form.process || "-",
      shortlisted: form.shortlisted as CRMCandidate["shortlisted"],
      interviewDate: form.interviewDate,
      doj: form.doj,
      calls: 0,
      ctc: "",
      takeHome: "",
      invoiceDate: "",
      clauseDate: "",
      addedAt: Date.now(),
    };
    setRows((prev) => [row, ...prev]);
    setForm(emptyForm);
    setAddOpen(false);
  }

  function openEdit(r: CRMCandidate) {
    setEditRow(r);
    setForm({
      name: r.name,
      phone: r.phone,
      itType: r.itType ?? "Non-IT",
      email: r.email,
      qualification: r.qualification ?? "",
      languages: r.languages,
      location: r.location,
      remarks: r.remarks,
      status: r.status,
      process: r.process,
      shortlisted: r.shortlisted,
      interviewDate: r.interviewDate,
      doj: r.doj,
    });
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editRow) return;
    setRows((prev) => prev.map((x) => (x.id === editRow.id ? { ...x, ...form, shortlisted: form.shortlisted as CRMCandidate["shortlisted"] } : x)));
    setEditRow(null);
  }

  function updateField(id: string, patch: Partial<CRMCandidate>) {
    setRows((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }

  function remove(id: string) {
    setRows((prev) => prev.filter((x) => x.id !== id));
  }

  const cards = [
    { label: "Calls Today", value: callsToday, tone: "text-brand-red" },
    { label: "Shortlisted Today", value: shortlistedToday, tone: "text-emerald-600" },
    { label: "Interviewed Today", value: interviewedToday, tone: "text-blue-600" },
    { label: "Scheduled Interviews", value: scheduledInterviews, tone: "text-orange-500" },
    { label: "Joined This Month", value: joinedThisMonth, tone: "text-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">CRM</h2>
          <p className="text-sm text-gray-500">Candidate pipeline for {label}.</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setAddOpen(true); }}>
          <Plus size={16} /> Add Candidate
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} className="!p-4">
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.tone}`}>{c.value}</p>
          </Card>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search name, phone, email, location..."
          className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-red"
        />
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-[#E8F0FE] text-gray-800">
              {["#", "Name", "Phone", "IT / Non-IT", "Email", "Qualification", "Languages", "Location", "Remarks", "Status", "Process / Company", "Shortlisted", "Interview Date", "Date of Joining", "Added On", "Actions"].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((r, i) => (
              <tr key={r.id} className="hover:bg-blue-50/40">
                <td className="px-3 py-2.5 text-gray-500">{(page - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-2.5 font-medium text-gray-900">{r.name}</td>
                <td className="px-3 py-2.5">{r.phone}</td>
                <td className="px-3 py-2.5">
                  <select className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={r.itType ?? "Non-IT"} onChange={(e) => updateField(r.id, { itType: e.target.value })}>
                    {IT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5">{r.email}</td>
                <td className="px-3 py-2.5">{r.qualification || "-"}</td>
                <td className="max-w-[140px] truncate px-3 py-2.5">{r.languages.join(", ")}</td>
                <td className="px-3 py-2.5">{r.location}</td>
                <td className="max-w-[140px] truncate px-3 py-2.5 text-gray-500">{r.remarks || "-"}</td>
                <td className="px-3 py-2.5">
                  <select className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={r.status} onChange={(e) => updateField(r.id, { status: e.target.value })}>
                    {CRM_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5">
                  <select className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={PROCESS_OPTIONS.includes(r.process) ? r.process : "Other"} onChange={(e) => updateField(r.id, { process: e.target.value })}>
                    {PROCESS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5">
                  <select className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={r.shortlisted} onChange={(e) => updateField(r.id, { shortlisted: e.target.value as CRMCandidate["shortlisted"] })}>
                    {SHORTLIST_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <input type="date" className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={r.interviewDate || ""} onChange={(e) => updateField(r.id, { interviewDate: e.target.value })} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <input type="date" className="rounded-md border border-gray-200 px-2 py-1 text-sm" value={r.doj || ""} onChange={(e) => updateField(r.id, { doj: e.target.value })} />
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-xs text-gray-600">
                  {new Date(r.addedAt).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <button className="rounded p-1 text-blue-600 hover:bg-blue-50" onClick={() => openEdit(r)} title="Edit"><Pencil size={15} /></button>
                    <button className="rounded p-1 text-red-500 hover:bg-red-50" onClick={() => remove(r.id)} title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{filtered.length} candidates</span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button>
          <span>Page {page} / {totalPages}</span>
          <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal open={addOpen || !!editRow} onClose={() => { setAddOpen(false); setEditRow(null); }} title={editRow ? "Edit Candidate" : "Add Candidate"} wide>
        <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={editRow ? saveEdit : addCandidate}>
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Select label="IT / Non-IT" value={form.itType} onChange={(e) => setForm({ ...form, itType: e.target.value })} options={IT_OPTIONS.map((o) => ({ value: o, label: o }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
          <Select label="Languages (primary)" value={form.languages[0] ?? "English"} onChange={(e) => setForm({ ...form, languages: [e.target.value] })} options={LANGUAGES.map((o) => ({ value: o, label: o }))} />
          <Select label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} options={LOCATIONS.map((o) => ({ value: o, label: o }))} />
          <Input label="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={CRM_STATUSES.map((o) => ({ value: o, label: o }))} />
          <Select label="Process / Company" value={form.process || "Other"} onChange={(e) => setForm({ ...form, process: e.target.value })} options={PROCESS_OPTIONS.map((o) => ({ value: o, label: o }))} />
          <Select label="Shortlisted" value={form.shortlisted} onChange={(e) => setForm({ ...form, shortlisted: e.target.value })} options={SHORTLIST_OPTIONS.map((o) => ({ value: o, label: o }))} />
          <Input label="Interview Date" type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} />
          <Input label="Date of Joining" type="date" value={form.doj} onChange={(e) => setForm({ ...form, doj: e.target.value })} />
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">{editRow ? "Save Changes" : "Add Candidate"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
