"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { jobOpenings, vendors as seedVendors, Vendor } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Briefcase, FileUp, Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function VendorsPage() {
  const [rows, setRows] = useState<Vendor[]>(seedVendors);
  const [detail, setDetail] = useState<Vendor | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Agreement");

  const vendorJobs = useMemo(() => {
    if (!detail) return [];
    return jobOpenings.filter(
      (j) => j.vendorId === detail.id || detail.jobOpeningIds.includes(j.id)
    );
  }, [detail]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Management</h2>
          <p className="text-sm text-gray-500">
            Company details, contacts, website, agreement date, job openings & documents.
          </p>
        </div>
        <Link href="/admin/vendors/new">
          <Button>+ Add Vendor</Button>
        </Link>
      </div>

      <Table
        headers={[
          "Company",
          "Contact Person",
          "Contact Details",
          "Website",
          "Location",
          "Agreement Date",
          "Jobs",
          "Docs",
          "Actions",
        ]}
      >
        {rows.map((v) => {
          const jobs = jobOpenings.filter(
            (j) => j.vendorId === v.id || v.jobOpeningIds.includes(j.id)
          );
          return (
            <tr key={v.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 font-medium">{v.company}</td>
              <td className="px-4 py-3">{v.contactPerson}</td>
              <td className="px-4 py-3">
                <div className="text-sm">
                  <p>{v.contact}</p>
                  <p className="text-gray-500">{v.phone}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <a
                  href={v.website}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit
                </a>
              </td>
              <td className="px-4 py-3">{v.location}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDate(v.agreementDate)}</td>
              <td className="px-4 py-3">
                <Badge tone="blue">{jobs.length} openings</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge tone="orange">{v.documents.length}</Badge>
              </td>
              <td className="px-4 py-3">
                <button
                  className="text-sm font-semibold text-brand-red hover:underline"
                  onClick={() => setDetail(v)}
                >
                  View
                </button>
              </td>
            </tr>
          );
        })}
      </Table>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.company || "Vendor"}
        wide
      >
        {detail && (
          <div className="space-y-5">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p><span className="font-semibold">Contact Person:</span> {detail.contactPerson}</p>
              <p><span className="font-semibold">Email:</span> {detail.contact}</p>
              <p><span className="font-semibold">Phone:</span> {detail.phone}</p>
              <p><span className="font-semibold">Location:</span> {detail.location}</p>
              <p><span className="font-semibold">Website:</span> {detail.website}</p>
              <p><span className="font-semibold">Agreement Date:</span> {formatDate(detail.agreementDate)}</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Briefcase size={16} className="text-brand-red" />
                  Job Openings for this company
                </h4>
                <Link href="/admin/job-openings">
                  <Button size="sm" variant="outline">
                    <Plus size={14} /> Manage Jobs
                  </Button>
                </Link>
              </div>
              {vendorJobs.length === 0 ? (
                <p className="text-sm text-gray-500">No job openings linked yet.</p>
              ) : (
                <div className="space-y-2">
                  {vendorJobs.map((j) => (
                    <Card key={j.id} className="!p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{j.role}</p>
                          <p className="text-xs text-gray-500">
                            {j.process} · {j.location} · CTC {j.ctc} · Take-home ₹{j.takeHome}
                          </p>
                        </div>
                        <Badge tone="red">{j.process}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-semibold">
                  <FileUp size={16} className="text-brand-red" />
                  Required Documents
                </h4>
                <Button
                  size="sm"
                  onClick={() => {
                    setDocOpen(true);
                  }}
                >
                  Upload Document
                </Button>
              </div>
              <div className="space-y-2">
                {detail.documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm"
                  >
                    <span>{d.name}</span>
                    <Badge tone="gray">{d.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={docOpen} onClose={() => setDocOpen(false)} title="Upload Vendor Document">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!detail) return;
            const doc = {
              id: `vd${Date.now()}`,
              name: docName || "document.pdf",
              type: docType,
            };
            setRows((prev) =>
              prev.map((v) =>
                v.id === detail.id
                  ? { ...v, documents: [doc, ...v.documents] }
                  : v
              )
            );
            setDetail({ ...detail, documents: [doc, ...detail.documents] });
            setDocOpen(false);
            setDocName("");
          }}
        >
          <Input label="File Name" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="agreement.pdf" />
          <Input label="Document Type" value={docType} onChange={(e) => setDocType(e.target.value)} />
          <Input type="file" label="Choose File" />
          <Button type="submit" className="w-full">
            Upload
          </Button>
        </form>
      </Modal>
    </div>
  );
}
