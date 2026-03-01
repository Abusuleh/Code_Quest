"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";

export function VerifyEmailConfirmClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => searchParams.get("token"), [searchParams]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string>("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    let mounted = true;
    setStatus("loading");
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!mounted) return;
        if (res.ok) {
          router.push("/parent/dashboard");
          return;
        }
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus("error");
        setMessage(data?.error ?? "Verification failed.");
      })
      .catch(() => {
        if (!mounted) return;
        setStatus("error");
        setMessage("Verification failed.");
      });

    return () => {
      mounted = false;
    };
  }, [router, token]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Verify</p>
        <h2 className="mt-2 text-2xl font-heading text-white">Confirming your email</h2>
        <p className="mt-2 text-sm text-cq-text-secondary">
          We&apos;re securing your parent account. You&apos;ll be redirected when complete.
        </p>
      </header>
      <div
        className={`rounded-2xl border px-4 py-3 text-sm ${
          status === "error"
            ? "border-cq-red/50 text-cq-red"
            : "border-cq-border text-cq-text-secondary"
        }`}
      >
        {message}
      </div>
      {status === "error" ? (
        <Button type="button" className="w-full" onClick={() => router.push("/auth/verify-email")}>
          Resend verification email
        </Button>
      ) : null}
    </div>
  );
}
