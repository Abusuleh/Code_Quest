import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ParentDashboardClient } from "./ParentDashboardClient";

export default async function ParentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (session.activeChildId) {
    redirect("/dashboard");
  }

  const childrenProfiles = await prisma.child.findMany({
    where: { parentId: session.user.id },
    select: {
      id: true,
      displayName: true,
      username: true,
      currentPhase: true,
      xpTotal: true,
      avatarConfig: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="min-h-screen px-6 py-12 text-cq-text-primary">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Parent</p>
          <h1 className="text-3xl font-heading text-white">
            Welcome {session.user.name ?? "Commander"}
          </h1>
          <p className="text-sm text-cq-text-secondary">
            Manage child profiles and choose who is ready for the next quest.
          </p>
        </header>
        <ParentDashboardClient childrenProfiles={childrenProfiles} />
        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Parental controls</h2>
          <p className="mt-2 text-sm text-cq-text-secondary">
            Time limits, safe mode, and activity reports will activate in M4.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Time limits", "Safe mode", "Weekly reports"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-cq-text-secondary"
              >
                <span>{label}</span>
                <span className="rounded-full border border-cq-border px-2 py-1 text-xs">Soon</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
