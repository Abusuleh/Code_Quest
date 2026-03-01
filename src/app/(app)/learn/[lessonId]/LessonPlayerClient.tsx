"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LessonSidebar } from "@/components/organisms/LessonSidebar";
import { BlocklyEditor, type BlocklyEditorHandle } from "@/components/organisms/BlocklyEditor";
import { PreviewPanel } from "@/components/organisms/PreviewPanel";
import { AchievementToast } from "@/components/molecules/AchievementToast";
import { XPAwardOverlay } from "@/components/organisms/XPAwardOverlay";
import { LevelUpCeremony } from "@/components/organisms/LevelUpCeremony";
import { getRankTitle } from "@/lib/xp-constants";

type LessonContent = {
  objective?: string;
  hint?: string;
  successCondition?: string;
  starterXml?: string;
};

type LessonPayload = {
  id: string;
  title: string;
  type: string;
  content: LessonContent;
  xpReward: number;
  gemReward: number;
  estimatedMin: number;
  order: number;
  starterCode: { xml?: string } | null;
  module: {
    title: string;
    order: number;
    phase: {
      number: number;
      title: string;
      kingdom: string;
      colorHex: string;
    };
  };
};

type ProgressDot = {
  id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";
};

type AchievementItem = {
  id: string;
  title: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  xpReward: number;
  gemReward: number;
};

const celebrationMessages: Record<string, string> = {
  "lesson-1-1-1":
    "YES! You did it! You just made your FIRST ever program! Byte is dancing! 🎉 How does it feel to be a programmer?",
  "lesson-1-1-2":
    "WOAH! Look at Byte go! You used a LOOP — that is the secret power move of all programmers! What else could you make move?",
  "lesson-1-1-3":
    "You made Byte draw! With CODE! That is basically magic! Can you imagine drawing a whole picture this way?",
  "lesson-1-1-4":
    "So many colours! Your kingdom is glowing! Did you know you just used the same idea that games use to make their worlds look amazing?",
  "lesson-1-1-5":
    "A PERFECT SQUARE! Four sides, four turns, one loop — you spotted the pattern! Patterns are EVERYWHERE in coding. What shape next?",
  "lesson-1-1-6":
    "A STAR! You cracked the secret angle! That took real thinking — Byte is SO proud! What would you draw if you could draw anything?",
  "lesson-1-1-7":
    "You made an INTERACTIVE program! Now the computer listens to YOU! That is the moment coding goes from magic to POWER! What should it do next?",
  "lesson-1-1-8":
    "Byte can say your name! That is personalisation — making programs feel like they know you. Every app on your phone does this! How cool is that?",
  "lesson-1-1-9":
    "YOUR Pixel Garden! Made by you! Nobody else in the world has made exactly this program. You are officially a Pixel Pioneer! What will you build next?",
};

