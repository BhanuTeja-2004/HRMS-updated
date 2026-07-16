"use client";

import { SignupForm } from "@/components/auth/SignupForm";

export default function CandidateSignupPage() {
  return (
    <SignupForm
      role="candidate"
      loginHref="/candidate/login"
      redirectTo="/candidate/dashboard"
    />
  );
}
