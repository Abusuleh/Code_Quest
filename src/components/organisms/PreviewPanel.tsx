"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { checkSuccessCondition } from "@/lib/lesson-success";

type LessonContent = {
  successCondition?: string;
};

type Props = {
  lessonId: string;
  lessonXp: number;
  content: LessonContent;
  workspaceXml: string;
  generatedCode: string;
  runSignal: number;
  onLessonComplete: () => void;
  onRuntimeError?: (message: string) => void;
  onNextLesson?: () => void;
  shareEnabled: boolean;
};

type ConsoleEntry = {
  id: string;
  message: string;
};

export function PreviewPanel({
  lessonId,
  lessonXp,
  content,
  workspaceXml,
  generatedCode,
  runSignal,
  onLessonComplete,
  onRuntimeError,
  onNextLesson,
  shareEnabled,
}: Props) {
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [srcDoc, setSrcDoc] = useState("");
  const runIdRef = useRef(0);

  const successCondition = content?.successCondition ?? "";

  const resetConsole = () => setConsoleLogs([]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.lessonId !== lessonId) return;
      if (event.data?.type === "console") {
        setConsoleLogs((prev) =>
          [...prev, { id: `${Date.now()}-${Math.random()}`, message: event.data.message }].slice(
            -10,
          ),
        );
      }
      if (event.data?.type === "error") {
        setBanner({ type: "error", message: event.data.message });
        onRuntimeError?.(event.data.message);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [lessonId, onRuntimeError]);

  useEffect(() => {
    if (runSignal === 0) return;
    resetConsole();
    setBanner(null);
    runIdRef.current += 1;
    const runId = runIdRef.current;

    const success = checkSuccessCondition(workspaceXml, successCondition);
    const successBanner = `Quest Complete! +${lessonXp} XP`;

    const wrapped = `
      <!doctype html>
      <html>
        <head>
          <style>
            body { margin: 0; background: #ffffff; font-family: sans-serif; }
            #stage { display: block; margin: 12px auto; border: 2px solid #111827; background: #ffffff; }
            #speech { text-align: center; font-weight: 600; color: #111827; }
          </style>
        </head>
        <body>
          <canvas id="stage" width="400" height="300"></canvas>
          <div id="speech"></div>
          <script>
            const send = (type, message) => parent.postMessage({ type, message, lessonId: "${lessonId}" }, "*");
            const logs = [];
            console.log = (...args) => {
              const msg = args.map(String).join(" ");
              logs.push(msg);
              send("console", msg);
            };
            window.onerror = (message) => {
              send("error", message);
            };

            const canvas = document.getElementById("stage");
            const ctx = canvas.getContext("2d");
            const state = { x: 200, y: 150, angle: 0, penDown: false, color: "#00D4FF" };
            let lastAnswer = "";

            function move(steps) {
              const radians = (Math.PI / 180) * state.angle;
              const newX = state.x + Math.cos(radians) * steps;
              const newY = state.y + Math.sin(radians) * steps;
              if (state.penDown) {
                ctx.strokeStyle = state.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(state.x, state.y);
                ctx.lineTo(newX, newY);
                ctx.stroke();
              }
              state.x = newX;
              state.y = newY;
            }

            function turnRight(deg) {
              state.angle = (state.angle + Number(deg)) % 360;
            }

            function penDown() {
              state.penDown = true;
            }

            function setPenColor(color) {
              state.color = color;
            }

            function say(text) {
              const el = document.getElementById("speech");
              if (el) el.textContent = String(text ?? "");
            }

            function ask(question) {
              lastAnswer = prompt(String(question ?? "")) || "";
              return lastAnswer;
            }

            function getAnswer() {
              return lastAnswer;
            }

            try {
              ${generatedCode || ""}
            } catch (err) {
              send("error", err?.message || "Something went wrong.");
            }
          </script>
        </body>
      </html>
    `;

    setSrcDoc(wrapped);

    if (success && runId === runIdRef.current) {
      setBanner({ type: "success", message: successBanner });
      onLessonComplete();
    }
  }, [
    runSignal,
    lessonId,
    lessonXp,
    generatedCode,
    onLessonComplete,
    successCondition,
    workspaceXml,
  ]);

  const bannerClasses = useMemo(() => {
    if (!banner) return "";
    return banner.type === "success"
      ? "border-cq-green/60 bg-cq-bg-elevated text-cq-green"
      : "border-cq-red/60 bg-cq-bg-elevated text-cq-red";
  }, [banner]);

  return (
    <aside className="flex h-full w-[380px] flex-col border-l border-cq-border bg-cq-bg-elevated">
      <div className="flex items-center justify-between border-b border-cq-border px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Output</p>
        <button
          type="button"
          className="rounded-full border border-cq-border px-3 py-1 text-xs text-cq-text-secondary disabled:opacity-50"
          disabled={!shareEnabled}
        >
          Share
        </button>
      </div>

      {banner ? (
        <div className={`mx-5 mt-4 rounded-2xl border px-4 py-3 text-sm ${bannerClasses}`}>
          <div className="flex items-center justify-between gap-4">
            <span>{banner.message}</span>
            {banner.type === "success" && onNextLesson ? (
              <button
                type="button"
                className="rounded-full border border-cq-green/50 px-3 py-1 text-xs text-cq-green"
                onClick={onNextLesson}
              >
                Next Lesson
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex-1 p-5">
        <iframe
          title="Lesson output"
          className="h-full w-full rounded-2xl border border-cq-border bg-white"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
        />
      </div>

      <div className="border-t border-cq-border px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Console</p>
        <div className="mt-3 max-h-32 space-y-1 overflow-hidden font-code text-xs text-cq-text-secondary">
          {consoleLogs.length === 0 ? (
            <p>No output yet.</p>
          ) : (
            consoleLogs.map((entry) => <p key={entry.id}>{entry.message}</p>)
          )}
        </div>
      </div>
    </aside>
  );
}
