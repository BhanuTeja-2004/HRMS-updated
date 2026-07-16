"use client";

import { AuthCard } from "./AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signup, UserRole } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SignupForm({
  role,
  loginHref,
  redirectTo,
}: {
  role: UserRole;
  loginHref: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    signup({ firstName, lastName, email, password, role });
    setLoading(false);
    router.push(redirectTo);
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle={`Register for ${role === "admin" ? "Admin" : "Candidate"} portal`}
      backHref="/"
      backLabel="Back to portal selection"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
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
          minLength={6}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={loginHref} className="font-semibold text-brand-red hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
