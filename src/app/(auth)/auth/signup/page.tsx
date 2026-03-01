"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { AuthForm } from "@/components/molecules/AuthForm";

export default function SignupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name")?.toString().trim() || undefined,
      email: formData.get("email")?.toString().trim(),
      password: formData.get("password")?.toString(),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus("error");
        setMessage(data?.error ?? "Unable to register.");
        return;
      }
      setStatus("done");
      setMessage("Registration complete. Check your inbox to verify your email.");
      event.currentTarget.reset();
      if (payload.email) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(payload.email)}`);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div className="space-y-6">
      <AuthForm
        title="Parent registration"
        subtitle="Start your CodeQuest journey. Verify your email to unlock the dashboard."
        onSubmit={onSubmit}
        isLoading={status === "loading"}
        error={status === "error" ? message : undefined}
        submitLabel="Create account"
      >
        <Input name="name" placeholder="Parent name (optional)" autoComplete="name" />
        <Input name="email" placeholder="Email address" autoComplete="email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password (8+ chars, number, uppercase)"
          autoComplete="new-password"
          required
        />
      </AuthForm>
      {status === "done" ? (
        <p className="rounded-2xl border border-cq-cyan/40 px-4 py-3 text-sm text-cq-cyan">
          {message}
        </p>
      ) : null}
      <p className="text-sm text-cq-text-secondary">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-cq-cyan">
          Sign in
        </Link>
        .
      </p>
      <div className="flex items-center gap-3 text-xs text-cq-text-secondary">
        <span className="h-px flex-1 bg-cq-border" />
        Or continue with Google
        <span className="h-px flex-1 bg-cq-border" />
      </div>
      <Link
        href="/api/auth/signin/google"
        className="flex items-center justify-center rounded-full border border-cq-border px-6 py-3 text-sm text-cq-text-primary"
      >
        Continue with Google
      </Link>
    </div>
  );
}
