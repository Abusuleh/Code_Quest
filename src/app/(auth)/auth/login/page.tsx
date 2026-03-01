"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { AuthForm } from "@/components/molecules/AuthForm";

export default function LoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "resent">("idle");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const formEmail = formData.get("email")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    setEmail(formEmail);

    const res = await signIn("credentials", {
      email: formEmail,
      password,
      redirect: false,
    });

    if (res?.error) {
      setStatus("error");
      setMessage(res.error === "EMAIL_NOT_VERIFIED" ? "Verify your email first." : "Login failed.");
      return;
    }

    setStatus("idle");
    router.push("/parent/dashboard");
  }

  async function resendVerification() {
    if (!email) {
      setMessage("Enter your email first.");
      setStatus("error");
      return;
    }
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      setStatus("error");
      setMessage("Unable to resend verification email.");
      return;
    }
    setStatus("resent");
    setMessage("Verification email sent. Check your inbox.");
  }

  return (
    <div className="space-y-6">
      <AuthForm
        title="Parent sign in"
        subtitle="Access dashboards, add children, and continue the adventure."
        onSubmit={onSubmit}
        isLoading={status === "loading"}
        error={status === "error" ? message : undefined}
        submitLabel="Sign in"
      >
        <Input
          name="email"
          placeholder="Email address"
          autoComplete="email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />
      </AuthForm>
      {status === "resent" ? (
        <p className="rounded-2xl border border-cq-cyan/40 px-4 py-3 text-sm text-cq-cyan">
          {message}
        </p>
      ) : null}
      {message && status === "error" && message.includes("Verify") ? (
        <Button type="button" variant="outline" className="w-full" onClick={resendVerification}>
          Resend verification email
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => signIn("google", { callbackUrl: "/parent/dashboard" })}
      >
        Continue with Google
      </Button>
      <p className="text-sm text-cq-text-secondary">
        New to CodeQuest?{" "}
        <Link href="/auth/signup" className="text-cq-cyan">
          Create a parent account
        </Link>
        .
      </p>
    </div>
  );
}
