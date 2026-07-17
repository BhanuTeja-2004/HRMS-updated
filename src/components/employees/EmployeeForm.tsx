"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EMPLOYEE_STATUSES } from "@/types/employee";
import type { EmployeeInput } from "@/types/employee";

type Errors = Record<string, string>;

interface EmployeeFormProps {
  values: EmployeeInput;
  errors?: Errors;
  onChange: (patch: Partial<EmployeeInput>) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
      {children}
    </h3>
  );
}

export function EmployeeForm({ values, errors = {}, onChange }: EmployeeFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <section className="space-y-3">
        <SectionTitle>Personal Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Employee Name"
            value={values.name}
            onChange={(e) => onChange({ name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Employee ID"
            value={values.employeeId}
            onChange={(e) => onChange({ employeeId: e.target.value })}
            error={errors.employeeId}
            required
          />
          <Input
            label="Department"
            value={values.department ?? ""}
            onChange={(e) => onChange({ department: e.target.value })}
            error={errors.department}
          />
          <Input
            label="Designation"
            value={values.designation ?? ""}
            onChange={(e) => onChange({ designation: e.target.value })}
            error={errors.designation}
          />
          <Input
            label="Phone"
            value={values.phone ?? ""}
            onChange={(e) => onChange({ phone: e.target.value })}
            error={errors.phone}
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Date of Joining"
            type="date"
            value={values.doj ?? ""}
            onChange={(e) => onChange({ doj: e.target.value })}
            error={errors.doj}
          />
          <Select
            label="Status"
            value={values.status ?? "Active"}
            onChange={(e) => onChange({ status: e.target.value })}
            options={EMPLOYEE_STATUSES.map((s) => ({ value: s, label: s }))}
          />
        </div>
      </section>

      {/* Bank Details */}
      <section className="space-y-3">
        <SectionTitle>Bank Details</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Account Holder"
            value={values.accountHolder ?? ""}
            onChange={(e) => onChange({ accountHolder: e.target.value })}
            error={errors.accountHolder}
          />
          <Input
            label="Bank Name"
            value={values.bankName ?? ""}
            onChange={(e) => onChange({ bankName: e.target.value })}
            error={errors.bankName}
          />
          <Input
            label="Account Number"
            value={values.accountNumber ?? ""}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
            error={errors.accountNumber}
          />
          <Input
            label="IFSC"
            value={values.ifsc ?? ""}
            onChange={(e) => onChange({ ifsc: e.target.value.toUpperCase() })}
            error={errors.ifsc}
          />
          <Input
            label="PAN Number"
            value={values.panNumber ?? ""}
            onChange={(e) => onChange({ panNumber: e.target.value.toUpperCase() })}
            error={errors.panNumber}
          />
          <Input
            label="Aadhaar Number"
            value={values.aadhaarNumber ?? ""}
            onChange={(e) => onChange({ aadhaarNumber: e.target.value })}
            error={errors.aadhaarNumber}
          />
        </div>
      </section>

      {/* Salary */}
      <section className="space-y-3">
        <SectionTitle>Salary</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            label="Monthly Salary / CTC"
            type="number"
            value={values.monthlyCtc != null ? String(values.monthlyCtc) : ""}
            onChange={(e) => onChange({ monthlyCtc: e.target.value === "" ? null : Number(e.target.value) })}
            error={errors.monthlyCtc}
            placeholder="e.g. 45000"
          />
          <Input
            label="Take Home Salary"
            type="number"
            value={values.takeHome != null ? String(values.takeHome) : ""}
            onChange={(e) => onChange({ takeHome: e.target.value === "" ? null : Number(e.target.value) })}
            error={errors.takeHome}
            placeholder="e.g. 38000"
          />
        </div>
      </section>

      {/* CRM Access */}
      <section className="space-y-3">
        <SectionTitle>CRM Access</SectionTitle>
        <label className="flex cursor-pointer items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={values.crmEnabled}
            onClick={() => onChange({ crmEnabled: !values.crmEnabled })}
            className={
              "relative inline-flex h-6 w-11 items-center rounded-full transition " +
              (values.crmEnabled ? "bg-brand-red" : "bg-gray-300")
            }
          >
            <span
              className={
                "inline-block h-4 w-4 transform rounded-full bg-white transition " +
                (values.crmEnabled ? "translate-x-6" : "translate-x-1")
              }
            />
          </button>
          <span className="text-sm font-medium text-gray-800">
            {values.crmEnabled ? "CRM access enabled" : "CRM access disabled"}
          </span>
        </label>
      </section>
    </div>
  );
}
