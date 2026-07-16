// Auto-calculation helpers for payroll, worked hours and billing cycles.

export const CYCLE_OPTIONS = [45, 60, 90] as const;
export type CycleDays = (typeof CYCLE_OPTIONS)[number] | number;

/** Standard expected working hours in a monthly cycle (26 days x 8h). */
export const STANDARD_MONTHLY_HOURS = 26 * 8;

/** Convert worked minutes to hours (2 decimals). */
export function minutesToHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

/** Human readable "Xh Ym" from minutes. */
export function formatWorkedMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

/**
 * Compute worked minutes between login and logout, minus break.
 * Returns 0 when data is incomplete or negative.
 */
export function computeWorkedMinutes(
  loginAt: Date | string | null,
  logoutAt: Date | string | null,
  breakMinutes = 0
): number {
  if (!loginAt || !logoutAt) return 0;
  const inMs = new Date(loginAt).getTime();
  const outMs = new Date(logoutAt).getTime();
  if (Number.isNaN(inMs) || Number.isNaN(outMs) || outMs <= inMs) return 0;
  const gross = Math.round((outMs - inMs) / 60000);
  return Math.max(0, gross - Math.max(0, breakMinutes));
}

export interface SalaryInput {
  monthlyCtc?: number | null;
  hourlyRate?: number | null;
  workedHours: number;
  extraDeductions?: number;
  deductionRate?: number; // fraction of gross, default 0.10
}

export interface SalaryBreakdown {
  gross: number;
  basic: number;
  allowances: number;
  deductions: number;
  net: number;
}

/**
 * Automatic salary calculation from worked hours.
 * - hourlyRate present  -> gross = hourlyRate * workedHours
 * - otherwise           -> gross = monthlyCtc prorated by worked/standard hours
 */
export function computeSalary(input: SalaryInput): SalaryBreakdown {
  const {
    monthlyCtc = 0,
    hourlyRate = 0,
    workedHours,
    extraDeductions = 0,
    deductionRate = 0.1,
  } = input;

  let gross: number;
  if (hourlyRate && hourlyRate > 0) {
    gross = hourlyRate * workedHours;
  } else {
    const ratio = STANDARD_MONTHLY_HOURS > 0 ? Math.min(1, workedHours / STANDARD_MONTHLY_HOURS) : 0;
    gross = (monthlyCtc || 0) * ratio;
  }
  gross = Math.round(gross);

  const statutory = Math.round(gross * deductionRate);
  const deductions = statutory + Math.max(0, Math.round(extraDeductions));
  const basic = Math.round(gross * 0.5);
  const allowances = gross - basic;
  const net = Math.max(0, gross - deductions);

  return { gross, basic, allowances, deductions, net };
}

export interface CycleResult {
  days: number;
  start: string; // ISO date (yyyy-mm-dd)
  end: string;
  invoiceDate: string;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Billing / invoice cycle from a start date (usually DOJ).
 * Supports 45 / 60 / 90 day cycles (or any custom number).
 */
export function computeCycle(startDate: Date | string, days: CycleDays): CycleResult {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + Number(days));
  return {
    days: Number(days),
    start: toISODate(start),
    end: toISODate(end),
    invoiceDate: toISODate(end),
  };
}

/** Add N days to a date, ISO date string out. */
export function addDaysISO(date: Date | string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** First and last day of the month string "yyyy-mm". */
export function monthPeriod(month: string): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, (m || 1) - 1, 1);
  const end = new Date(y, m || 1, 0);
  return { start: toISODate(start), end: toISODate(end) };
}
