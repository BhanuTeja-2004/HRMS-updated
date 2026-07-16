"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { useUserLabel } from "@/hooks/useAuth";
import { formatWorkedMinutes } from "@/lib/payroll-calc";
import { formatDate } from "@/lib/utils";
import type { Attendance } from "@/types/payroll";
import { useCallback, useEffect, useRef, useState } from "react";

type SessionState = "idle" | "working" | "break";

function formatTimer(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function timeOnly(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function AttendancePage() {
  const { name, email } = useUserLabel();
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [state, setState] = useState<SessionState>("idle");
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [history, setHistory] = useState<Attendance[]>([]);
  const [saving, setSaving] = useState(false);
  const loginAtRef = useRef<string | null>(null);

  const loadHistory = useCallback(async (empId: number) => {
    const res = await fetch(`/api/attendance?employeeId=${empId}`);
    if (res.ok) {
      const data = await res.json();
      setHistory(data.records ?? []);
    }
  }, []);

  // Resolve the logged-in user to an employee record by email.
  useEffect(() => {
    if (!email) return;
    (async () => {
      const res = await fetch(`/api/employees?q=${encodeURIComponent(email)}`);
      if (!res.ok) return;
      const data = await res.json();
      const match = (data.employees ?? []).find(
        (e: { email: string; id: number }) => e.email.toLowerCase() === email.toLowerCase()
      );
      if (match) {
        setEmployeeId(match.id);
        loadHistory(match.id);
      }
    })();
  }, [email, loadHistory]);

  useEffect(() => {
    if (state === "idle") return;
    const id = setInterval(() => {
      if (state === "working") setWorkSeconds((v) => v + 1);
      if (state === "break") setBreakSeconds((v) => v + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const startWork = () => {
    if (!loginAtRef.current) loginAtRef.current = new Date().toISOString();
    setState("working");
  };

  const logout = async () => {
    if (employeeId) {
      setSaving(true);
      try {
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId,
            date: new Date().toISOString(),
            loginAt: loginAtRef.current,
            logoutAt: new Date().toISOString(),
            breakMinutes: Math.round(breakSeconds / 60),
            workedMinutes: Math.round(workSeconds / 60),
            status: "Complete",
          }),
        });
        await loadHistory(employeeId);
      } finally {
        setSaving(false);
      }
    }
    loginAtRef.current = null;
    setState("idle");
    setWorkSeconds(0);
    setBreakSeconds(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <p className="text-sm text-gray-500">
          Track login, break, and logout for <strong>{name}</strong>.
        </p>
      </div>

      {!employeeId && email && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
          No employee record linked to {email}. Sessions will not be saved until an employee with this email exists.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col items-center gap-6 py-4 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">Work Time</p>
              <p className="mt-1 font-mono text-3xl font-bold text-gray-900 sm:text-4xl">
                {formatTimer(workSeconds)}
              </p>
              <p className="mt-3 text-sm text-gray-500">Break Time</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-blue-600">
                {formatTimer(breakSeconds)}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {state === "idle" && (
                <Button variant="success" size="lg" onClick={startWork}>
                  Login
                </Button>
              )}
              {state === "working" && (
                <>
                  <Button variant="warning" size="lg" onClick={() => setState("break")}>
                    Break
                  </Button>
                  <Button variant="danger" size="lg" onClick={logout} disabled={saving}>
                    {saving ? "Saving..." : "Logout"}
                  </Button>
                </>
              )}
              {state === "break" && (
                <Button variant="success" size="lg" onClick={() => setState("working")}>
                  Resume Work
                </Button>
              )}
            </div>
          </div>
          <div className="mt-2 text-center">
            <Badge tone={state === "working" ? "green" : state === "break" ? "orange" : "gray"}>
              {state === "idle" ? "Not Started" : state === "working" ? "Active" : "On Break"}
            </Badge>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900">Today Summary</h3>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Employee</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize">{state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Work</span>
              <span className="font-medium">{formatTimer(workSeconds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Break</span>
              <span className="font-medium">{formatTimer(breakSeconds)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-gray-900">
          Work History ({history.length} days)
        </h3>
        <Table headers={["Date", "Login", "Logout", "Work Hrs", "Break Hrs", "Status"]}>
          {history.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/80">
              <td className="whitespace-nowrap px-4 py-3">{formatDate(row.date)}</td>
              <td className="px-4 py-3">{timeOnly(row.loginAt)}</td>
              <td className="px-4 py-3">{timeOnly(row.logoutAt)}</td>
              <td className="px-4 py-3">{formatWorkedMinutes(row.workedMinutes)}</td>
              <td className="px-4 py-3">{formatWorkedMinutes(row.breakMinutes)}</td>
              <td className="px-4 py-3">
                <Badge tone={row.status === "Active" ? "orange" : "green"}>{row.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
