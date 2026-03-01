import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { XPBar } from "@/components/molecules/XPBar";
import { KingdomCard } from "@/components/molecules/KingdomCard";
import { StreakIndicator } from "@/components/molecules/StreakIndicator";

const kingdomFallback: Record<
  number,
  { kingdom: string; mentor: string; avatar: { variant: string; label: string } }
> = {
  1: { kingdom: "Pixel Pioneers", mentor: "Byte", avatar: { variant: "atlas", label: "BT" } },
  2: { kingdom: "Logic Labyrinth", mentor: "Nova", avatar: { variant: "nova", label: "NV" } },
  3: { kingdom: "Web Wilderness", mentor: "Forge", avatar: { variant: "ember", label: "FG" } },
  4: { kingdom: "Code Citadel", mentor: "Zenith", avatar: { variant: "zen", label: "ZN" } },
};

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <polygon points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,16.8 5.5,21 7.5,13.5 2,9 9,9" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)" />
    </svg>
  );
}

function IconFire() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 2c-2 3-4 5-4 9a4 4 0 0 0 8 0c0-4-2-6-4-9z" />
      <path d="M9 14c0 2 1.5 4 3 4s3-2 3-4c0-1.5-1-2.5-3-4-2 1.5-3 2.5-3 4z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z" />
    </svg>
  );
}

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
      xpLevel: true,
      gems: true,
      streakCurrent: true,
      streakLongest: true,
    },
  });

  if (!child) {
    redirect("/parent/dashboard");
  }

  const phase = await prisma.phase.findUnique({
    where: { number: child.currentPhase },
    select: { kingdom: true, mentor: true },
  });

  const recentAchievements = await prisma.childAchievement.findMany({
    where: { childId: session.activeChildId },
    orderBy: { earnedAt: "desc" },
    take: 3,
    include: { achievement: true },
  });

  const [placement, achievementCount, skillCardCount, lessonCount] = await prisma.$transaction([
    prisma.placementResult.findFirst({
      where: { childId: session.activeChildId },
      select: { id: true },
    }),
    prisma.achievement.count(),
    prisma.skillCard.count(),
    prisma.lesson.count({
      where: { module: { phase: { number: child.currentPhase } } },
    }),
  ]);

  const nextLesson = await prisma.lesson.findFirst({
    where: {
      module: { phase: { number: child.currentPhase } },
      NOT: {
        progress: {
          some: {
            childId: session.activeChildId,
            status: { in: ["COMPLETED", "MASTERED"] },
          },
        },
      },
    },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    select: { id: true },
  });

  const hasPlacement = Boolean(placement);
  const contentSeeded = achievementCount > 0 && skillCardCount > 0;
  const hasLessons = lessonCount > 0;
  const continueHref = nextLesson ? `/learn/${nextLesson.id}` : "/quest/1";

  const fallback = kingdomFallback[child.currentPhase] ?? kingdomFallback[1];
  const kingdomName = phase?.kingdom ?? fallback.kingdom;
  const mentorName = phase?.mentor ?? fallback.mentor;

  return (
    <main className="min-h-screen px-6 py-12 text-cq-text-primary">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Child</p>
          <h1 className="text-3xl font-heading text-white">{child.displayName}&apos;s dashboard</h1>
          <p className="text-sm text-cq-text-secondary">
            Phase {child.currentPhase} - {child.currentModule ?? "Module pending"}
          </p>
        </header>

        <XPBar xpTotal={child.xpTotal} />

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">XP Total</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-heading text-cq-gold">
              <IconStar /> {child.xpTotal}
            </p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Gems</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-heading text-cq-cyan">
              <IconDiamond /> {child.gems}
            </p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Streak</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-heading text-cq-gold">
              <IconFire /> {child.streakCurrent} days
            </p>
          </div>
          <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Level</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-heading text-cq-primary">
              <IconShield /> {child.xpLevel}
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <KingdomCard
            phase={child.currentPhase}
            kingdom={kingdomName}
            moduleName={child.currentModule}
            mentor={{ name: mentorName, avatar: fallback.avatar }}
          />
          <div className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Streak</p>
            <div className="mt-4">
              <StreakIndicator current={child.streakCurrent} longest={child.streakLongest} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                Achievements
              </p>
              <h2 className="mt-2 text-lg font-heading text-white">Recent unlocks</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {recentAchievements.length === 0 ? (
              <p className="text-sm text-cq-text-secondary">
                No achievements yet - complete your first lesson!
              </p>
            ) : (
              recentAchievements.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-cq-border bg-cq-bg px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                    {entry.achievement.rarity}
                  </p>
                  <p className="mt-1 text-sm text-white">{entry.achievement.title}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Next quest</h2>
          <p className="mt-2 text-sm text-cq-text-secondary">
            Your mentor is preparing the next quest. We&apos;ll sync your rewards and unlock the
            portal.
          </p>
          <div className="mt-4">
            {!hasPlacement ? (
              <Link
                href="/placement"
                className="inline-flex items-center justify-center rounded-full border border-cq-border px-6 py-2 text-sm text-white"
              >
                Start placement adventure &rarr;
              </Link>
            ) : contentSeeded && hasLessons ? (
              <Link
                href={continueHref}
                className="inline-flex items-center justify-center rounded-full border border-cq-border px-6 py-2 text-sm text-white"
              >
                Continue Quest &rarr;
              </Link>
            ) : (
              <p className="text-sm text-cq-text-secondary">
                {kingdomName} opens soon - you&apos;re on the waitlist.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
