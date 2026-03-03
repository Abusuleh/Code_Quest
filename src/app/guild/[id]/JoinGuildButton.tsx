"use client";

import { useState } from "react";

export function JoinGuildButton({ guildId }: { guildId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "joined">("idle");

  const handleJoin = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/guild/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId }),
      });
      if (res.ok) {
        setStatus("joined");
      } else {
        setStatus("idle");
      }
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleJoin}
        className="rounded-full bg-cq-violet px-6 py-3 text-xs font-semibold text-white shadow-glow-primary"
        disabled={status !== "idle"}
      >
        {status === "loading" ? "Joining..." : status === "joined" ? "Joined!" : "Join this Guild"}
      </button>
      <p className="text-xs text-cq-text-secondary">
        You will join instantly if you have no guild yet.
      </p>
    </div>
  );
}
