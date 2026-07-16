export interface AttendanceRecord {
  id: string;
  date: string;
  login: string;
  logout: string;
  workHrs: string;
  breakHrs: string;
  status: string;
}

export type TimerState = "idle" | "working" | "break";
