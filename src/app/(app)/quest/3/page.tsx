import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/subscription-gate";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";

const statusDot: Record<LessonProgressStatus, string> = {
  NOT_STARTED: "bg-cq-text-disabled",
  IN_PROGRESS: "bg-cq-gold",
  COMPLETED: "bg-cq-green",
  MASTERED: "bg-cq-violet",
};

type ModuleSummary = {
  id: string;
  title: string;
  description: string;
  order: number;
  weeks: number;
  skills: string[];
  lessons: {
    id: string;
    title: string;
    type: string;
    xpReward: number;
    estimatedMin: number;
  }[];
};

function LockedModuleCard({ module }: { module: ModuleSummary }) {
  return (
    <section
      className="rounded-3xl border border-cq-border bg-cq-bg-elevated/60 p-6 shadow-panel"
      aria-label={`${module.title} locked`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            Module {module.order}
          </p>
          <h2 className="mt-2 text-2xl font-heading text-white">{module.title}</h2>
          <p className="mt-2 text-sm text-cq-text-secondary">{module.description}</p>
          <p className="mt-3 text-xs text-cq-text-secondary">
            {module.lessons.length} lessons - {module.weeks} weeks
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-cq-border bg-cq-bg px-4 py-2 text-xs text-cq-text-secondary">
          <span className="text-base text-cq-orange">LOCK</span>
          <span>Champion plan required</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {module.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-cq-border-bright bg-cq-bg-overlay px-3 py-1 text-xs text-cq-text-secondary"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-cq-border bg-cq-bg-panel/60 p-6 text-sm text-cq-text-secondary">
        <p className="text-sm text-white">The Forge is where real web builders are made.</p>
        <p className="mt-2 text-sm text-cq-text-secondary">
          Upgrade to Champion to unlock Forge, real websites, and the Showcase.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/pricing?locked=true"
            className="inline-flex items-center justify-center rounded-full border border-cq-orange/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cq-orange"
          >
            Upgrade to Champion
          </Link>
          <Link
            href="/quest/2"
            className="inline-flex items-center justify-center rounded-full border border-cq-border px-5 py-2 text-xs uppercase tracking-[0.3em] text-cq-text-secondary"
          >
            Return to Builder&apos;s Guild
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function QuestPage() {
  const session = await getServerSession(authOptions);
  const subscription = session?.user?.id
    ? await prisma.subscription.findUnique({ where: { userId: session.user.id } })
    : null;
  const phase = await prisma.phase.findUnique({
    where: { number: 3 },
    select: {
      number: true,
      title: true,
      kingdom: true,
      mentor: true,
      colorHex: true,
      modules: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          weeks: true,
          skills: true,
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true, type: true, xpReward: true, estimatedMin: true },
          },
        },
      },
    },
  });

  if (!phase) {
    return (
      <main className="min-h-screen px-6 py-12 text-cq-text-primary">
        <p>Phase not found.</p>
      </main>
    );
  }

  let progressMap = new Map<string, LessonProgressStatus>();
  if (session?.activeChildId) {
    const lessonIds = phase.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
    const progress = await prisma.progress.findMany({
      where: { childId: session.activeChildId, lessonId: { in: lessonIds } },
      select: { lessonId: true, status: true },
    });
    progressMap = new Map(
      progress.map((entry) => [entry.lessonId, entry.status as LessonProgressStatus]),
    );
  }

  const lessonCount = phase.modules.reduce((count, module) => count + module.lessons.length, 0);
  const completedCount = Array.from(progressMap.values()).filter(
    (status) => status === "COMPLETED" || status === "MASTERED",
  ).length;

  const moduleSections = phase.modules.map((module) => {
    const unlocked = canAccessLesson(subscription, module.order, phase.number);
    if (!unlocked) {
      return <LockedModuleCard key={module.id} module={module} />;
    }

    return (
      <section
        key={module.id}
        className="rounded-3xl border border-cq-orange/50 bg-gradient-to-br from-cq-bg-elevated to-cq-bg-panel p-6 shadow-panel"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
              Module {module.order}
            </p>
            <h2 className="mt-2 text-2xl font-heading text-white">{module.title}</h2>
            <p className="mt-2 text-sm text-cq-text-secondary">{module.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {module.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cq-border-bright bg-cq-bg-overlay px-3 py-1 text-xs text-cq-text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {module.lessons.map((lesson) => {
            const status = progressMap.get(lesson.id) ?? "NOT_STARTED";
            return (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.id}`}
                className="group rounded-2xl border border-cq-border bg-cq-bg-panel p-4 transition hover:border-cq-orange/60 hover:shadow-glow-gold"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                  <span>{lesson.type}</span>
                  <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
                </div>
                <h3 className="mt-3 text-lg font-heading text-white">{lesson.title}</h3>
                <div className="mt-4 flex items-center justify-between text-xs text-cq-text-secondary">
                  <span>{lesson.xpReward} XP</span>
                  <span>{lesson.estimatedMin} min</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    );
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,153,74,0.25)_0,_transparent_55%)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,153,74,0.14)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-30" />

      <div className="relative mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">
              {phase.kingdom} Kingdom
            </p>
            <h1 className="mt-2 text-3xl font-heading text-white">
              {phase.title} - Phase {phase.number}
            </h1>
            <p className="mt-2 text-sm text-cq-text-secondary">
              {completedCount} of {lessonCount} lessons complete
            </p>
            <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-cq-bg-elevated">
              <div
                className="h-full rounded-full bg-cq-orange"
                style={{ width: `${lessonCount ? (completedCount / lessonCount) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cq-orange/40 bg-cq-bg-panel text-sm font-display text-cq-orange shadow-glow-gold">
              FG
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Mentor</p>
              <p className="text-sm text-white">{phase.mentor}</p>
            </div>
          </div>
        </header>

        <div className="space-y-6">{moduleSections}</div>
      </div>
    </main>
  );
}
