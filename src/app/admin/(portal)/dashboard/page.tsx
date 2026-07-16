"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/ui/Table";
import { employees } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const loggedIn = employees.filter((e) => e.status === "Logged In").length;
  const onBreak = employees.filter((e) => e.status === "On Break").length;
  const loggedOut = employees.filter((e) => e.status === "Logged Out").length;

  const tone = (s: string) =>
    s === "Logged In" ? "green" : s === "On Break" ? "orange" : "gray";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">
          Live activity tracking for all employees and candidates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Total Employees</p>
          <p className="mt-1 text-3xl font-bold text-brand-red">{employees.length}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Logged In</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">{loggedIn}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">On Break</p>
          <p className="mt-1 text-3xl font-bold text-orange-500">{onBreak}</p>
        </Card>
        <Card className="!p-4">
          <p className="text-sm text-gray-500">Logged Out</p>
          <p className="mt-1 text-3xl font-bold text-gray-600">{loggedOut}</p>
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold">Live Employee Status</h3>
        <Table headers={["Name", "Role", "Status", "Work Hrs", "Break Hrs", "CRM"]}>
          {employees.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-xs text-gray-500">{e.email}</p>
                </div>
              </td>
              <td className="px-4 py-3">{e.role}</td>
              <td className="px-4 py-3">
                <Badge tone={tone(e.status) as "green" | "orange" | "gray"}>{e.status}</Badge>
              </td>
              <td className="px-4 py-3">{e.workHrs}</td>
              <td className="px-4 py-3">{e.breakHrs}</td>
              <td className="px-4 py-3">
                <Badge tone={e.crmAccess ? "green" : "red"}>
                  {e.crmAccess ? "Enabled" : "Disabled"}
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
