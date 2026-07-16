"use client";

import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { employees as seed } from "@/lib/mock-data";
import { useState } from "react";

export default function CRMAccessPage() {
  const [rows, setRows] = useState(seed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">CRM Access Control</h2>
        <p className="text-sm text-gray-500">
          Enable or disable CRM (Recruitment Tracker) for each candidate.
        </p>
      </div>

      <Table headers={["Name", "Email", "Role", "CRM Access"]}>
        {rows.map((e) => (
          <tr key={e.id} className="hover:bg-gray-50/80">
            <td className="px-4 py-3 font-medium">{e.name}</td>
            <td className="px-4 py-3">{e.email}</td>
            <td className="px-4 py-3">{e.role}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setRows((prev) =>
                      prev.map((x) =>
                        x.id === e.id ? { ...x, crmAccess: !x.crmAccess } : x
                      )
                    )
                  }
                  className={`relative h-6 w-11 rounded-full transition ${
                    e.crmAccess ? "bg-brand-red" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      e.crmAccess ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
                <Badge tone={e.crmAccess ? "green" : "gray"}>
                  {e.crmAccess ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
