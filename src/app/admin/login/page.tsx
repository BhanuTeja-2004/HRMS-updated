"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export default function AdminLoginPage() {
  return (
    <LoginForm
      role="admin"
      signupHref="/admin/signup"
      redirectTo="/admin/dashboard"
    />
  );
}
