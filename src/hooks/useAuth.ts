"use client";

import { AuthUser, getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
    const onStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return user;
}

export function useUserLabel() {
  const user = useCurrentUser();
  if (!user) return { name: "User", email: "", label: "User" };
  const name = `${user.firstName} ${user.lastName}`.trim();
  return { name, email: user.email, label: `${name} (${user.email})` };
}
