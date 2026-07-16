import { CRMCandidate, generateCandidates } from "./mock-data";

const STORAGE_KEY = "hrms_crm_candidates_v2";

export function loadCandidates(): CRMCandidate[] {
  if (typeof window === "undefined") return generateCandidates(1000);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CRMCandidate[];
      if (Array.isArray(parsed) && parsed.length >= 1000) return parsed;
    }
  } catch {
    /* ignore */
  }
  const seed = generateCandidates(1000);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

export function saveCandidates(rows: CRMCandidate[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function formatElapsed(addedAt: number, now = Date.now()) {
  const sec = Math.max(0, Math.floor((now - addedAt) / 1000));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
