"use client";

import { LoginForm } from "@/components/auth/LoginForm";

export default function CandidateLoginPage() {
  return (
    <LoginForm
      role="candidate"
      signupHref="/candidate/signup"
      redirectTo="/candidate/dashboard"
    />
  );
}
