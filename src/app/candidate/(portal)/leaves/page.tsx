"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { useUserLabel } from "@/hooks/useAuth";
import { daysAway, holidays, leaveRequestsSeed } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Info,
  PartyPopper,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const TODAY = new Date("2026-07-16");

export default function LeavesPage() {
  const { name } = useUserLabel();
  const [tab, setTab] = useState<"requests" | "calendar">("requests");
  const [open, setOpen] = useState(false);
  const [leaves, setLeaves] = useState(leaveRequestsSeed);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [month, setMonth] = useState(new Date(2026, 6, 1)); // July 2026

  useEffect(() => {
    setLeaves((prev) =>
      prev.map((l) => ({ ...l, employee: name !== "User" ? name.split(" ")[0] : l.employee }))
    );
  }, [name]);

  const holidayDates = useMemo(
    () => new Set(holidays.map((h) => h.date)),
    []
  );

  const upcoming = useMemo(() => {
    return holidays
      .map((h) => ({ ...h, away: daysAway(h.date, TODAY) }))
      .filter((h) => h.away >= 0)
      .sort((a, b) => a.away - b.away);
  }, []);

  const past = useMemo(() => {
    return holidays
      .map((h) => ({ ...h, away: daysAway(h.date, TODAY) }))
      .filter((h) => h.away < 0)
      .sort((a, b) => b.away - a.away);
  }, []);

  const nextHoliday = upcoming[0];
  const approvedThisMonth = leaves.filter(
    (l) => l.status.toLowerCase() === "approved"
  ).length;

  const calendarCells = useMemo(() => {
    const y = month.getFullYear();
    const m = month.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: Array<{ day: number | null; dateStr?: string; isToday?: boolean; isHoliday?: boolean }> =
      [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        dateStr,
        isToday: dateStr === "2026-07-16",
        isHoliday: holidayDates.has(dateStr),
      });
    }
    return cells;
  }, [month, holidayDates]);

  const statusTone = (s: string) => {
    const v = s.toLowerCase();
    if (v === "approved") return "green" as const;
    if (v === "rejected") return "red" as const;
    return "red" as const;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Leaves & Holidays</h2>
        <div className="flex gap-2 rounded-full bg-gray-100 p-1">
          {(["requests", "calendar"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === t
                  ? "bg-brand-red text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t === "requests" ? "Leave Requests" : "Holiday Calendar"}
            </button>
          ))}
        </div>
      </div>

      {tab === "requests" ? (
        <>
          <div className="flex items-start gap-3 rounded-xl border border-brand-pink bg-[#FDF2F3] px-4 py-3 text-sm text-brand-red">
            <Info size={18} className="mt-0.5 shrink-0" />
            <p>
              You get <strong>1 paid leave per month</strong>. This month:{" "}
              <strong>{approvedThisMonth}/1</strong> approved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">Apply for leave and track your requests</p>
            <Button onClick={() => setOpen(true)}>+ Apply Leave</Button>
          </div>

          <Table
            headers={["Employee", "From", "To", "Reason", "Status", "Reviewed By"]}
          >
            {leaves.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 font-medium">{l.employee}</td>
                <td className="px-4 py-3 whitespace-nowrap">{l.from}</td>
                <td className="px-4 py-3 whitespace-nowrap">{l.to}</td>
                <td className="px-4 py-3">{l.reason}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">{l.reviewedBy}</td>
              </tr>
            ))}
          </Table>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Public holidays and festivals — hover a highlighted date to see details.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="!p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pink text-brand-red">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{holidays.length}</p>
                <p className="text-sm text-gray-500">Total Holidays</p>
              </div>
            </Card>
            <Card className="!p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <PartyPopper size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">{nextHoliday?.name || "—"}</p>
                <p className="text-sm text-gray-500">
                  {nextHoliday ? formatDate(nextHoliday.date) : "No upcoming"}
                </p>
                <p className="text-xs text-gray-400">Next Holiday</p>
              </div>
            </Card>
            <Card className="!p-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Clock3 size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {nextHoliday ? nextHoliday.away : "—"}
                </p>
                <p className="text-sm text-gray-500">days away</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <CalendarDays size={16} className="text-brand-red" />
                  Holiday Calendar
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-lg p-1.5 hover:bg-gray-100"
                    onClick={() =>
                      setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
                    }
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="min-w-[120px] text-center text-sm font-semibold">
                    {month.toLocaleString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <button
                    className="rounded-lg p-1.5 hover:bg-gray-100"
                    onClick={() =>
                      setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
                    }
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1">
                {calendarCells.map((c, idx) => {
                  const holiday = c.dateStr
                    ? holidays.find((h) => h.date === c.dateStr)
                    : null;
                  return (
                    <div
                      key={idx}
                      title={holiday ? `${holiday.name} — ${holiday.type}` : undefined}
                      className={`relative flex h-10 items-center justify-center rounded-lg text-sm ${
                        !c.day
                          ? ""
                          : c.isHoliday
                            ? "bg-emerald-50 font-semibold text-emerald-700 ring-1 ring-emerald-200"
                            : c.isToday
                              ? "bg-brand-pink/60 font-semibold text-brand-red ring-1 ring-brand-red/20"
                              : "hover:bg-gray-50"
                      }`}
                    >
                      {c.day}
                      {c.isHoliday && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Holiday
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gray-300" /> Today
                </span>
              </div>
            </Card>

            <Card className="flex max-h-[480px] flex-col !p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <h3 className="font-semibold text-gray-900">All Holidays</h3>
                <Badge tone="red">{holidays.length} total</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  ● Upcoming — {upcoming.length}
                </p>
                <div className="space-y-2">
                  {upcoming.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 p-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{h.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(h.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-400">{h.type}</p>
                      </div>
                      <Badge tone="green">{h.away}d away</Badge>
                    </div>
                  ))}
                </div>
                <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Past · {past.length}
                </p>
                <div className="space-y-2 opacity-60">
                  {past.map((h) => (
                    <div key={h.id} className="rounded-lg border border-gray-100 p-3">
                      <p className="font-medium text-gray-700">{h.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(h.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Apply for Leave">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLeaves((prev) => [
              {
                id: String(Date.now()),
                employee: name.split(" ")[0] || "Candidate",
                from,
                to,
                reason,
                type: "Casual",
                status: "pending",
                reviewedBy: "-",
              },
              ...prev,
            ]);
            setOpen(false);
            setFrom("");
            setTo("");
            setReason("");
          }}
        >
          <Input id="from" label="From Date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
          <Input id="to" label="To Date" type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-800">Reason</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </Modal>
    </div>
  );
}
