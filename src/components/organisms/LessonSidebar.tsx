"use client";

import { Button } from "@/components/atoms/Button";

type ProgressDot = {
  id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";
};

type Props = {
  phaseTitle: string;
  lessonOrder: number;
  totalLessons: number;
  lessonTitle: string;
  objective: string;
  currentLessonId: string;
  progressDots: ProgressDot[];
  byteMessage: string;
  byteLoading: boolean;
  gems: number;
  onAskByte: () => void;
  onRun: () => void;
};

const statusStyles: Record<ProgressDot["status"], string> = {
  NOT_STARTED: "bg-cq-text-disabled",
  IN_PROGRESS: "bg-cq-gold",
  COMPLETED: "bg-cq-green",
  MASTERED: "bg-cq-violet",
};

export function LessonSidebar({
  phaseTitle,
  lessonOrder,
  totalLessons,
  lessonTitle,
  objective,
  currentLessonId,
  progressDots,
  byteMessage,
  byteLoading,
  gems,
  onAskByte,
  onRun,
}: Props) {
  const insufficientGems = gems < 10;

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-cq-border bg-cq-bg-elevated px-6 py-6">
      <div className="space-y-4">
        <span className="inline-flex rounded-full border border-cq-cyan/50 bg-cq-bg-overlay px-3 py-1 text-xs uppercase tracking-[0.3em] text-cq-cyan">
          {phaseTitle}
        </span>
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
          Lesson {lessonOrder} of {totalLessons}
        </p>
        <h1 className="text-2xl font-heading text-white">{lessonTitle}</h1>

        <div className="rounded-2xl border border-cq-border bg-cq-bg-panel p-4 border-l-4 border-l-cq-cyan">
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Objective</p>
          <p className="mt-2 text-sm text-white">{objective}</p>
        </div>

        <div className="relative rounded-2xl border border-cq-cyan/30 bg-cq-bg-overlay p-4">
          <div className="absolute -top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full border border-cq-cyan/40 bg-cq-bg-panel text-xs font-display text-cq-cyan">
            BT
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Byte says</p>
          <div className="mt-3 min-h-[72px] text-sm text-white">
            {byteLoading ? (
              <div className="flex items-center gap-2 text-cq-text-secondary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cq-cyan" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-cq-cyan/80" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-cq-cyan/60" />
              </div>
            ) : (
              byteMessage || "Byte is ready when you are!"
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Progress</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {progressDots.map((dot) => (
              <span
                key={dot.id}
                className={`h-3 w-3 rounded-full ${
                  dot.id === currentLessonId ? "ring-2 ring-cq-cyan" : ""
                } ${statusStyles[dot.status]}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <Button
          type="button"
          className="w-full justify-between"
          onClick={onAskByte}
          disabled={insufficientGems || byteLoading}
          title={insufficientGems ? "Earn more gems to ask Byte!" : undefined}
        >
          <span>Ask Byte</span>
          <span className="rounded-full bg-cq-bg-overlay px-2 py-1 text-xs text-cq-cyan">
            +10 Gems
          </span>
        </Button>
        <button
          type="button"
          className="w-full rounded-full bg-cq-cyan px-4 py-3 text-sm font-bold text-black shadow-glow-cyan transition hover:shadow-[0_0_24px_rgba(0,212,255,0.6)]"
          onClick={onRun}
        >
          Run Code
        </button>
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-cq-text-secondary">
          Cmd/Ctrl+Enter
        </p>
      </div>
    </aside>
  );
}
