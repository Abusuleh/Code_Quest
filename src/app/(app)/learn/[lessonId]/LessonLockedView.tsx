import Link from "next/link";

type Props = {
  lessonTitle: string;
  moduleTitle: string;
  objective: string;
  lessonId: string;
  phaseNumber?: number;
  mentorName?: string;
};

export function LessonLockedView({
  lessonTitle,
  moduleTitle,
  objective,
  lessonId,
  phaseNumber = 1,
  mentorName = "Byte",
}: Props) {
  const isPhase2 = phaseNumber >= 2;

  return (
    <div className="flex h-screen items-center justify-center bg-cq-bg px-6 text-cq-text-primary">
      <div className="w-full max-w-2xl rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 text-center shadow-panel">
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Locked Lesson</p>
        <h1 className="mt-3 text-3xl font-heading text-white">{lessonTitle}</h1>
        <p className="mt-2 text-sm text-cq-text-secondary">Module: {moduleTitle}</p>

        <div
          className={`mt-6 rounded-2xl border bg-cq-bg-panel p-5 text-left ${
            isPhase2 ? "border-cq-violet/40" : "border-cq-cyan/40"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            What you will learn
          </p>
          <p className="mt-2 text-sm text-white">
            {objective || `${mentorName} has a brilliant new quest waiting for you!`}
          </p>
          <p className="mt-3 text-sm text-cq-text-secondary">
            {isPhase2
              ? "The Builder's Guild requires Champion access."
              : "You've mastered Module 1 - the adventure continues with Spark."}
          </p>
          <p className="mt-3 text-sm text-cq-text-secondary">
            {mentorName} says: &quot;I can&apos;t wait to teach you this one!&quot;
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/pricing?locked=true&lesson=${encodeURIComponent(lessonId)}`}
            className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold ${
              isPhase2
                ? "bg-cq-violet text-white shadow-glow-primary"
                : "bg-cq-cyan text-black shadow-glow-cyan"
            }`}
          >
            Unlock this lesson
          </Link>
          <Link
            href="/quest/1"
            className="inline-flex items-center justify-center rounded-full border border-cq-border px-6 py-3 text-sm text-white"
          >
            Go back to Module 1
          </Link>
        </div>
      </div>
    </div>
  );
}
