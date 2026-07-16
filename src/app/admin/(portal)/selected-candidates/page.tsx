"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { selectedCandidates } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

type Selected = (typeof selectedCandidates)[number];

export default function SelectedCandidatesPage() {
  const [detail, setDetail] = useState<Selected | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selected Candidates</h2>
        <p className="text-sm text-gray-500">
          Complete student profile, company, role, interview & joining dates.
        </p>
      </div>
      <Table
        headers={[
          "Student",
          "Company",
          "Role",
          "Location",
          "Interview Date",
          "Joining Date",
          "Invoice Date",
          "Actions",
        ]}
      >
        {selectedCandidates.map((s) => (
          <tr key={s.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3">
              <p className="font-medium">{s.student}</p>
              <p className="text-xs text-gray-500">{s.email}</p>
            </td>
            <td className="px-4 py-3">{s.company}</td>
            <td className="px-4 py-3">{s.role}</td>
            <td className="px-4 py-3">{s.location}</td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(s.interviewDate)}</td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(s.joiningDate)}</td>
            <td className="px-4 py-3 whitespace-nowrap">{formatDate(s.selectedDate)}</td>
            <td className="px-4 py-3">
              <Button size="sm" variant="outline" onClick={() => setDetail(s)}>
                View Profile
              </Button>
            </td>
          </tr>
        ))}
      </Table>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Selected Candidate Profile"
        wide
      >
        {detail && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-gray-400">Student Details</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{detail.student}</p>
              <p className="text-sm text-gray-500">{detail.email} · {detail.phone}</p>
              <p className="mt-2 text-sm text-gray-600">{detail.profile}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Company Details</p>
              <p className="mt-1 font-semibold">{detail.company}</p>
              <p className="text-sm text-gray-500">{detail.location}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Role</p>
              <p className="mt-1 font-semibold">{detail.role}</p>
              <Badge className="mt-2" tone="green">
                Selected
              </Badge>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Interview Date</p>
              <p className="mt-1 font-semibold">{formatDate(detail.interviewDate)}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Joining Date</p>
              <p className="mt-1 font-semibold">{formatDate(detail.joiningDate)}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
