"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { MonacoEditor, type MonacoEditorHandle } from "@/components/organisms/MonacoEditor";
import { motion } from "framer-motion";

type TrialEntry = {
  username: string | null;
  score: number;
  submittedAt: string;
};

type TrialPayload = {
  id: string;
  title: string;
  description: string;
  challenge: {
    objective?: string;
    hint?: string;
    successCondition?: string;
  };
  weekStart: string;
};

export function ForgeTrialClient({
  trial,
  leaderboard,
  previousPodium,
}: {
  trial: TrialPayload;
  leaderboard: TrialEntry[];
  previousPodium: TrialEntry[];
}) {
  const editorRef = useRef<MonacoEditorHandle | null>(null);
  const [score, setScore] = useState(100);
  const [rank, setRank] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const next = new Date(trial.weekStart);
      next.setUTCDate(next.getUTCDate() + 7);
      const diff = next.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("Revealing soon");
        return;
      }
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff / (60 * 60 * 1000)) % 24);
      const minutes = Math.floor((diff / (60 * 1000)) % 60);
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [trial.weekStart]);

  const handleSubmit = async () => {
    if (!editorRef.current || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/forge-trial/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: trial.id,
          code: editorRef.current.getValue(),
          score,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { rank?: number };
      if (data.rank) setRank(data.rank);
    } finally {
      setSubmitting(false);
    }
  };

  const challengeText = useMemo(
    () =>
      [
        `Objective: ${trial.challenge.objective ?? ""}`,
        `Hint: ${trial.challenge.hint ?? ""}`,
        `Success: ${trial.challenge.successCondition ?? ""}`,
      ]
        .filter(Boolean)
        .join("\n"),
    [trial.challenge],
  );

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">This Week</p>
        <h1 className="mt-2 text-3xl font-heading text-white">{trial.title}</h1>
        <p className="mt-2 text-sm text-cq-text-secondary">{trial.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-cq-text-secondary">
          <span>Reveal in {timeLeft}</span>
          {rank ? <span>Your rank: #{rank}</span> : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Challenge</p>
          <Editor
            height="240px"
            defaultLanguage="python"
            theme="codequest-dark"
            value={challengeText}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("codequest-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "keyword", foreground: "00D4FF" },
                  { token: "string", foreground: "00E5A0" },
                ],
                colors: {
                  "editor.background": "#12111A",
                  "editor.foreground": "#F4F4F8",
                },
              });
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "off",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize: 13,
              lineHeight: 20,
            }}
          />
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Your Entry</p>
          <div className="mt-4 h-[260px] overflow-hidden rounded-2xl border border-cq-border bg-cq-bg-panel">
            <MonacoEditor ref={editorRef} lessonId={`forge-trial-${trial.id}`} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
              Score
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={score}
              onChange={(event) => setScore(Number(event.target.value))}
              className="w-24 rounded-full border border-cq-border bg-cq-bg px-3 py-1 text-xs text-white"
            />
            <button
              type="button"
              className="rounded-full bg-cq-violet px-5 py-2 text-xs font-semibold text-white shadow-glow-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Entry"}
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Leaderboard</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {leaderboard.length === 0 ? (
            <p className="text-sm text-cq-text-secondary">No submissions yet.</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={`${entry.username ?? "anon"}-${entry.submittedAt}`}
                className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg-panel px-4 py-3 text-sm"
              >
                <span className="text-white">
                  #{index + 1} {entry.username ?? "Guildmate"}
                </span>
                <span className="text-cq-text-secondary">{entry.score} pts</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Last Week</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {previousPodium.length === 0 ? (
            <p className="text-sm text-cq-text-secondary">Results will appear after reveal.</p>
          ) : (
            previousPodium.map((entry, index) => (
              <motion.div
                key={`${entry.username ?? "anon"}-${entry.submittedAt}`}
                className={`rounded-2xl border border-cq-border bg-cq-bg-panel px-4 py-4 text-center ${
                  index === 0 ? "shadow-glow-gold" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                  {index === 0 ? "Champion" : index === 1 ? "Runner Up" : "Third Place"}
                </p>
                <p className="mt-2 text-lg font-heading text-white">
                  {entry.username ?? "Guildmate"}
                </p>
                <p className="mt-1 text-sm text-cq-text-secondary">{entry.score} pts</p>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
