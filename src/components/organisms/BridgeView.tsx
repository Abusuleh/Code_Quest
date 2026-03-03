"use client";

import { useEffect, useMemo, useRef } from "react";
import * as Blockly from "blockly";
import Editor from "@monaco-editor/react";
import { BLOCKLY_THEME, registerBlocks } from "@/components/organisms/BlocklyEditor";

const THEME_NAME = "codequest-dark";

const BRIDGE_CONTENT: Record<string, { xml: string; python: string }> = {
  "lesson-2-1-1": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='looks_say'></block></statement></block></xml>",
    python: "print('Hello, Nova!')",
  },
  "lesson-2-1-2": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='looks_say'></block></statement></block></xml>",
    python: "print('Hello World')",
  },
  "lesson-2-1-3": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='looks_say'></block></statement></block></xml>",
    python: "name = 'Nova'\\nprint(name)",
  },
  "lesson-2-1-4": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='looks_say'></block></statement></block></xml>",
    python: "greeting = 'Hello' + ' ' + 'Builder'\\nprint(greeting)",
  },
  "lesson-2-1-5": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='motion_movesteps'></block></statement></block></xml>",
    python: "total = 4 + 6\\nprint(total)",
  },
  "lesson-2-1-6": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='sensing_askandwait'></block></statement></block></xml>",
    python: "name = input('What is your name? ')\\nprint(name)",
  },
  "lesson-2-1-7": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='sensing_askandwait'></block></statement></block></xml>",
    python: "age = input('How old are you? ')\\nprint(age)",
  },
  "lesson-2-1-8": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='sensing_askandwait'></block></statement></block></xml>",
    python: "name = input('Name? ')\\nprint('Hello, ' + name)",
  },
  "lesson-2-1-9": {
    xml: "<xml><block type='event_whenflagclicked'><statement name='DO'><block type='sensing_askandwait'></block></statement></block></xml>",
    python: "name = input('Name? ')\\nprint('Welcome, ' + name)",
  },
};

export function BridgeView({ lessonId }: { lessonId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bridgeContent = BRIDGE_CONTENT[lessonId];
  const bridgeXml = useMemo(() => bridgeContent?.xml ?? "<xml></xml>", [bridgeContent]);
  const bridgePython = bridgeContent?.python ?? "# Bridge view not available.";

  useEffect(() => {
    if (!containerRef.current) return undefined;
    registerBlocks();

    const workspace = Blockly.inject(containerRef.current, {
      readOnly: true,
      theme: BLOCKLY_THEME,
      renderer: "zelos",
      scrollbars: true,
    });

    const dom = Blockly.utils.xml.textToDom(bridgeXml);
    Blockly.Xml.domToWorkspace(dom, workspace);

    return () => {
      workspace.dispose();
    };
  }, [bridgeXml]);

  return (
    <div className="rounded-3xl border border-cq-border bg-cq-bg-panel p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-3">
          <div ref={containerRef} className="h-[220px] w-full" />
          <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            How you did it in Blocks
          </p>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <span className="text-2xl text-cq-violet">←→</span>
        </div>

        <div className="rounded-2xl border border-cq-border bg-cq-bg-elevated p-3">
          <Editor
            height="220px"
            defaultLanguage="python"
            theme={THEME_NAME}
            value={bridgePython}
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
                },
              });
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              lineNumbers: "off",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize: 13,
              lineHeight: 20,
            }}
          />
          <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            How Python does the same thing
          </p>
        </div>
      </div>
    </div>
  );
}
