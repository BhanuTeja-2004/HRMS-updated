"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { leaveRequests as seed } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

export default function AdminLeavesPage() {
  const [rows, setRows] = useState(seed);

  const update = (id: string, status: string) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
        <p className="text-sm text-gray-500">Approve or reject leave requests.</p>
      </div>

      <Table headers={["Employee", "From", "To", "Type", "Reason", "Status", "Actions"]}>
        {rows.map((l) => (
          <tr key={l.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{l.employee}</td>
            <td className="px-4 py-3">{formatDate(l.from)}</td>
            <td className="px-4 py-3">{formatDate(l.to)}</td>
            <td className="px-4 py-3">{l.type}</td>
            <td className="px-4 py-3">{l.reason}</td>
            <td className="px-4 py-3">
              <Badge
                tone={
                  l.status === "Approved"
                    ? "green"
                    : l.status === "Rejected"
                      ? "red"
                      : "orange"
                }
              >
                {l.status}
              </Badge>
            </td>
            <td className="px-4 py-3">
              {l.status === "Pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="success" onClick={() => update(l.id, "Approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => update(l.id, "Rejected")}>
                    Reject
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
