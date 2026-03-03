"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { checkPythonSuccess } from "@/lib/lesson-success";

type LessonContent = {
  successCondition?: string;
};

type Props = {
  lessonId: string;
  lessonType?: string;
  lessonXp: number;
  content: LessonContent;
  pythonCode: string;
  runSignal: number;
  onLessonComplete: () => void;
  onRuntimeError?: (message: string) => void;
  onNextLesson?: () => void;
};

type ConsoleEntry = {
  id: string;
  message: string;
};

export function PythonPreviewPanel({
  lessonId,
  lessonType,
  lessonXp,
  content,
  pythonCode,
  runSignal,
  onLessonComplete,
  onRuntimeError,
  onNextLesson,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const runIdRef = useRef(0);
  const [banner, setBanner] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [inputPrompt, setInputPrompt] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputRequestId, setInputRequestId] = useState<string | null>(null);

  const successCondition = content?.successCondition ?? "";
  const isProject = lessonType === "PROJECT";

  const srcDoc = useMemo(
    () => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body { margin: 0; padding: 0; background: #111018; color: #ffffff; }
    </style>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>
    <script>
      const lessonId = "${lessonId}";
      const send = (payload) => parent.postMessage({ lessonId, ...payload }, "*");

      let pyodideReadyPromise = loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });

      const pendingInputs = new Map();

      function requestInput(promptText) {
        const requestId = \`\${Date.now()}-\${Math.random()}\`;
        send({ type: "input_request", prompt: promptText || "Enter a value", requestId });
        return new Promise((resolve) => {
          pendingInputs.set(requestId, resolve);
        });
      }

      window.cq_input = (promptText) => requestInput(promptText);

      window.addEventListener("message", async (event) => {
        if (!event.data || event.data.lessonId !== lessonId) return;
        if (event.data.type === "input_response") {
          const resolver = pendingInputs.get(event.data.requestId);
          if (resolver) {
            resolver(event.data.value ?? "");
            pendingInputs.delete(event.data.requestId);
          }
          return;
        }

        if (event.data.type !== "run") return;
        const code = event.data.code || "";
        send({ type: "console_clear" });
        try {
          const pyodide = await pyodideReadyPromise;
          await pyodide.runPythonAsync(\`
import sys, io, asyncio, builtins, js
_stdout = io.StringIO()
sys.stdout = _stdout
sys.stderr = _stdout

async def _cq_input(prompt=""):
    return await js.cq_input(prompt)

def input(prompt=""):
    return asyncio.get_event_loop().run_until_complete(_cq_input(prompt))

builtins.input = input
\`);

          await pyodide.runPythonAsync(code);
          const output = await pyodide.runPythonAsync("_stdout.getvalue()");
          if (output) {
            send({ type: "console", message: String(output) });
          }
        } catch (error) {
          send({ type: "error", message: error && error.message ? error.message : "Python error." });
        }
      });
    </script>
  </body>
</html>`,
    [lessonId],
  );

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.lessonId !== lessonId) return;
      if (event.data?.type === "console_clear") {
        setConsoleLogs([]);
      }
      if (event.data?.type === "console") {
        const lines = String(event.data.message ?? "")
          .split("\\n")
          .map((line) => line.trim())
          .filter(Boolean);
        setConsoleLogs((prev) =>
          [...prev, ...lines.map((line) => ({ id: `${Date.now()}-${Math.random()}`, message: line }))].slice(
            -20,
          ),
        );
      }
      if (event.data?.type === "error") {
        setBanner({ type: "error", message: event.data.message ?? "Python error." });
        onRuntimeError?.(event.data.message ?? "Python error.");
      }
      if (event.data?.type === "input_request") {
        setInputPrompt(event.data.prompt ?? "Enter a value");
        setInputRequestId(event.data.requestId ?? null);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [lessonId, onRuntimeError]);

  useEffect(() => {
    if (runSignal === 0) return;
    setBanner(null);
    runIdRef.current += 1;
    const runId = runIdRef.current;

    const success = checkPythonSuccess(pythonCode, successCondition);
    if (success && runId === runIdRef.current) {
      setBanner({ type: "success", message: `Quest Complete! +${lessonXp} XP` });
      onLessonComplete();
    }

    iframeRef.current?.contentWindow?.postMessage(
      { type: "run", code: pythonCode, lessonId },
      "*",
    );
  }, [lessonId, lessonXp, onLessonComplete, pythonCode, runSignal, successCondition]);

  const bannerClasses = useMemo(() => {
    if (!banner) return "";
    return banner.type === "success"
      ? "border-cq-green/60 bg-cq-bg-elevated text-cq-green"
      : "border-cq-red/60 bg-cq-bg-elevated text-cq-red";
  }, [banner]);

  const handleSubmitInput = () => {
    if (!inputRequestId) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "input_response", value: inputValue, requestId: inputRequestId, lessonId },
      "*",
    );
    setInputPrompt(null);
    setInputRequestId(null);
    setInputValue("");
  };

  return (
    <aside className="flex h-full w-[380px] flex-col border-l border-cq-border bg-cq-bg-elevated">
      <div className="flex items-center justify-between border-b border-cq-border px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Output</p>
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
              <span className="rounded-full border border-cq-violet/50 px-3 py-1 text-xs text-cq-violet">
                Project Complete
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex-1 p-5">
        <iframe
          ref={iframeRef}
          title="Python output"
          className="h-full w-full rounded-2xl border border-cq-border bg-cq-bg-panel"
          sandbox="allow-scripts"
          srcDoc={srcDoc}
        />
      </div>

      {inputPrompt ? (
        <div className="border-t border-cq-border px-5 py-4">
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Input</p>
          <p className="mt-2 text-sm text-white">{inputPrompt}</p>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1 rounded-full border border-cq-border bg-cq-bg px-4 py-2 text-sm text-white"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type your answer..."
            />
            <button
              type="button"
              className="rounded-full bg-cq-violet px-4 py-2 text-xs uppercase tracking-[0.3em] text-white"
              onClick={handleSubmitInput}
            >
              Send
            </button>
          </div>
        </div>
      ) : null}

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
