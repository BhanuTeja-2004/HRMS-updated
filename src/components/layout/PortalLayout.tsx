"use client";

import { Header } from "./Header";
import { Sidebar, NavItem } from "./Sidebar";
import { AuthUser, getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PortalLayout({
  children,
  navItems,
  portalLabel,
  requiredRole,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  portalLabel: string;
  requiredRole: "admin" | "candidate";
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== requiredRole) {
      router.replace(requiredRole === "admin" ? "/admin/login" : "/candidate/login");
      return;
    }
    setUser(u);
    setReady(true);
  }, [router, requiredRole]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6f8]">
      <div className="hidden lg:block">
        <Sidebar items={navItems} portalLabel={portalLabel} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full w-64">
            <Sidebar items={navItems} portalLabel={portalLabel} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
