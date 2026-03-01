"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PlacementQuiz } from "@/components/organisms/PlacementQuiz";
import { Button } from "@/components/atoms/Button";

export default function PlacementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [resultPhase, setResultPhase] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.activeChildId) {
      router.push("/parent/dashboard");
      return;
    }
    fetch("/api/placement")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as { exists?: boolean } | null;
        if (data?.exists) {
          router.push("/dashboard");
        }
      })
      .catch(() => null);
  }, [router, session?.activeChildId]);

  async function handleComplete(phase: number, answers: { questionId: number; phase: number }[]) {
    setStatus("submitting");
    setMessage("");
    const res = await fetch("/api/placement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase, answers }),
    });
    if (!res.ok) {
      setStatus("error");
      setMessage("Unable to save placement results.");
      return;
    }
    setResultPhase(phase);
    setStatus("done");
  }

  return (
    <main className="min-h-screen px-6 py-12 text-cq-text-primary">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Placement</p>
          <h1 className="text-3xl font-heading text-white">Placement adventure</h1>
          <p className="text-sm text-cq-text-secondary">
            Answer 15 questions to calibrate your starting kingdom.
          </p>
        </header>
        {status === "done" ? (
          <div className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Results</p>
            <h2 className="mt-2 text-2xl font-heading text-white">
              Kingdom assigned: Phase {resultPhase}
            </h2>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Your adventure starts now. We&apos;ll refine this as you progress.
            </p>
            <Button className="mt-6 w-full" onClick={() => router.push("/dashboard")}>
              Enter dashboard
            </Button>
          </div>
        ) : status === "error" ? (
          <div className="rounded-2xl border border-cq-red/50 bg-cq-bg-elevated p-4 text-sm text-cq-red">
            {message}
            <Button className="mt-3 w-full" onClick={() => router.refresh()}>
              Try again
            </Button>
          </div>
        ) : (
          <PlacementQuiz onComplete={handleComplete} />
        )}
      </div>
    </main>
  );
}
