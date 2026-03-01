"use client";

import { Avatar } from "@/components/atoms/Avatar";
import { XPBar } from "@/components/molecules/XPBar";

type Props = {
  displayName: string;
  username: string;
  currentPhase: number;
  xpTotal: number;
  lastActive?: string | null;
  avatarConfig?: unknown;
  onClick: () => void;
};

export function ChildCard({
  displayName,
  username,
  currentPhase,
  xpTotal,
  lastActive,
  avatarConfig,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      className="group w-full rounded-3xl border border-cq-border bg-cq-bg-elevated p-5 text-left transition hover:-translate-y-1 hover:border-cq-border-bright"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Avatar
          config={(avatarConfig as { variant?: string; label?: string }) ?? undefined}
          fallback={displayName}
          size={80}
        />
        <div className="flex-1">
          <p className="text-lg font-heading text-white">{displayName}</p>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">@{username}</p>
          <div className="mt-2 inline-flex items-center rounded-full border border-cq-border px-3 py-1 text-xs text-cq-text-secondary">
            Phase {currentPhase}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <XPBar xpTotal={xpTotal} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-cq-text-secondary">
        <span>{lastActive ? `Last active ${lastActive}` : "Ready for launch"}</span>
        <span className="text-cq-cyan opacity-0 transition group-hover:opacity-100">
          Play Now &rarr;
        </span>
      </div>
    </button>
  );
}
