# Module 1 — Employee Management (real MySQL backend)

This module replaces the mock/localStorage employee data with a real Prisma + MySQL
backend, real API routes, and an updated Add / Edit / View employee UI.

## What changed

- **prisma/schema.prisma** — new `Employee` model (personal details, bank details, CRM toggle).
- **src/lib/prisma.ts** — real Prisma client singleton (was a placeholder).
- **src/app/api/employees/route.ts** — `GET` (list + search) and `POST` (create).
- **src/app/api/employees/[id]/route.ts** — `GET`, `PUT`, `DELETE`.
- **src/lib/validation/employee.ts** — server-side validation (PAN, IFSC, Aadhaar, phone, email).
- **src/types/employee.ts** — shared Employee types.
- **src/components/employees/EmployeeForm.tsx** — shared form (Personal + Bank + CRM toggle).
- **src/app/admin/(portal)/employees/page.tsx** — table + Add modal wired to the API.
- **src/app/admin/(portal)/employees/[id]/page.tsx** — Edit + View wired to the API.
- **prisma/seed.ts** — seeds the 4 original employees (with bank details) into MySQL.

## One-time setup on your machine

1. Make sure MySQL is running and create the database:
   ```sql
   CREATE DATABASE hrms_db;
   ```
2. Set your connection string in `.env`:
   ```
   DATABASE_URL="mysql://<user>:<password>@localhost:3306/hrms_db"
   ```
3. Install deps, create the table, generate the client, and seed:
   ```bash
   npm install
   npx prisma migrate dev --name init_employee
   npx prisma generate
   npx prisma db seed
   ```
4. Run it:
   ```bash
   npm run dev      # or: npm run build
   ```

Open **Admin → Employees** to add, edit, and view employees with full personal and
bank details plus the CRM access toggle.

---

# Module 2 — Work Hours, Payroll, Payslip

New models: **Attendance**, **Payroll**, **Payslip** (see prisma/schema.prisma).
Employee gained `monthlyCtc` / `hourlyRate` for auto salary.

Re-run migrations after pulling this module:

```bash
npx prisma migrate dev --name module2_payroll
npx prisma generate
npx prisma db seed
```

What was added:
- **Attendance** (`/candidate/attendance`) now saves login/logout/break + worked minutes to the DB (no localStorage). API: `/api/attendance`.
- **Payroll** (`/admin/payroll`): Generate (auto worked-hours from attendance + auto salary), Edit, Approve, Reject, history + status. API: `/api/payroll`, `/api/payroll/[id]`.
- **Payslip** (`/admin/payslip/[id]`): editable, auto-filled from the employee (bank, PAN, Aadhaar, DOJ). Approve. PDF via `/payslip-print/[id]` (browser Print → Save as PDF). API: `/api/payslip`, `/api/payslip/[id]`.
- **Auto calculations** in `src/lib/payroll-calc.ts`: worked hours, salary, and 45/60/90-day cycles / invoice date from DOJ.
- **CRM**: "Clause Date" → "Clause Days"; exact "Added On" timestamp column; selected-candidates "Selected Date" → "Invoice Date".

Chain: **Employee → Payroll → Payslip** — bank/PAN/Aadhaar/DOJ auto-flow from Employee into the Payslip.
