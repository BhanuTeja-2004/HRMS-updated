export interface Candidate {
  id: string;
  name: string;
  phone: string;
  email: string;
  languages: string[];
  location: string;
  process: string;
  shortlisted: string;
  status: string;
  interviewDate: string;
}

export type CRMStatus =
  | "New Lead"
  | "Called"
  | "RNR"
  | "Interested"
  | "Not Interested"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected"
  | "Joined"
  | "On Hold";
