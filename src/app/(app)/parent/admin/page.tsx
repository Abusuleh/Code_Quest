import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/parent/dashboard");
  }

  const [subscriptionStats, activeSubs, pastDueSubs, cancelledSubs] = await Promise.all([
    prisma.subscription.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.subscription.count({ where: { status: "PAST_DUE" } }),
    prisma.subscription.count({ where: { status: "CANCELLED" } }),
  ]);

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const logs = await prisma.deviceLog.findMany({
    where: { seenAt: { gte: since } },
    select: { childId: true, fingerprint: true, seenAt: true },
  });

  const fingerprintMap = new Map<string, { fingerprints: Set<string>; lastSeen: Date }>();
  for (const log of logs) {
    const entry = fingerprintMap.get(log.childId) ?? {
      fingerprints: new Set<string>(),
      lastSeen: log.seenAt,
    };
    entry.fingerprints.add(log.fingerprint);
    if (log.seenAt > entry.lastSeen) entry.lastSeen = log.seenAt;
    fingerprintMap.set(log.childId, entry);
  }

  const flaggedIds = Array.from(fingerprintMap.entries())
    .filter(([, entry]) => entry.fingerprints.size > 4)
    .map(([childId]) => childId);

  const flaggedChildren = flaggedIds.length
    ? await prisma.child.findMany({
        where: { id: { in: flaggedIds } },
        select: { id: true, displayName: true, username: true },
      })
    : [];

  const moderationQueue = await prisma.project.findMany({
    where: { isPublished: false },
    select: { id: true, title: true, createdAt: true },
    take: 10,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Admin</p>
          <h1 className="text-3xl font-heading text-white">Operations Dashboard</h1>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Subscribers</p>
            <p className="mt-2 text-2xl font-heading text-white">{subscriptionStats}</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Active</p>
            <p className="mt-2 text-2xl font-heading text-cq-green">{activeSubs}</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Past Due</p>
            <p className="mt-2 text-2xl font-heading text-cq-gold">{pastDueSubs}</p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Cancelled</p>
            <p className="mt-2 text-2xl font-heading text-cq-red">{cancelledSubs}</p>
          </div>
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Session Anomaly Flags</h2>
          {flaggedChildren.length === 0 ? (
            <p className="mt-2 text-sm text-cq-text-secondary">No anomalies detected.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {flaggedChildren.map((child) => {
                const entry = fingerprintMap.get(child.id);
                const count = entry?.fingerprints.size ?? 0;
                return (
                  <div
                    key={child.id}
                    className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-white">{child.displayName}</p>
                      <p className="text-xs text-cq-text-secondary">@{child.username}</p>
                    </div>
                    <div className="text-right text-xs text-cq-text-secondary">
                      <p>{count} fingerprints</p>
                      <p>Last seen {entry?.lastSeen.toLocaleDateString() ?? "—"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Gallery Moderation Queue</h2>
          {moderationQueue.length === 0 ? (
            <p className="mt-2 text-sm text-cq-text-secondary">No pending projects.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {moderationQueue.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-cq-text-secondary"
                >
                  <span className="text-white">{project.title}</span>
                  <span>{project.createdAt.toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
