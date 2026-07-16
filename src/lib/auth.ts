export type UserRole = "admin" | "candidate";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  crmAccess?: boolean;
}

const STORAGE_KEY = "hrms_auth_user";

export const DEMO_USERS: Array<AuthUser & { password: string }> = [
  {
    id: "admin-1",
    email: "admin@redfoxa.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
  },
  {
    id: "cand-1",
    email: "gayatri@redfoxa.com",
    password: "candidate123",
    firstName: "Gayatri",
    lastName: "H",
    role: "candidate",
    crmAccess: true,
  },
  {
    id: "cand-2",
    email: "candidate@redfoxa.com",
    password: "candidate123",
    firstName: "Rahul",
    lastName: "Sharma",
    role: "candidate",
    crmAccess: true,
  },
];

export function login(
  email: string,
  password: string,
  role: UserRole
): AuthUser | null {
  const found = DEMO_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.role === role
  );
  if (!found) return null;
  const user: AuthUser = {
    id: found.id,
    email: found.email,
    firstName: found.firstName,
    lastName: found.lastName,
    role: found.role,
    crmAccess: found.crmAccess,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function signup(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}): AuthUser {
  const user: AuthUser = {
    id: `${payload.role}-${Date.now()}`,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    role: payload.role,
    crmAccess: payload.role === "candidate",
  };
  DEMO_USERS.push({ ...user, password: payload.password });
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function fullName(user: AuthUser) {
  return `${user.firstName} ${user.lastName}`.trim();
}
