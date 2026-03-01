"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator, Order } from "blockly/javascript";

type StarterCode = { xml?: string } | null;

type Props = {
  lessonId: string;
  starterCode?: StarterCode;
  onXmlChange?: (xml: string) => void;
};

export type BlocklyEditorHandle = {
  getWorkspaceXml: () => string;
  getGeneratedCode: () => string;
  clearWorkspace: () => void;
};

const TOOLBOX = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "category",
      name: "Events",
      categorystyle: "cqEvents",
      contents: [
        { kind: "block", type: "event_whenflagclicked" },
        { kind: "block", type: "event_whenkeypressed" },
      ],
    },
    {
      kind: "category",
      name: "Motion",
      categorystyle: "cqMotion",
      contents: [
        { kind: "block", type: "motion_movesteps" },
        { kind: "block", type: "motion_turnright" },
      ],
    },
    {
      kind: "category",
      name: "Looks",
      categorystyle: "cqLooks",
      contents: [{ kind: "block", type: "looks_say" }],
    },
    {
      kind: "category",
      name: "Pen",
      categorystyle: "cqPen",
      contents: [
        { kind: "block", type: "pen_penDown" },
        { kind: "block", type: "pen_setPenColorToColor" },
      ],
    },
    {
      kind: "category",
      name: "Control",
      categorystyle: "cqControl",
      contents: [{ kind: "block", type: "control_repeat" }],
    },
    {
      kind: "category",
      name: "Operators",
      categorystyle: "cqOperators",
      contents: [{ kind: "block", type: "operator_join" }],
    },
    {
      kind: "category",
      name: "Sensing",
      categorystyle: "cqSensing",
      contents: [
        { kind: "block", type: "sensing_askandwait" },
        { kind: "block", type: "sensing_answer" },
      ],
    },
  ],
};

const THEME = Blockly.Theme.defineTheme("codequest", {
  name: "codequest",
  base: Blockly.Themes.Classic,
  componentStyles: {
    workspaceBackgroundColour: "#12111A",
    toolboxBackgroundColour: "#1C1B27",
    toolboxForegroundColour: "#F4F4F8",
    flyoutBackgroundColour: "#1C1B27",
    flyoutForegroundColour: "#F4F4F8",
    flyoutOpacity: 0.98,
    scrollbarColour: "#302E4A",
    insertionMarkerColour: "#00D4FF",
    insertionMarkerOpacity: 0.3,
  },
  categoryStyles: {
    cqEvents: { colour: "#F5A623" },
    cqMotion: { colour: "#00D4FF" },
    cqLooks: { colour: "#B06BFF" },
    cqPen: { colour: "#00E5A0" },
    cqControl: { colour: "#FF8C42" },
    cqOperators: { colour: "#9AD82A" },
    cqSensing: { colour: "#6B9BFF" },
  },
  blockStyles: {
    cqEvents: { colourPrimary: "#F5A623" },
    cqMotion: { colourPrimary: "#00D4FF" },
    cqLooks: { colourPrimary: "#B06BFF" },
    cqPen: { colourPrimary: "#00E5A0" },
    cqControl: { colourPrimary: "#FF8C42" },
    cqOperators: { colourPrimary: "#9AD82A" },
    cqSensing: { colourPrimary: "#6B9BFF" },
  },
});

