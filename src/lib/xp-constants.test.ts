import { describe, expect, it } from "vitest";
import { computeLevel, getRankTitle, xpToNextLevel } from "@/lib/xp-constants";

describe("xp constants", () => {
  it("computeLevel(0) -> 1", () => {
    expect(computeLevel(0)).toBe(1);
  });

  it("computeLevel(499) -> 1", () => {
    expect(computeLevel(499)).toBe(1);
  });

  it("computeLevel(500) -> 2", () => {
    expect(computeLevel(500)).toBe(2);
  });

  it("computeLevel(1199) -> 2", () => {
    expect(computeLevel(1199)).toBe(2);
  });

  it("computeLevel(1200) -> 3", () => {
    expect(computeLevel(1200)).toBe(3);
  });

  it("computeLevel(43700) -> 20", () => {
    expect(computeLevel(43700)).toBe(20);
  });

  it("computeLevel(999999) -> 20", () => {
    expect(computeLevel(999999)).toBe(20);
  });

  it("xpToNextLevel(0) -> { current: 0, required: 500, level: 1 }", () => {
    expect(xpToNextLevel(0)).toEqual({ current: 0, required: 500, level: 1 });
  });

  it("xpToNextLevel(500) -> { current: 0, required: 700, level: 2 }", () => {
    expect(xpToNextLevel(500)).toEqual({ current: 0, required: 700, level: 2 });
  });

  it("xpToNextLevel(1050) -> { current: 550, required: 700, level: 2 }", () => {
    expect(xpToNextLevel(1050)).toEqual({ current: 550, required: 700, level: 2 });
  });

  it("getRankTitle(1) -> Code Seed", () => {
    expect(getRankTitle(1)).toBe("Code Seed");
  });

  it("getRankTitle(10) -> Algorithm Ace", () => {
    expect(getRankTitle(10)).toBe("Algorithm Ace");
  });

  it("getRankTitle(20) -> Code Legend", () => {
    expect(getRankTitle(20)).toBe("Code Legend");
  });

  it("getRankTitle(99) -> Code Legend", () => {
    expect(getRankTitle(99)).toBe("Code Legend");
  });
});
