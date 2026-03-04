"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { checkWebSuccess } from "@/lib/lesson-success";

type LessonContent = {
  successCondition?: string;
};

type Props = {
  lessonId: string;
  lessonType?: string;
  lessonXp: number;
  content: LessonContent;
  html: string;
  css: string;
  js: string;
  runSignal: number;
  onLessonComplete: () => void;
  onRuntimeError?: (message: string) => void;
  onNextLesson?: () => void;
  onPublish?: () => void;
  publishEnabled?: boolean;
};

type ConsoleEntry = {
  id: string;
  message: string;
};

function buildSrcDoc(html: string, css: string, js: string) {
  const safeJs = js.replace(/<\/script>/gi, "<\\/script>");
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      const send = (payload) => parent.postMessage({ ...payload }, "*");
      const log = (...args) => send({ type: "console", message: args.join(" ") });
      console.log = log;
      window.onerror = (message) => {
        send({ type: "error", message: String(message || "JavaScript error.") });
      };
      window.addEventListener("unhandledrejection", (event) => {
        send({
          type: "error",
          message: event?.reason?.message || "JavaScript error.",
        });
      });
      try {
        ${safeJs}
      } catch (err) {
        send({ type: "error", message: err && err.message ? err.message : "JavaScript error." });
      }
    </script>
  </body>
</html>`;
}

export function WebPreviewPanel({
  lessonId,
  lessonType,
  lessonXp,
  content,
  html,
  css,
  js,
  runSignal,
  onLessonComplete,
  onRuntimeError,
  onNextLesson,
  onPublish,
  publishEnabled,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [srcDoc, setSrcDoc] = useState("");
  const runIdRef = useRef(0);

  const successCondition = content?.successCondition ?? "";
  const isProject = lessonType === "PROJECT";

  const assembledDoc = useMemo(() => buildSrcDoc(html, css, js), [css, html, js]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data !== "object" || !event.data) return;
      if (event.data.type === "console") {
        setConsoleLogs((prev) =>
          [
            ...prev,
            { id: `${Date.now()}-${Math.random()}`, message: String(event.data.message) },
          ].slice(-20),
        );
      }
      if (event.data.type === "error") {
        setBanner({ type: "error", message: event.data.message ?? "JavaScript error." });
        onRuntimeError?.(event.data.message ?? "JavaScript error.");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onRuntimeError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSrcDoc(assembledDoc);
    }, 500);
    return () => clearTimeout(timer);
  }, [assembledDoc]);

  useEffect(() => {
    if (runSignal === 0) return;
    setBanner(null);
    setConsoleLogs([]);
    runIdRef.current += 1;
    const runId = runIdRef.current;

    const success = checkWebSuccess(html, css, js, successCondition);
    if (success && runId === runIdRef.current) {
      setBanner({ type: "success", message: `Quest Complete! +${lessonXp} XP` });
      onLessonComplete();
    }

    setSrcDoc(assembledDoc);
  }, [assembledDoc, css, html, js, lessonXp, onLessonComplete, runSignal, successCondition]);

  const bannerClasses = useMemo(() => {
    if (!banner) return "";
    return banner.type === "success"
      ? "border-cq-green/60 bg-cq-bg-elevated text-cq-green"
      : "border-cq-red/60 bg-cq-bg-elevated text-cq-red";
  }, [banner]);

  return (
    <aside className="flex h-full w-[380px] flex-col border-l border-cq-border bg-cq-bg-elevated">
      <div className="flex items-center justify-between border-b border-cq-border px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Preview</p>
        {isProject ? (
          <button
            type="button"
            className="rounded-full border border-cq-border px-3 py-1 text-xs text-cq-text-secondary hover:text-white"
            onClick={onPublish}
            disabled={!publishEnabled}
          >
            Publish
          </button>
        ) : null}
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
            {banner.type === "success" && isProject ? (
              <span className="rounded-full border border-cq-orange/60 px-3 py-1 text-xs text-cq-orange">
                Project Complete
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex-1 p-5">
        <iframe
          ref={iframeRef}
          title="Web preview"
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
