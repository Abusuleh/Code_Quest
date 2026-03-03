"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import type { editor as MonacoEditorType } from "monaco-editor";

type StarterCode = { python?: string } | null;

type Props = {
  lessonId: string;
  starterCode?: StarterCode;
  onChange?: (code: string) => void;
};

export type MonacoEditorHandle = {
  getValue: () => string;
  setValue: (code: string) => void;
  focus: () => void;
};

const THEME_NAME = "codequest-dark";

export const MonacoEditor = forwardRef<MonacoEditorHandle, Props>(
  ({ lessonId, starterCode, onChange }, ref) => {
    const editorRef = useRef<MonacoEditorType.IStandaloneCodeEditor | null>(null);
    const [code, setCode] = useState("");

    const storageKey = useMemo(() => `cq:lesson:${lessonId}:python`, [lessonId]);

    useImperativeHandle(ref, () => ({
      getValue: () => editorRef.current?.getValue() ?? code,
      setValue: (value: string) => {
        editorRef.current?.setValue(value);
        setCode(value);
        onChange?.(value);
      },
      focus: () => editorRef.current?.focus(),
    }));

    useEffect(() => {
      const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      const initial = saved ?? starterCode?.python ?? "";
      setCode(initial);
      onChange?.(initial);
    }, [onChange, starterCode?.python, storageKey]);

    useEffect(() => {
      const interval = setInterval(() => {
        localStorage.setItem(storageKey, code);
      }, 10000);
      return () => clearInterval(interval);
    }, [code, storageKey]);

    return (
      <Editor
        height="100%"
        defaultLanguage="python"
        theme={THEME_NAME}
        value={code}
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
          setCode(nextValue);
          onChange?.(nextValue);
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
    );
  },
);

MonacoEditor.displayName = "MonacoEditor";
