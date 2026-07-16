"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { useUserLabel } from "@/hooks/useAuth";
import { attendanceHistory as seedHistory } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

type SessionState = "idle" | "working" | "break";

const HISTORY_KEY = "hrms_attendance_history";
const SESSION_KEY = "hrms_attendance_session";

function formatTimer(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AttendancePage() {
  const { name } = useUserLabel();
  const [state, setState] = useState<SessionState>("idle");
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [history, setHistory] = useState(seedHistory);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
      const sess = localStorage.getItem(SESSION_KEY);
      if (sess) {
        const parsed = JSON.parse(sess);
        setState(parsed.state || "idle");
        setWorkSeconds(parsed.workSeconds || 0);
        setBreakSeconds(parsed.breakSeconds || 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ state, workSeconds, breakSeconds })
    );
  }, [state, workSeconds, breakSeconds]);

  useEffect(() => {
    if (state === "idle") return;
    const id = setInterval(() => {
      if (state === "working") setWorkSeconds((v) => v + 1);
      if (state === "break") setBreakSeconds((v) => v + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const logout = () => {
    const today = new Date().toISOString().slice(0, 10);
    const entry = {
      id: String(Date.now()),
      date: today,
      login: "Today",
      logout: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      workHrs: formatTimer(workSeconds).slice(0, 5).replace(":", "h ") + "m",
      breakHrs: formatTimer(breakSeconds).slice(0, 5).replace(":", "h ") + "m",
      status: "Complete",
    };
    const next = [entry, ...history];
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
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
                <Button variant="success" size="lg" onClick={() => setState("working")}>
                  Login
                </Button>
              )}
              {state === "working" && (
                <>
                  <Button variant="warning" size="lg" onClick={() => setState("break")}>
                    Break
                  </Button>
                  <Button variant="danger" size="lg" onClick={logout}>
                    Logout
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
            <Badge
              tone={
                state === "working" ? "green" : state === "break" ? "orange" : "gray"
              }
            >
              {state === "idle"
                ? "Not Started"
                : state === "working"
                  ? "Active"
                  : "On Break"}
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
            <div className="flex justify-between">
              <span className="text-gray-500">Records</span>
              <span className="font-medium">{history.length}</span>
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
              <td className="px-4 py-3">{row.login}</td>
              <td className="px-4 py-3">{row.logout}</td>
              <td className="px-4 py-3">{row.workHrs}</td>
              <td className="px-4 py-3">{row.breakHrs}</td>
              <td className="px-4 py-3">
                <Badge tone={row.status === "Active" ? "orange" : "green"}>
                  {row.status}
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