function registerBlocks() {
  if (Blockly.Blocks["event_whenflagclicked"]) return;

  Blockly.Blocks["event_whenflagclicked"] = {
    init() {
      this.appendDummyInput().appendField("when flag clicked");
      this.appendStatementInput("DO");
      this.setNextStatement(true);
      this.setStyle("cqEvents");
    },
  };

  Blockly.Blocks["event_whenkeypressed"] = {
    init() {
      this.appendDummyInput()
        .appendField("when")
        .appendField(
          new Blockly.FieldDropdown([
            ["space", " "],
            ["left arrow", "ArrowLeft"],
            ["right arrow", "ArrowRight"],
            ["up arrow", "ArrowUp"],
            ["down arrow", "ArrowDown"],
          ]),
          "KEY",
        )
        .appendField("pressed");
      this.appendStatementInput("DO");
      this.setNextStatement(true);
      this.setStyle("cqEvents");
    },
  };

  Blockly.Blocks["looks_say"] = {
    init() {
      this.appendValueInput("TEXT").appendField("say");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqLooks");
    },
  };

  Blockly.Blocks["motion_movesteps"] = {
    init() {
      this.appendValueInput("STEPS").appendField("move steps");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqMotion");
    },
  };

  Blockly.Blocks["motion_turnright"] = {
    init() {
      this.appendValueInput("DEG").appendField("turn right");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqMotion");
    },
  };

  Blockly.Blocks["control_repeat"] = {
    init() {
      this.appendValueInput("TIMES").appendField("repeat");
      this.appendStatementInput("DO").appendField("do");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqControl");
    },
  };

  Blockly.Blocks["pen_penDown"] = {
    init() {
      this.appendDummyInput().appendField("pen down");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqPen");
    },
  };

  Blockly.Blocks["pen_setPenColorToColor"] = {
    init() {
      this.appendDummyInput()
        .appendField("set pen color to")
        .appendField(
          new Blockly.FieldDropdown([
            ["cyan", "#00D4FF"],
            ["gold", "#F5A623"],
            ["green", "#00E5A0"],
            ["violet", "#B06BFF"],
            ["red", "#FF4D6D"],
          ]),
          "COLOR",
        );
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqPen");
    },
  };

  Blockly.Blocks["sensing_askandwait"] = {
    init() {
      this.appendValueInput("QUESTION").appendField("ask");
      this.appendDummyInput().appendField("and wait");
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setStyle("cqSensing");
    },
  };

  Blockly.Blocks["sensing_answer"] = {
    init() {
      this.appendDummyInput().appendField("answer");
      this.setOutput(true, "String");
      this.setStyle("cqSensing");
    },
  };

  Blockly.Blocks["operator_join"] = {
    init() {
      this.appendValueInput("A").appendField("join");
      this.appendValueInput("B").appendField("with");
      this.setOutput(true, "String");
      this.setStyle("cqOperators");
    },
  };

  javascriptGenerator.forBlock["event_whenflagclicked"] = (block, generator) => {
    const statements = generator.statementToCode(block, "DO");
    return `${statements}\n`;
  };

  javascriptGenerator.forBlock["event_whenkeypressed"] = (block, generator) => {
    const key = block.getFieldValue("KEY");
    const statements = generator.statementToCode(block, "DO");
    return `document.addEventListener('keydown', (event) => { if (event.key === '${key}') { ${statements} } });\n`;
  };

  javascriptGenerator.forBlock["looks_say"] = (block, generator) => {
    const value = generator.valueToCode(block, "TEXT", Order.NONE) || "''";
    return `say(${value});\n`;
  };

  javascriptGenerator.forBlock["motion_movesteps"] = (block, generator) => {
    const steps = generator.valueToCode(block, "STEPS", Order.NONE) || "10";
    return `move(${steps});\n`;
  };

  javascriptGenerator.forBlock["motion_turnright"] = (block, generator) => {
    const deg = generator.valueToCode(block, "DEG", Order.NONE) || "90";
    return `turnRight(${deg});\n`;
  };

  javascriptGenerator.forBlock["control_repeat"] = (block, generator) => {
    const times = generator.valueToCode(block, "TIMES", Order.NONE) || "4";
    const statements = generator.statementToCode(block, "DO");
    return `for (let count = 0; count < ${times}; count += 1) { ${statements} }\n`;
  };

  javascriptGenerator.forBlock["pen_penDown"] = () => "penDown();\n";

  javascriptGenerator.forBlock["pen_setPenColorToColor"] = (block) => {
    const color = block.getFieldValue("COLOR");
    return `setPenColor('${color}');\n`;
  };

  javascriptGenerator.forBlock["sensing_askandwait"] = (block, generator) => {
    const question = generator.valueToCode(block, "QUESTION", Order.NONE) || "''";
    return `ask(${question});\n`;
  };

  javascriptGenerator.forBlock["sensing_answer"] = () => ["getAnswer()", Order.NONE];

  javascriptGenerator.forBlock["operator_join"] = (block, generator) => {
    const a = generator.valueToCode(block, "A", Order.NONE) || "''";
    const b = generator.valueToCode(block, "B", Order.NONE) || "''";
    return [`String(${a}) + String(${b})`, Order.ADDITION];
  };
}

export const BlocklyEditor = forwardRef<BlocklyEditorHandle, Props>(
  ({ lessonId, starterCode, onXmlChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [workspaceXml, setWorkspaceXml] = useState("");
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const storageKey = useMemo(() => `cq:lesson:${lessonId}:code`, [lessonId]);

    useImperativeHandle(ref, () => ({
      getWorkspaceXml: () =>
        workspaceRef.current
          ? Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspaceRef.current))
          : workspaceXml,
      getGeneratedCode: () =>
        workspaceRef.current ? javascriptGenerator.workspaceToCode(workspaceRef.current) : "",
      clearWorkspace: () => {
        if (workspaceRef.current) {
          workspaceRef.current.clear();
        }
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return undefined;
      registerBlocks();

      const workspace = Blockly.inject(containerRef.current, {
        toolbox: TOOLBOX,
        theme: THEME,
        renderer: "zelos",
        zoom: {
          controls: true,
          wheel: true,
        },
      });

      workspaceRef.current = workspace;

      const savedXml = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      const starterXml = starterCode?.xml ?? "";
      const initialXml = savedXml || starterXml;

      if (initialXml) {
        const dom = Blockly.utils.xml.textToDom(initialXml);
        Blockly.Xml.domToWorkspace(dom, workspace);
        setWorkspaceXml(initialXml);
        onXmlChange?.(initialXml);
      } else {
        const emptyXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        setWorkspaceXml(emptyXml);
        onXmlChange?.(emptyXml);
      }

      const onChange = () => {
        if (!workspaceRef.current) return;
        const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspaceRef.current));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setWorkspaceXml(xml);
          onXmlChange?.(xml);
        }, 500);
      };

      workspace.addChangeListener(onChange);

      return () => {
        workspace.removeChangeListener(onChange);
        workspace.dispose();
        workspaceRef.current = null;
      };
    }, [onXmlChange, starterCode, storageKey]);

    useEffect(() => {
      if (!workspaceXml) return undefined;
      const interval = setInterval(() => {
        localStorage.setItem(storageKey, workspaceXml);
      }, 10000);
      return () => clearInterval(interval);
    }, [storageKey, workspaceXml]);

    return <div ref={containerRef} className="h-full w-full" />;
  },
);

BlocklyEditor.displayName = "BlocklyEditor";
