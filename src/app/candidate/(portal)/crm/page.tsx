"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { useUserLabel } from "@/hooks/useAuth";
import { formatElapsed, loadCandidates, saveCandidates } from "@/lib/crm-store";
import {
  CRM_STATUSES,
  CRMCandidate,
  LANGUAGES,
  LOCATIONS,
} from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  Download,
  Eye,
  Filter,
  History,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const langTone = (lang: string): "red" | "orange" | "gray" | "blue" => {
  if (lang === "Hindi") return "orange";
  if (lang === "Other") return "gray";
  if (lang === "Bengali") return "blue";
  return "red";
};

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  location: "Bangalore",
  process: "",
  languages: ["English"] as string[],
  status: "New Lead",
  shortlisted: "No" as "Yes" | "No" | "Pending",
  interviewDate: "",
  doj: "",
  remarks: "",
  ctc: "",
  takeHome: "",
  invoiceDate: "",
  clauseDate: "",
};

export default function CRMPage() {
  const { label } = useUserLabel();
  const [rows, setRows] = useState<CRMCandidate[]>([]);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selected, setSelected] = useState<CRMCandidate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [now, setNow] = useState(Date.now());
  const [quick, setQuick] = useState({ name: "", phone: "", location: "Bangalore" });
  const [page, setPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    const data = loadCandidates();
    setRows(data);
    setReady(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
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

  const shortlistedWeek = rows.filter((r) => r.shortlisted === "Yes").length;
  const pendingRnr = rows.filter(
    (r) => r.status === "RNR" || r.shortlisted === "Pending"
  ).length;
  const callsToday = rows.reduce((sum, r) => sum + (r.calls > 0 ? 1 : 0), 0) % 50;

  const persist = (next: CRMCandidate[]) => setRows(next);

  const addCandidate = (data: typeof emptyForm, close = true) => {
    const id = String(Math.max(...rows.map((r) => Number(r.id) || 0), 5000) + 1);
    const row: CRMCandidate = {
      id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      languages: data.languages,
      location: data.location,
      process: data.process || "—",
      shortlisted: data.shortlisted,
      status: data.status,
      interviewDate: data.interviewDate,
      doj: data.doj,
      remarks: data.remarks,
      calls: 0,
      ctc: data.ctc,
      takeHome: data.takeHome,
      invoiceDate: data.invoiceDate,
      clauseDate: data.clauseDate,
      addedAt: Date.now(),
    };
    persist([row, ...rows]);
    setForm(emptyForm);
    if (close) setAddOpen(false);
  };

  const LanguagePicker = ({
    value,
    onChange,
  }: {
    value: string[];
    onChange: (v: string[]) => void;
  }) => (
    <div>
      <p className="mb-2 text-sm font-semibold text-gray-800">Languages Known</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {LANGUAGES.map((lang) => {
          const on = value.includes(lang);
          return (
            <label
              key={lang}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm ${
                on ? "border-brand-red bg-brand-pink/40 text-brand-red" : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() =>
                  onChange(
                    on ? value.filter((x) => x !== lang) : [...value, lang]
                  )
                }
              />
              {lang}
            </label>
          );
        })}
      </div>
    </div>
  );

  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recruitment Tracker</h2>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {rows.length} Candidates
        </span>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
            placeholder="Search by name, phone, email, location..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md">
            <Filter size={16} /> Filter
          </Button>
          <Button variant="secondary" size="md" onClick={() => setImportOpen(true)}>
            <Upload size={16} /> Import
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              const csv = [
                "Name,Phone,Email,Location,Status,CTC,TakeHome,Invoice,Clause",
                ...rows
                  .slice(0, 200)
                  .map(
                    (r) =>
                      `${r.name},${r.phone},${r.email},${r.location},${r.status},${r.ctc},${r.takeHome},${r.invoiceDate},${r.clauseDate}`
                  ),
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "candidates-export.csv";
              a.click();
            }}
          >
            <Download size={16} /> Export
          </Button>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setAddOpen(true);
            }}
          >
            <Plus size={16} /> Add Candidate
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Total Candidates</p>
          <p className="mt-1 text-3xl font-bold text-brand-red">{rows.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Calls Today</p>
          <p className="mt-1 text-3xl font-bold text-blue-600">{callsToday}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Pending / RNR</p>
          <p className="mt-1 text-3xl font-bold text-orange-500">{pendingRnr}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Shortlisted Week</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{shortlistedWeek}</p>
        </Card>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-200 bg-white scrollbar-thin">
        <table className="min-w-[1400px] w-full text-left text-sm">
          <thead>
            <tr className="bg-[#E8F0FE] text-gray-800">
              {[
                "ID",
                "Name",
                "Phone",
                "Email",
                "Languages",
                "Location",
                "Process/Company",
                "Shortlisted",
                "Interview",
                "DOJ",
                "Status",
                "Remarks",
                "CTC",
                "Take-home",
                "Invoice",
                "Clause",
                "Calls",
                "Timer",
                "Actions",
              ].map((h) => (
                <th key={h} className="whitespace-nowrap px-3 py-3 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((r) => (
              <tr key={r.id} className="hover:bg-blue-50/40">
                <td className="px-3 py-2.5 text-gray-500">{r.id}</td>
                <td className="px-3 py-2.5 font-medium text-gray-900">{r.name}</td>
                <td className="px-3 py-2.5 text-blue-600">{r.phone}</td>
                <td className="px-3 py-2.5 text-gray-600">{r.email}</td>
                <td className="px-3 py-2.5">
                  <div className="flex max-w-[160px] flex-wrap gap-1">
                    {r.languages.slice(0, 3).map((l) => (
                      <Badge key={l} tone={langTone(l)}>
                        {l}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <select
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
                    value={r.location}
                    onChange={(e) =>
                      persist(
                        rows.map((x) =>
                          x.id === r.id ? { ...x, location: e.target.value } : x
                        )
                      )
                    }
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </td>
                <td className="max-w-[140px] truncate px-3 py-2.5">{r.process || "—"}</td>
                <td className="px-3 py-2.5">
                  <select
                    className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                    value={r.shortlisted}
                    onChange={(e) =>
                      persist(
                        rows.map((x) =>
                          x.id === r.id
                            ? {
                                ...x,
                                shortlisted: e.target.value as CRMCandidate["shortlisted"],
                              }
                            : x
                        )
                      )
                    }
                  >
                    <option>Yes</option>
                    <option>No</option>
                    <option>Pending</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {r.interviewDate ? formatDate(r.interviewDate) : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {r.doj ? formatDate(r.doj) : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <select
                    className="rounded-md border border-gray-200 px-2 py-1 text-sm"
                    value={r.status}
                    onChange={(e) =>
                      persist(
                        rows.map((x) =>
                          x.id === r.id ? { ...x, status: e.target.value } : x
                        )
                      )
                    }
                  >
                    {CRM_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="max-w-[120px] truncate px-3 py-2.5 text-gray-500">
                  {r.remarks || "—"}
                </td>
                <td className="px-3 py-2.5">{r.ctc || "—"}</td>
                <td className="px-3 py-2.5">{r.takeHome ? `₹${r.takeHome}` : "—"}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {r.invoiceDate ? formatDate(r.invoiceDate) : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  {r.clauseDate ? formatDate(r.clauseDate) : "—"}
                </td>
                <td className="px-3 py-2.5">{r.calls}</td>
                <td className="whitespace-nowrap px-3 py-2.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-700">
                    <History size={12} className="text-brand-red" />
                    {formatElapsed(r.addedAt, now)}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <button
                      title="View"
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-red"
                      onClick={() => {
                        setSelected(r);
                        setViewOpen(true);
                      }}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      title="Edit"
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                      onClick={() => {
                        setSelected(r);
                        setForm({
                          name: r.name,
                          phone: r.phone,
                          email: r.email,
                          location: r.location,
                          process: r.process,
                          languages: r.languages,
                          status: r.status,
                          shortlisted: r.shortlisted,
                          interviewDate: r.interviewDate,
                          doj: r.doj,
                          remarks: r.remarks,
                          ctc: r.ctc,
                          takeHome: r.takeHome,
                          invoiceDate: r.invoiceDate,
                          clauseDate: r.clauseDate,
                        });
                        setEditOpen(true);
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      title="Clear / Delete"
                      className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => persist(rows.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Inline quick-add row */}
            <tr className="bg-gray-50/80">
              <td className="px-3 py-2 text-brand-red">
                <Plus size={16} />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                  placeholder="Candidate name"
                  value={quick.name}
                  onChange={(e) => setQuick({ ...quick, name: e.target.value })}
                />
              </td>
              <td className="px-3 py-2">
                <input
                  className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                  placeholder="Phone"
                  value={quick.phone}
                  onChange={(e) => setQuick({ ...quick, phone: e.target.value })}
                />
              </td>
              <td colSpan={3} className="px-3 py-2">
                <select
                  className="rounded border border-gray-200 px-2 py-1 text-sm"
                  value={quick.location}
                  onChange={(e) => setQuick({ ...quick, location: e.target.value })}
                >
                  {LOCATIONS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </td>
              <td colSpan={13} className="px-3 py-2 text-right">
                <div className="inline-flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!quick.name || !quick.phone) return;
                      addCandidate({
                        ...emptyForm,
                        name: quick.name,
                        phone: quick.phone,
                        location: quick.location,
                        email: "",
                      });
                      setQuick({ name: "", phone: "", location: "Bangalore" });
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setQuick({ name: "", phone: "", location: "Bangalore" })}
                  >
                    Clear
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
        <p>
          Showing {(page - 1) * pageSize + 1}–
          {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span className="px-2 py-1">
            Page {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Candidate" wide>
        <form
          className="grid max-h-[70vh] gap-3 overflow-y-auto sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            addCandidate(form, true);
          }}
        >
          <Input label="Name *" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Phone *" placeholder="10-digit number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Email" placeholder="email@example.com" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Select
            label="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            options={LOCATIONS.map((l) => ({ value: l, label: l }))}
          />
          <div className="sm:col-span-2">
            <Input label="Process / Company" placeholder="e.g., Customer Support – Infosys" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <LanguagePicker
              value={form.languages}
              onChange={(languages) => setForm({ ...form, languages })}
            />
          </div>
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={CRM_STATUSES.map((s) => ({ value: s, label: s }))}
          />
          <Select
            label="Shortlisted"
            value={form.shortlisted}
            onChange={(e) =>
              setForm({
                ...form,
                shortlisted: e.target.value as CRMCandidate["shortlisted"],
              })
            }
            options={[
              { value: "No", label: "No" },
              { value: "Yes", label: "Yes" },
              { value: "Pending", label: "Pending" },
            ]}
          />
          <Input label="Interview Date" type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} />
          <Input label="Date of Joining" type="date" value={form.doj} onChange={(e) => setForm({ ...form, doj: e.target.value })} />
          <Input label="CTC" placeholder="e.g., 2.4 LPA" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} />
          <Input label="Take-home Salary" placeholder="e.g., 18500" value={form.takeHome} onChange={(e) => setForm({ ...form, takeHome: e.target.value })} />
          <Input label="Invoice Date" type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
          <Input label="Clause Date" type="date" value={form.clauseDate} onChange={(e) => setForm({ ...form, clauseDate: e.target.value })} />
          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-sm font-semibold">Remarks</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-red"
              rows={3}
              placeholder="Any additional notes..."
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="flex-1"
              onClick={() => addCandidate(form, false)}
            >
              Save & Add Another
            </Button>
            <Button type="submit" variant="secondary" className="flex-1">
              Save & Close
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Candidate" wide>
        <form
          className="grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!selected) return;
            persist(
              rows.map((x) =>
                x.id === selected.id
                  ? {
                      ...x,
                      ...form,
                      languages: form.languages,
                    }
                  : x
              )
            );
            setEditOpen(false);
          }}
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Process / Company" value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} />
          <Input label="CTC" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: e.target.value })} />
          <Input label="Take-home" value={form.takeHome} onChange={(e) => setForm({ ...form, takeHome: e.target.value })} />
          <Input label="Interview Date" type="date" value={form.interviewDate} onChange={(e) => setForm({ ...form, interviewDate: e.target.value })} />
          <Input label="DOJ" type="date" value={form.doj} onChange={(e) => setForm({ ...form, doj: e.target.value })} />
          <Input label="Invoice Date" type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
          <Input label="Clause Date" type="date" value={form.clauseDate} onChange={(e) => setForm({ ...form, clauseDate: e.target.value })} />
          <div className="sm:col-span-2">
            <Input label="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">
              Update Candidate
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal open={viewOpen} onClose={() => setViewOpen(false)} title="Candidate Details" wide>
        {selected && (
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <p><span className="font-semibold">Name:</span> {selected.name}</p>
            <p><span className="font-semibold">Phone:</span> {selected.phone}</p>
            <p><span className="font-semibold">Email:</span> {selected.email || "—"}</p>
            <p><span className="font-semibold">Location:</span> {selected.location}</p>
            <p><span className="font-semibold">Process:</span> {selected.process}</p>
            <p><span className="font-semibold">Status:</span> {selected.status}</p>
            <p><span className="font-semibold">CTC:</span> {selected.ctc || "—"}</p>
            <p><span className="font-semibold">Take-home:</span> {selected.takeHome || "—"}</p>
            <p><span className="font-semibold">Interview:</span> {selected.interviewDate || "—"}</p>
            <p><span className="font-semibold">DOJ:</span> {selected.doj || "—"}</p>
            <p><span className="font-semibold">Invoice:</span> {selected.invoiceDate || "—"}</p>
            <p><span className="font-semibold">Clause:</span> {selected.clauseDate || "—"}</p>
            <p className="sm:col-span-2"><span className="font-semibold">Languages:</span> {selected.languages.join(", ")}</p>
            <p className="sm:col-span-2"><span className="font-semibold">Remarks:</span> {selected.remarks || "—"}</p>
            <p className="sm:col-span-2">
              <span className="font-semibold">Timer since added:</span>{" "}
              {formatElapsed(selected.addedAt, now)}
            </p>
          </div>
        )}
      </Modal>

      <Modal open={importOpen} onClose={() => setImportOpen(false)} title="Import Candidates">
        <p className="mb-4 text-sm text-gray-500">
          Upload CSV/Excel with Name, Phone, Email, Languages, Location columns.
        </p>
        <Input type="file" accept=".csv,.xlsx,.xls" />
        <Button className="mt-4 w-full" onClick={() => setImportOpen(false)}>
          Import File
        </Button>
      </Modal>
    </div>
  );
}
