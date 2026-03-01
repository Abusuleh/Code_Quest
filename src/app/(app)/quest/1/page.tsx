import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";

const statusDot: Record<LessonProgressStatus, string> = {
  NOT_STARTED: "bg-cq-text-disabled",
  IN_PROGRESS: "bg-cq-gold",
  COMPLETED: "bg-cq-green",
  MASTERED: "bg-cq-violet",
};

export default async function QuestPage() {
  const session = await getServerSession(authOptions);
  const phase = await prisma.phase.findUnique({
    where: { number: 1 },
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.2)_0,_transparent_50%)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(0,212,255,0.12)_1px,_transparent_1px)] bg-[length:22px_22px] opacity-30" />

      <div className="relative mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">
              {phase.kingdom} Kingdom
            </p>
            <h1 className="mt-2 text-3xl font-heading text-white">
              {phase.title} — Phase {phase.number}
            </h1>
            <p className="mt-2 text-sm text-cq-text-secondary">
              {completedCount} of {lessonCount} lessons complete
            </p>
            <div className="mt-4 h-2 w-full max-w-sm overflow-hidden rounded-full bg-cq-bg-elevated">
              <div
                className="h-full rounded-full bg-cq-cyan"
                style={{ width: `${lessonCount ? (completedCount / lessonCount) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cq-cyan/40 bg-cq-bg-panel text-sm font-display text-cq-cyan shadow-glow-cyan animate-bounce">
              BT
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Mentor</p>
              <p className="text-sm text-white">{phase.mentor}</p>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          {phase.modules.map((module) => {
            const unlocked = module.order === 1;
            return (
              <section
                key={module.id}
                className={`rounded-3xl border p-6 shadow-panel ${
                  unlocked
                    ? "border-cq-cyan/60 bg-gradient-to-br from-cq-bg-elevated to-cq-bg-panel"
                    : "border-cq-border bg-cq-bg-elevated/60"
                }`}
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

                {unlocked ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {module.lessons.map((lesson) => {
                      const status = progressMap.get(lesson.id) ?? "NOT_STARTED";
                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${lesson.id}`}
                          className="group rounded-2xl border border-cq-border bg-cq-bg-panel p-4 transition hover:border-cq-cyan/60 hover:shadow-glow-cyan"
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
                ) : (
                  <div className="mt-6 rounded-2xl border border-cq-border bg-cq-bg-panel/60 p-6 text-sm text-cq-text-secondary">
                    Unlocks after Module {module.order - 1}.
                  </div>
                )}
              </section>
            );
          })}

          {Array.from({ length: 4 }).map((_, index) => (
            <section
              key={`locked-${index + 2}`}
              className="rounded-3xl border border-cq-border bg-cq-bg-elevated/40 p-6 opacity-70"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                Module {index + 2}
              </p>
              <h2 className="mt-2 text-xl font-heading text-white">Locked Kingdom</h2>
              <p className="mt-2 text-sm text-cq-text-secondary">
                Unlocks after Module {index + 1}.
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
