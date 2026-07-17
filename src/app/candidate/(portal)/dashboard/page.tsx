"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useUserLabel } from "@/hooks/useAuth";
import { CrmSnapshot } from "@/components/dashboard/CrmSnapshot";
import { daysAway, holidays, weeklyChart } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="!p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </Card>
  );
}

const TODAY = new Date("2026-07-16");

export default function CandidateDashboardPage() {
  const { name } = useUserLabel();
  const upcoming = holidays
    .map((h) => ({ ...h, away: daysAway(h.date, TODAY) }))
    .filter((h) => h.away >= 0)
    .sort((a, b) => a.away - b.away)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {name}!
        </h2>
        <p className="text-sm text-gray-500">Here&apos;s your work summary for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today Work" value="05h 20m" color="text-brand-red" />
        <StatCard label="Today Break" value="00h 45m" color="text-blue-600" />
        <StatCard label="This Week" value="38h 10m" color="text-emerald-600" />
        <StatCard label="This Month" value="142h 00m" color="text-orange-600" />
      </div>

      <CrmSnapshot title="My CRM Summary" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Weekly Work & Breaks
          </h3>
          <div className="h-64 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="work" name="Work Hrs" fill="#A31D31" radius={[4, 4, 0, 0]} />
                <Bar dataKey="break" name="Break Hrs" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">Leave Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-amber-50 px-3 py-3">
              <span className="text-sm text-gray-700">Pending</span>
              <Badge tone="orange">1</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-3">
              <span className="text-sm text-gray-700">Approved</span>
              <Badge tone="green">2</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-3">
              <span className="text-sm text-gray-700">Rejected</span>
              <Badge tone="red">1</Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-gray-900">Upcoming Holidays</h3>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {upcoming.map((h) => (
            <div
              key={h.id}
              className="min-w-[180px] rounded-xl border border-gray-100 bg-gradient-to-br from-white to-brand-pink/30 p-4"
            >
              <p className="font-semibold text-gray-900">{h.name}</p>
              <p className="mt-1 text-sm text-gray-500">{formatDate(h.date)}</p>
              <p className="mt-2 text-xs font-medium text-brand-red">{h.away} days away</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
