import { describe, expect, it } from "vitest";
import { checkSuccessCondition } from "@/lib/lesson-success";

const xmlWithBlocks = (types: string[]) =>
  `<xml>${types.map((t) => `<block type="${t}"></block>`).join("")}</xml>`;

describe("checkSuccessCondition", () => {
  it("returns true when required block is present in XML", () => {
    const xml = xmlWithBlocks(["motion_movesteps"]);
    expect(checkSuccessCondition(xml, "hasBlock:motion_movesteps")).toBe(true);
  });

  it("returns false when required block is absent from XML", () => {
    const xml = xmlWithBlocks(["looks_say"]);
    expect(checkSuccessCondition(xml, "hasBlock:motion_movesteps")).toBe(false);
  });

  it("returns true only when ALL conditions are satisfied", () => {
    const xml = xmlWithBlocks(["control_repeat", "motion_movesteps"]);
    expect(
      checkSuccessCondition(xml, "hasBlock:control_repeat|hasBlock:motion_movesteps"),
    ).toBe(true);
    expect(
      checkSuccessCondition(xml, "hasBlock:control_repeat|hasBlock:motion_turnright"),
    ).toBe(false);
  });

  it("returns true for empty condition string — no requirement", () => {
    expect(checkSuccessCondition("<xml></xml>", "")).toBe(true);
  });

  it("returns false for any hasBlock requirement when XML is empty string", () => {
    expect(checkSuccessCondition("", "hasBlock:motion_movesteps")).toBe(false);
  });
});
