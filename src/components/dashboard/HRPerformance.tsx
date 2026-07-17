"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { loadCandidates } from "@/lib/crm-store";
import type { Employee } from "@/types/employee";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

function isToday(v: string | number | undefined) {
  if (!v) return false;
  const d = new Date(v); if (Number.isNaN(d.getTime())) return false;
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}
function isThisMonth(v: string | number | undefined) {
  if (!v) return false;
  const d = new Date(v); if (Number.isNaN(d.getTime())) return false;
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth();
}

export function HRPerformance() {
  const [hrs, setHrs] = useState<Employee[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [metrics, setMetrics] = useState({ calls: 0, scheduled: 0, shortlisted: 0, joined: 0 });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/employees");
      if (res.ok) {
        const data = await res.json();
        setHrs((data.employees ?? []).filter((e: Employee) => e.crmEnabled));
      }
    })();
    const rows = loadCandidates();
    setMetrics({
      calls: rows.filter((r) => isToday(r.addedAt)).length,
      scheduled: rows.filter((r) => isToday(r.interviewDate)).length,
      shortlisted: rows.filter((r) => r.shortlisted === "Yes" && isToday(r.addedAt)).length,
      joined: rows.filter((r) => r.status === "Joined" && (isThisMonth(r.doj) || isThisMonth(r.addedAt))).length,
    });
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">HR Performance</h3>
      <Card className="!p-0">
        {hrs.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">No HR recruiters with CRM access yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {hrs.map((hr) => (
              <li key={hr.id}>
                <button
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => setOpen(open === hr.id ? null : hr.id)}
                >
                  <div className="flex items-center gap-2">
                    {open === hr.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className="font-medium">{hr.name}</span>
                    <span className="text-xs text-gray-500">{hr.designation ?? hr.department ?? ""}</span>
                  </div>
                  <Badge tone="green">CRM</Badge>
                </button>
                {open === hr.id && (
                  <div className="grid grid-cols-2 gap-3 px-4 pb-4 sm:grid-cols-4">
                    <Metric label="Calls Today" value={metrics.calls} />
                    <Metric label="Scheduled" value={metrics.scheduled} />
                    <Metric label="Shortlisted" value={metrics.shortlisted} />
                    <Metric label="Joined (Month)" value={metrics.joined} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
      <p className="text-xs text-gray-400">CRM activity is shown from this browser&apos;s CRM data. Per-HR attribution activates once candidates are stored with an owner.</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
