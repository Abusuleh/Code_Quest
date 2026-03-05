"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";

type Tournament = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  createdAt: string;
};

type FormState = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
};

export function TournamentPanel() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState<string>("");

  const load = async () => {
    const res = await fetch("/api/tournaments");
    if (!res.ok) return;
    const data = (await res.json().catch(() => null)) as { tournaments?: Tournament[] } | null;
    if (data?.tournaments) setTournaments(data.tournaments);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    setStatus("loading");
    setMessage("");
    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setStatus("error");
      setMessage("Unable to create tournament.");
      return;
    }
    setStatus("success");
    setMessage("Tournament created.");
    setForm(emptyForm);
    await load();
  };

  const activate = async (id: string) => {
    const res = await fetch(`/api/tournaments/${id}/activate`, { method: "POST" });
    if (!res.ok) return;
    await load();
  };

  return (
    <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Tournament</p>
          <h2 className="mt-2 text-lg font-heading text-white">Forge Tournament Control</h2>
        </div>
        {message ? (
          <span
            className={`rounded-full border px-3 py-1 text-xs ${
              status === "error"
                ? "border-cq-red/40 text-cq-red"
                : "border-cq-green/40 text-cq-green"
            }`}
          >
            {message}
          </span>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="text-xs text-cq-text-secondary">
          Title
          <input
            className="mt-2 w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
          />
        </label>
        <label className="text-xs text-cq-text-secondary">
          Starts at (ISO)
          <input
            className="mt-2 w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            value={form.startsAt}
            onChange={(event) => updateField("startsAt", event.target.value)}
            placeholder="2026-03-05T00:00:00Z"
          />
        </label>
        <label className="text-xs text-cq-text-secondary">
          Ends at (ISO)
          <input
            className="mt-2 w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            value={form.endsAt}
            onChange={(event) => updateField("endsAt", event.target.value)}
            placeholder="2026-03-12T00:00:00Z"
          />
        </label>
        <label className="text-xs text-cq-text-secondary md:col-span-2">
          Description
          <textarea
            className="mt-2 min-h-[80px] w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>
      </div>

      <div className="mt-4">
        <Button type="button" onClick={submit} disabled={status === "loading"}>
          Create tournament
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {tournaments.length === 0 ? (
          <p className="text-sm text-cq-text-secondary">No tournaments yet.</p>
        ) : (
          tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm"
            >
              <div>
                <p className="text-white">{tournament.title}</p>
                <p className="text-xs text-cq-text-secondary">{tournament.description}</p>
                <p className="text-[11px] text-cq-text-secondary">
                  {new Date(tournament.startsAt).toISOString()} -{" "}
                  {new Date(tournament.endsAt).toISOString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${
                    tournament.isActive
                      ? "border-cq-green/40 text-cq-green"
                      : "border-cq-border text-cq-text-secondary"
                  }`}
                >
                  {tournament.isActive ? "Active" : "Inactive"}
                </span>
                {!tournament.isActive ? (
                  <button
                    type="button"
                    className="rounded-full border border-cq-orange/50 px-3 py-1 text-xs text-cq-orange"
                    onClick={() => activate(tournament.id)}
                  >
                    Activate
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
