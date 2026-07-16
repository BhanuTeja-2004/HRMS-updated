"use client";

import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login, UserRole } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm({
  role,
  signupHref,
  redirectTo,
}: {
  role: UserRole;
  signupHref: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(
    role === "admin" ? "admin@redfoxa.com" : "gayatri@redfoxa.com"
  );
  const [password, setPassword] = useState(
    role === "admin" ? "admin123" : "candidate123"
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const user = login(email, password, role);
    setLoading(false);
    if (!user) {
      setError("Invalid email or password for this portal.");
      return;
    }
    router.push(redirectTo);
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to Smart HRMS "
      backHref="/"
      backLabel="Back to portal selection"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-center text-sm">
          <button type="button" className="font-medium text-brand-red hover:underline">
            Forgot password?
          </button>
        </p>
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href={signupHref} className="font-semibold text-brand-red hover:underline">
            Sign up
          </Link>
        </p>
        <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <p className="font-semibold text-gray-800">Demo credentials</p>
          {role === "admin" ? (
            <p>admin@redfoxa.com / admin123</p>
          ) : (
            <p>gayatri@redfoxa.com / candidate123</p>
          )}
        </div>
      </form>
    </AuthCard>
  );
}
