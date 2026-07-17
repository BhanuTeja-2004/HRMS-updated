import type { InvoiceStatus } from "@/lib/invoice-status";

export interface Invoice {
  id: number;
  candidateRef: string;
  candidateName: string;
  company: string | null;
  role: string | null;
  doj: string | null;
  clauseDays: number;
  invoiceDate: string | null;
  raised: boolean;
  raisedAt: string | null;
  amount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  status?: InvoiceStatus;
}

export interface InvoiceSummary {
  today: number;
  upcoming: number;
  overdue: number;
  raised: number;
}
