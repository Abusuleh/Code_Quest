import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ForgeTrialClient } from "./ForgeTrialClient";
import { FORGE_TRIAL_SEEDS } from "@/data/forge-trials";
import { canAccessLesson } from "@/lib/subscription-gate";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getWeekStart(date: Date) {
  const day = date.getUTCDay();
  const diff = (day + 6) % 7;
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

function getWeekIndex(weekStart: Date) {
  const year = weekStart.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const jan1Day = jan1.getUTCDay();
  const offset = (jan1Day + 6) % 7;
  const firstMonday = new Date(Date.UTC(year, 0, 1 - offset));
  return Math.floor((weekStart.getTime() - firstMonday.getTime()) / ONE_WEEK_MS);
}

export default async function ForgeTrialPage() {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    redirect("/auth/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });
  if (!canAccessLesson(subscription, 1, 2)) {
    return (
      <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
        <div className="mx-auto max-w-2xl rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 text-center shadow-panel">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Locked</p>
          <h1 className="mt-3 text-3xl font-heading text-white">Forge Trials</h1>
          <p className="mt-2 text-sm text-cq-text-secondary">
            Champion access is required to compete in weekly Forge Trials.
          </p>
          <div className="mt-6">
            <a
              href="/pricing?locked=true"
              className="inline-flex items-center justify-center rounded-full bg-cq-violet px-6 py-3 text-sm font-semibold text-white shadow-glow-primary"
            >
              Upgrade to Champion
            </a>
          </div>
        </div>
      </main>
    );
  }

  const currentWeekStart = getWeekStart(new Date());
  let trial = await prisma.forgeTrial.findUnique({
    where: { weekStart_phase: { weekStart: currentWeekStart, phase: 2 } },
    select: {
      id: true,
      title: true,
      description: true,
      challenge: true,
      weekStart: true,
    },
  });

  if (!trial) {
    const seedIndex = getWeekIndex(currentWeekStart) % FORGE_TRIAL_SEEDS.length;
    const seed = FORGE_TRIAL_SEEDS[seedIndex];
    trial = await prisma.forgeTrial.create({
      data: {
        weekStart: currentWeekStart,
        title: seed.title,
        description: seed.description,
        challenge: seed.challenge,
        phase: 2,
      },
      select: {
        id: true,
        title: true,
        description: true,
        challenge: true,
        weekStart: true,
      },
    });
  }

  const leaderboard = await prisma.forgeTrialEntry.findMany({
    where: { trialId: trial.id },
    orderBy: [{ score: "desc" }, { submittedAt: "asc" }],
    take: 10,
    select: {
      score: true,
      submittedAt: true,
      child: { select: { username: true } },
    },
  });

  const lastWeekStart = new Date(currentWeekStart.getTime() - ONE_WEEK_MS);
  const lastTrial = await prisma.forgeTrial.findUnique({
    where: { weekStart_phase: { weekStart: lastWeekStart, phase: 2 } },
    select: { id: true },
  });

  const lastPodium = lastTrial
    ? await prisma.forgeTrialEntry.findMany({
        where: { trialId: lastTrial.id },
        orderBy: [{ score: "desc" }, { submittedAt: "asc" }],
        take: 3,
        select: {
          score: true,
          submittedAt: true,
          child: { select: { username: true } },
        },
      })
    : [];

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-8">
        <ForgeTrialClient
          trial={{
            id: trial.id,
            title: trial.title,
            description: trial.description,
            challenge: trial.challenge as {
              objective?: string;
              hint?: string;
              successCondition?: string;
            },
            weekStart: trial.weekStart.toISOString(),
          }}
          leaderboard={leaderboard.map((entry) => ({
            username: entry.child.username,
            score: entry.score,
            submittedAt: entry.submittedAt.toISOString(),
          }))}
          previousPodium={lastPodium.map((entry) => ({
            username: entry.child.username,
            score: entry.score,
            submittedAt: entry.submittedAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
