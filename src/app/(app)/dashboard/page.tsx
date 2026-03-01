import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { XPBar } from "@/components/molecules/XPBar";

export default async function ChildDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  if (!session.activeChildId) {
    redirect("/parent/dashboard");
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: {
      displayName: true,
      currentPhase: true,
      currentModule: true,
      xpTotal: true,
      gems: true,
      streakCurrent: true,
    },
  });

  if (!child) {
    redirect("/parent/dashboard");
  }

  const level = Math.max(1, Math.ceil(child.xpTotal / 500));

  return (
    <main className="min-h-screen px-6 py-12 text-cq-text-primary">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Child</p>
          <h1 className="text-3xl font-heading text-white">{child.displayName}&apos;s dashboard</h1>
          <p className="text-sm text-cq-text-secondary">
            Phase {child.currentPhase} - {child.currentModule ?? "Module pending"}
          </p>
        </header>
        <XPBar currentXP={child.xpTotal} nextLevelXP={2000} level={level} />
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-sm text-cq-text-secondary">Total XP</p>
            <p className="text-2xl font-heading text-white">{child.xpTotal}</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-sm text-cq-text-secondary">Gems</p>
            <p className="text-2xl font-heading text-white">{child.gems}</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-sm text-cq-text-secondary">Current streak</p>
            <p className="text-2xl font-heading text-white">{child.streakCurrent} days</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-sm text-cq-text-secondary">Kingdom card</p>
            <p className="text-sm text-cq-text-secondary">Phase {child.currentPhase} preview</p>
          </div>
        </section>
        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Mentor greeting</h2>
          <p className="mt-2 text-sm text-cq-text-secondary">
            Your mentor is preparing the next quest. Continue when the portal opens in M4.
          </p>
          <button
            className="mt-4 rounded-full border border-cq-border px-5 py-2 text-sm text-cq-text-secondary"
            disabled
          >
            Continue Quest (Coming in M4)
          </button>
        </section>
      </div>
    </main>
  );
}
