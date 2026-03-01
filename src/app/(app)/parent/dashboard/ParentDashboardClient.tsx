"use client";

import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/atoms/Button";
import { ChildCard } from "@/components/molecules/ChildCard";

type Child = {
  id: string;
  displayName: string;
  username: string;
  currentPhase: number;
  xpTotal: number;
  avatarConfig?: Prisma.JsonValue | null;
};

export function ParentDashboardClient({ childrenProfiles }: { childrenProfiles: Child[] }) {
  const { update } = useSession();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => router.push("/parent/add-child")}
          className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-cq-border bg-cq-bg-elevated text-sm text-cq-text-secondary hover:border-cq-border-bright"
        >
          + Add child
        </button>
        {childrenProfiles.map((child) => (
          <ChildCard
            key={child.id}
            displayName={child.displayName}
            username={child.username}
            currentPhase={child.currentPhase}
            xpTotal={child.xpTotal}
            avatarConfig={child.avatarConfig}
            onClick={async () => {
              await update({ activeChildId: child.id });
              router.push(`/auth/child-login?childId=${child.id}`);
            }}
          />
        ))}
      </div>
      {childrenProfiles.length === 0 ? (
        <p className="text-sm text-cq-text-secondary">
          No child profiles yet. Add one to unlock the dashboards.
        </p>
      ) : null}
    </div>
  );
}
