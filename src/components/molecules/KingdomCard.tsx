"use client";

import { Avatar } from "@/components/atoms/Avatar";

type Mentor = {
  name: string;
  avatar: { variant: string; label: string };
};

type Props = {
  phase: number;
  kingdom: string;
  moduleName?: string | null;
  mentor: Mentor;
};

const gradients: Record<number, string> = {
  1: "from-cq-cyan/20 via-transparent to-transparent",
  2: "from-cq-gold/20 via-transparent to-transparent",
  3: "from-cq-primary/20 via-transparent to-transparent",
  4: "from-cq-green/20 via-transparent to-transparent",
};

export function KingdomCard({ phase, kingdom, moduleName, mentor }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cq-border bg-cq-bg-elevated p-5">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradients[phase] ?? gradients[1]}`}
      />
      <div className="relative z-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Kingdom</p>
        <h3 className="text-xl font-heading text-white">{kingdom}</h3>
        <p className="text-sm text-cq-text-secondary">
          {moduleName ? moduleName : "Module pending"}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Avatar config={mentor.avatar} fallback={mentor.name} size={48} />
          <div>
            <p className="text-sm text-white">{mentor.name}</p>
            <p className="text-xs text-cq-text-secondary">Your mentor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
