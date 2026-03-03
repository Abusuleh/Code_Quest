"use client";

import { useState } from "react";

type GuildSummary = {
  id: string;
  name: string;
  emblem: string;
  xpTotal: number;
  isOpen: boolean;
  maxMembers: number;
  memberCount: number;
};

type GuildMember = {
  username: string | null;
  xpTotal: number;
  xpLevel: number;
};

type GuildDetail = {
  id: string;
  name: string;
  emblem: string;
  description: string | null;
  xpTotal: number;
  trialWins: number;
  isOpen: boolean;
  maxMembers: number;
  members: GuildMember[];
};

const EMBLEMS = ["⚡", "🔥", "🌊", "🏔️", "🌿", "⭐", "🎯", "🛡️"];

export function GuildHubClient({
  initialGuild,
  openGuilds,
}: {
  initialGuild: GuildDetail | null;
  openGuilds: GuildSummary[];
}) {
  const [guild, setGuild] = useState<GuildDetail | null>(initialGuild);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emblem, setEmblem] = useState(EMBLEMS[0]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (loading || !name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/guild/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          emblem,
          isOpen: true,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { guildId?: string };
      if (data.guildId) {
        const guildRes = await fetch(`/api/guild/${data.guildId}`);
        const guildData = (await guildRes.json()) as { guild?: GuildDetail };
        if (guildData.guild) {
          setGuild(guildData.guild);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (guildId: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/guild/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guildId }),
      });
      if (!res.ok) return;
      const guildRes = await fetch(`/api/guild/${guildId}`);
      const guildData = (await guildRes.json()) as { guild?: GuildDetail };
      if (guildData.guild) {
        setGuild(guildData.guild);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/guild/leave", { method: "POST" });
      setGuild(null);
    } finally {
      setLoading(false);
    }
  };

  if (guild) {
    return (
      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 shadow-panel">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Your Guild</p>
            <h1 className="mt-2 text-3xl font-heading text-white">
              {guild.emblem} {guild.name}
            </h1>
            <p className="mt-2 text-sm text-cq-text-secondary">{guild.description}</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-cq-border px-5 py-2 text-xs uppercase tracking-[0.3em] text-cq-text-secondary"
            onClick={handleLeave}
          >
            Leave Guild
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-cq-border bg-cq-bg-panel p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
              Collective XP
            </p>
            <p className="mt-2 text-2xl font-heading text-white">{guild.xpTotal} XP</p>
            <div className="mt-3 h-2 w-full rounded-full bg-cq-bg-elevated">
              <div
                className="h-full rounded-full bg-cq-violet"
                style={{ width: `${Math.min(guild.xpTotal / 5000, 1) * 100}%` }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-panel p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Forge Wins</p>
            <p className="mt-2 text-2xl font-heading text-white">{guild.trialWins}</p>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Keep pushing for weekly glory.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Members</p>
          <div className="mt-3 space-y-2">
            {guild.members.map((member, index) => (
              <div
                key={`${member.username ?? "member"}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg-panel px-4 py-3 text-sm"
              >
                <span className="text-white">{member.username ?? "Guildmate"}</span>
                <span className="text-cq-text-secondary">
                  {member.xpTotal} XP · Level {member.xpLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/forge-trial"
            className="rounded-full bg-cq-violet px-6 py-3 text-xs font-semibold text-white shadow-glow-primary"
          >
            Enter the Forge Trial
          </a>
          <a
            href={`/guild/${guild.id}`}
            className="rounded-full border border-cq-border px-6 py-3 text-xs text-cq-text-secondary"
          >
            View public profile
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Create a Guild</p>
        <h1 className="mt-2 text-3xl font-heading text-white">Start your Builder crew</h1>
        <p className="mt-2 text-sm text-cq-text-secondary">
          Pick a name, emblem, and rally your friends.
        </p>

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            placeholder="Guild name (max 30 chars)"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <textarea
            className="w-full rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-white"
            placeholder="Guild description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {EMBLEMS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`h-10 w-10 rounded-full border text-lg ${
                  emblem === icon
                    ? "border-cq-violet bg-cq-bg-panel text-white"
                    : "border-cq-border bg-cq-bg text-cq-text-secondary"
                }`}
                onClick={() => setEmblem(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rounded-full bg-cq-violet px-6 py-3 text-sm font-semibold text-white shadow-glow-primary"
            onClick={handleCreate}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Guild"}
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Join a Guild</p>
        <h2 className="mt-2 text-2xl font-heading text-white">Open Guilds</h2>
        <div className="mt-4 space-y-3">
          {openGuilds.length === 0 ? (
            <p className="text-sm text-cq-text-secondary">No open guilds yet.</p>
          ) : (
            openGuilds.map((open) => (
              <div
                key={open.id}
                className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg-panel px-4 py-3"
              >
                <div>
                  <p className="text-sm text-white">
                    {open.emblem} {open.name}
                  </p>
                  <p className="text-xs text-cq-text-secondary">
                    {open.memberCount}/{open.maxMembers} members · {open.xpTotal} XP
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-cq-violet/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cq-violet"
                  onClick={() => handleJoin(open.id)}
                  disabled={loading}
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
