"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function resendVerification() {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: email ? JSON.stringify({ email }) : undefined,
    });
    if (!res.ok) {
      setStatus("error");
      setMessage("Unable to resend verification email.");
      return;
    }
    setStatus("done");
    setMessage("Verification email sent. Check your inbox.");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Verify</p>
        <h2 className="mt-2 text-2xl font-heading text-white">Check your inbox</h2>
        <p className="mt-2 text-sm text-cq-text-secondary">
          We sent a verification link to your email. Open it to unlock your parent dashboard.
        </p>
        {email ? <p className="text-xs text-cq-text-secondary">Email: {email}</p> : null}
      </header>
      {message ? (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "error" ? "border-cq-red/50 text-cq-red" : "border-cq-cyan/40 text-cq-cyan"
          }`}
        >
          {message}
        </p>
      ) : null}
      <Button
        type="button"
        className="w-full"
        onClick={resendVerification}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Resending..." : "Resend verification email"}
      </Button>
    </div>
  );
}
