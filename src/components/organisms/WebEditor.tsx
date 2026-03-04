"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor as MonacoEditorType } from "monaco-editor";

type WebStarterCode = { html?: string; css?: string; js?: string } | null;

type Props = {
  lessonId: string;
  starterCode?: WebStarterCode;
  onChange?: (code: { html: string; css: string; js: string }) => void;
};

export type WebEditorHandle = {
  getValue: () => { html: string; css: string; js: string };
  setValue: (value: { html: string; css: string; js: string }) => void;
  focus: () => void;
};

const THEME_NAME = "codequest-web";

export const WebEditor = forwardRef<WebEditorHandle, Props>(
  ({ lessonId, starterCode, onChange }, ref) => {
    const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);
    const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
    const [html, setHtml] = useState("");
    const [css, setCss] = useState("");
    const [js, setJs] = useState("");

    const storageKey = useMemo(() => `cq:lesson:${lessonId}:web`, [lessonId]);

    useImperativeHandle(ref, () => ({
      getValue: () => ({ html, css, js }),
      setValue: (value) => {
        setHtml(value.html);
        setCss(value.css);
        setJs(value.js);
        onChange?.(value);
      },
      focus: () => editorRef.current?.focus(),
    }));

    useEffect(() => {
      const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as { html?: string; css?: string; js?: string };
          const next = {
            html: parsed.html ?? "",
            css: parsed.css ?? "",
            js: parsed.js ?? "",
          };
          setHtml(next.html);
          setCss(next.css);
          setJs(next.js);
          onChange?.(next);
          return;
        } catch {
          localStorage.removeItem(storageKey);
        }
      }

      const initial = {
        html: starterCode?.html ?? "",
        css: starterCode?.css ?? "",
        js: starterCode?.js ?? "",
      };
      setHtml(initial.html);
      setCss(initial.css);
      setJs(initial.js);
      onChange?.(initial);
    }, [onChange, starterCode?.css, starterCode?.html, starterCode?.js, storageKey]);

    useEffect(() => {
      const interval = setInterval(() => {
        localStorage.setItem(storageKey, JSON.stringify({ html, css, js }));
      }, 10000);
      return () => clearInterval(interval);
    }, [css, html, js, storageKey]);

    const activeValue = activeTab === "html" ? html : activeTab === "css" ? css : js;

    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-cq-border bg-cq-bg px-4 py-2">
          {(["html", "css", "js"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] ${
                activeTab === tab
                  ? "bg-cq-orange text-black"
                  : "text-cq-text-secondary hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language={activeTab === "js" ? "javascript" : activeTab}
            theme={THEME_NAME}
            value={activeValue}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme(THEME_NAME, {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "keyword", foreground: "00D4FF" },
                  { token: "string", foreground: "00E5A0" },
                  { token: "number", foreground: "F5A623" },
                  { token: "comment", foreground: "8B8FA8" },
                ],
                colors: {
                  "editor.background": "#12111A",
                  "editor.foreground": "#F4F4F8",
                  "editorLineNumber.foreground": "#5F6175",
                  "editorLineNumber.activeForeground": "#F4F4F8",
                  "editorCursor.foreground": "#00D4FF",
                  "editorIndentGuide.background": "#2A2B3C",
                  "editorIndentGuide.activeBackground": "#3C3D52",
                },
              });
            }}
            onMount={(editor) => {
              editorRef.current = editor;
            }}
            onChange={(value) => {
              const nextValue = value ?? "";
              if (activeTab === "html") setHtml(nextValue);
              if (activeTab === "css") setCss(nextValue);
              if (activeTab === "js") setJs(nextValue);
              onChange?.({
                html: activeTab === "html" ? nextValue : html,
                css: activeTab === "css" ? nextValue : css,
                js: activeTab === "js" ? nextValue : js,
              });
            }}
            options={{
              minimap: { enabled: false },
              lineNumbers: "on",
              wordWrap: "off",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize: 14,
              lineHeight: 22,
            }}
          />
        </div>
      </div>
    );
  },
);

WebEditor.displayName = "WebEditor";