export function LessonPlayerClient({
  lesson,
  gems,
  progressDots,
  nextLessonId,
}: {
  lesson: LessonPayload;
  gems: number;
  progressDots: ProgressDot[];
  nextLessonId: string | null;
}) {
  const router = useRouter();
  const editorRef = useRef<BlocklyEditorHandle | null>(null);
  const [workspaceXml, setWorkspaceXml] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [runSignal, setRunSignal] = useState(0);
  const [byteMessage, setByteMessage] = useState(lesson.content.hint ?? "");
  const [byteLoading, setByteLoading] = useState(false);
  const [gemCount, setGemCount] = useState(gems);
  const [awardQueue, setAwardQueue] = useState<
    { id: string; amount: number; x?: number; y?: number }[]
  >([]);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [levelUpTitle, setLevelUpTitle] = useState("");
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [achievementQueue, setAchievementQueue] = useState<AchievementItem[]>([]);
  const [shareEnabled, setShareEnabled] = useState(false);
  const [hintAttempts, setHintAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    setByteMessage(lesson.content.hint ?? "");
    setHintAttempts(0);
    setShareEnabled(false);
  }, [lesson.content.hint, lesson.id]);

  const handleRun = useCallback(() => {
    if (!editorRef.current) return;
    const xml = editorRef.current.getWorkspaceXml();
    const code = editorRef.current.getGeneratedCode();
    setWorkspaceXml(xml);
    setGeneratedCode(code);
    setRunSignal(Date.now());
    setSyncMessage(null);

    fetch("/api/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId: lesson.id, code: xml }),
    }).catch(() => null);
  }, [lesson.id]);

  const handleLessonComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const latestXml = editorRef.current?.getWorkspaceXml() ?? workspaceXml;

    const awardId = `${Date.now()}-${Math.random()}`;
    setAwardQueue((prev) => [
      ...prev,
      {
        id: awardId,
        amount: lesson.xpReward,
        x: Math.random() * 200 - 100,
        y: Math.random() * 100 - 50,
      },
    ]);
    setTimeout(() => {
      setAwardQueue((prev) => prev.filter((award) => award.id !== awardId));
    }, 1500);

    setShareEnabled(true);
    setByteMessage(celebrationMessages[lesson.id] ?? "Great work, coder!");

    const syncCompletion = async (attempt = 1) => {
      try {
        const res = await fetch("/api/progress/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId: lesson.id, code: latestXml }),
        });
        if (!res.ok) throw new Error("SYNC_FAILED");
        const data = (await res.json()) as {
          alreadyComplete?: boolean;
          xpAwarded?: number;
          xpTotal?: number;
          leveledUp?: boolean;
          newLevel?: number;
          streakBonus?: number;
          newAchievements?: AchievementItem[];
          gems?: number;
        };

        if (data.alreadyComplete) return;

        if (data.leveledUp && data.newLevel) {
          setLevelUpTitle(getRankTitle(data.newLevel));
          setLevelUpLevel(data.newLevel);
          setLevelUpOpen(true);
        }

        if (data.newAchievements && data.newAchievements.length > 0) {
          setAchievementQueue(data.newAchievements);
        }

        const gemsAwarded = typeof data.gems === "number" ? data.gems : null;
        if (gemsAwarded !== null) {
          setGemCount((prev) => prev + gemsAwarded);
        }
      } catch {
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          await syncCompletion(2);
          return;
        }
        setSyncMessage("XP will sync when you reconnect.");
      }
    };

    void syncCompletion();
  }, [lesson.id, lesson.xpReward, workspaceXml]);

  const handleAskByte = useCallback(async () => {
    if (gemCount < 10 || byteLoading) return;
    setByteLoading(true);
    setHintAttempts((prev) => prev + 1);
    setByteMessage("");
    setSyncMessage(null);

    try {
      const res = await fetch("/api/mentor/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          childCode: workspaceXml,
          errorMessage: lastError,
          attemptNumber: hintAttempts + 1,
        }),
      });

      if (res.status === 402) {
        setByteMessage("Earn more gems to ask Byte!");
        setByteLoading(false);
        return;
      }

      if (!res.body) {
        setByteMessage("Byte is thinking... try again?");
        setByteLoading(false);
        return;
      }

      setGemCount((prev) => Math.max(0, prev - 10));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
        const result = await reader.read();
        done = result.done;
        if (result.value) {
          const chunk = decoder.decode(result.value);
          setByteMessage((prev) => prev + chunk);
        }
      }
    } catch {
      setByteMessage("Byte will be back soon. Try again!");
    } finally {
      setByteLoading(false);
    }
  }, [byteLoading, gemCount, hintAttempts, lastError, lesson.id, workspaceXml]);

  const handleNextLesson = useCallback(() => {
    if (nextLessonId) {
      router.push(`/learn/${nextLessonId}`);
      return;
    }
    router.push("/quest/1");
  }, [nextLessonId, router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRun]);

  const progressWithCurrent = useMemo(() => progressDots, [progressDots]);

  return (
    <div className="relative h-screen overflow-hidden">
      <XPAwardOverlay awards={awardQueue} />
      <AchievementToast queue={achievementQueue} />
      <LevelUpCeremony
        open={levelUpOpen}
        level={levelUpLevel}
        rankTitle={levelUpTitle}
        onClose={() => setLevelUpOpen(false)}
      />

      <div className="flex h-full flex-col lg:flex-row">
        <div className="hidden lg:block">
          <LessonSidebar
            phaseTitle={lesson.module.phase.title}
            lessonOrder={lesson.order}
            totalLessons={progressDots.length}
            lessonTitle={lesson.title}
            objective={lesson.content.objective ?? ""}
            currentLessonId={lesson.id}
            progressDots={progressWithCurrent}
            byteMessage={byteMessage}
            byteLoading={byteLoading}
            gems={gemCount}
            onAskByte={handleAskByte}
            onRun={handleRun}
          />
        </div>

        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="flex flex-1 flex-col border-b border-cq-border lg:border-b-0">
            <div className="flex items-center justify-between border-b border-cq-border px-4 py-3 lg:hidden">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                  Lesson {lesson.order} of {progressDots.length}
                </p>
                <p className="text-sm font-heading text-white">{lesson.title}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-cq-border px-3 py-1 text-xs text-cq-text-secondary"
                onClick={() => {
                  const event = new CustomEvent("cq:open-sidebar");
                  window.dispatchEvent(event);
                }}
              >
                Lesson
              </button>
            </div>
            <div className="flex-1">
              <BlocklyEditor
                ref={editorRef}
                lessonId={lesson.id}
                starterCode={lesson.starterCode}
                onXmlChange={setWorkspaceXml}
              />
            </div>
            {syncMessage ? (
              <p className="border-t border-cq-border px-4 py-2 text-xs text-cq-text-secondary">
                {syncMessage}
              </p>
            ) : null}
          </div>

          <PreviewPanel
            lessonId={lesson.id}
            lessonXp={lesson.xpReward}
            content={lesson.content}
            workspaceXml={workspaceXml}
            generatedCode={generatedCode}
            runSignal={runSignal}
            onLessonComplete={handleLessonComplete}
            onRuntimeError={setLastError}
            onNextLesson={nextLessonId ? handleNextLesson : undefined}
            shareEnabled={shareEnabled}
          />
        </div>
      </div>

      <MobileSidebar
        lesson={lesson}
        progressDots={progressDots}
        byteMessage={byteMessage}
        byteLoading={byteLoading}
        gemCount={gemCount}
        onAskByte={handleAskByte}
        onRun={handleRun}
      />
    </div>
  );
}

function MobileSidebar({
  lesson,
  progressDots,
  byteMessage,
  byteLoading,
  gemCount,
  onAskByte,
  onRun,
}: {
  lesson: LessonPayload;
  progressDots: ProgressDot[];
  byteMessage: string;
  byteLoading: boolean;
  gemCount: number;
  onAskByte: () => void;
  onRun: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("cq:open-sidebar", handler);
    return () => window.removeEventListener("cq:open-sidebar", handler);
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/50 transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-[90] h-full w-[280px] bg-cq-bg-elevated transition lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-cq-border px-4 py-4">
          <span className="font-heading text-white">Lesson</span>
          <button
            type="button"
            className="text-sm text-cq-text-secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
        <LessonSidebar
          phaseTitle={lesson.module.phase.title}
          lessonOrder={lesson.order}
          totalLessons={progressDots.length}
          lessonTitle={lesson.title}
          objective={lesson.content.objective ?? ""}
          currentLessonId={lesson.id}
          progressDots={progressDots}
          byteMessage={byteMessage}
          byteLoading={byteLoading}
          gems={gemCount}
          onAskByte={onAskByte}
          onRun={onRun}
        />
      </aside>
    </>
  );
}
