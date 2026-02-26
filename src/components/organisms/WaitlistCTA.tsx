"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import styles from "@/components/organisms/WaitlistCTA.module.css";

type Status = "idle" | "success" | "error";

export function WaitlistCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { success: boolean; error?: string; message?: string };
      if (data.success) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setMessage(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="waitlist" className={`${styles.cta} border-t border-cq-border bg-cq-bg-panel`}>
      <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl">The Quest Begins Soon.</h2>
        <p className="mt-4 text-base text-cq-text-secondary sm:text-lg">
          Join thousands of children stepping into the most extraordinary coding world ever built.
        </p>

        {status === "success" ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-cq-green/40 bg-cq-bg-elevated p-6 text-cq-green">
            <div className="text-3xl">✓</div>
            <p className="mt-3 text-base">
              You&apos;re on the list! Check your inbox for a welcome from Byte.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-4 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="you@parent.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              hasError={status === "error"}
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Join the Quest
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-cq-red">{message || "Invalid email."}</p>
        )}
      </div>
    </section>
  );
}
