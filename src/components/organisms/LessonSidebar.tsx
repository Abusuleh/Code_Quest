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
  mentorName: string;
  mentorInitials: string;
  mentorMessage: string;
  mentorLoading: boolean;
  gems: number;
  onAskMentor: () => void;
  onRun: () => void;
  accent?: "cyan" | "violet";
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
  mentorName,
  mentorInitials,
  mentorMessage,
  mentorLoading,
  gems,
  onAskMentor,
  onRun,
  accent = "cyan",
}: Props) {
  const insufficientGems = gems < 10;
  const accentStyles =
    accent === "violet"
      ? {
          badge: "border-cq-violet/50 bg-cq-bg-overlay text-cq-violet",
          objective: "border-l-cq-violet",
          bubble: "border-cq-violet/30",
          mentorAvatar: "border-cq-violet/40 text-cq-violet",
          askBadge: "text-cq-violet",
          runButton: "bg-cq-violet text-white shadow-glow-primary",
          runHover: "hover:shadow-glow-primary",
          dots: "bg-cq-violet",
          ring: "ring-cq-violet",
        }
      : {
          badge: "border-cq-cyan/50 bg-cq-bg-overlay text-cq-cyan",
          objective: "border-l-cq-cyan",
          bubble: "border-cq-cyan/30",
          mentorAvatar: "border-cq-cyan/40 text-cq-cyan",
          askBadge: "text-cq-cyan",
          runButton: "bg-cq-cyan text-black shadow-glow-cyan",
          runHover: "hover:shadow-[0_0_24px_rgba(0,212,255,0.6)]",
          dots: "bg-cq-cyan",
          ring: "ring-cq-cyan",
        };

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-cq-border bg-cq-bg-elevated px-6 py-6">
      <div className="space-y-4">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${accentStyles.badge}`}
        >
          {phaseTitle}
        </span>
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
          Lesson {lessonOrder} of {totalLessons}
        </p>
        <h1 className="text-2xl font-heading text-white">{lessonTitle}</h1>

        <div
          className={`rounded-2xl border border-cq-border bg-cq-bg-panel p-4 border-l-4 ${accentStyles.objective}`}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Objective</p>
          <p className="mt-2 text-sm text-white">{objective}</p>
        </div>

        <div className={`relative rounded-2xl border bg-cq-bg-overlay p-4 ${accentStyles.bubble}`}>
          <div
            className={`absolute -top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full border bg-cq-bg-panel text-xs font-display ${accentStyles.mentorAvatar}`}
          >
            {mentorInitials}
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            {mentorName} says
          </p>
          <div className="mt-3 min-h-[72px] text-sm text-white">
            {mentorLoading ? (
              <div className="flex items-center gap-2 text-cq-text-secondary">
                <span className={`h-2 w-2 animate-pulse rounded-full ${accentStyles.dots}`} />
                <span
                  className={`h-2 w-2 animate-pulse rounded-full ${accentStyles.dots} opacity-80`}
                />
                <span
                  className={`h-2 w-2 animate-pulse rounded-full ${accentStyles.dots} opacity-60`}
                />
              </div>
            ) : (
              mentorMessage || `${mentorName} is ready when you are!`
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
                  dot.id === currentLessonId ? `ring-2 ${accentStyles.ring}` : ""
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
          onClick={onAskMentor}
          disabled={insufficientGems || mentorLoading}
          title={insufficientGems ? `Earn more gems to ask ${mentorName}!` : undefined}
        >
          <span>Ask {mentorName}</span>
          <span
            className={`rounded-full bg-cq-bg-overlay px-2 py-1 text-xs ${accentStyles.askBadge}`}
          >
            +10 Gems
          </span>
        </Button>
        <button
          type="button"
          className={`w-full rounded-full px-4 py-3 text-sm font-bold transition ${accentStyles.runButton} ${accentStyles.runHover}`}
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
