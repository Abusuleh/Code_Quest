import { describe, expect, it } from "vitest";
import { computeGuildXpTotal } from "@/lib/guild-engine";
import { seatsForPlan } from "@/lib/stripe";
import { canAccessLesson } from "@/lib/subscription-gate";

const subscription = (plan: string, status: string = "ACTIVE") =>
  ({ plan, status } as never);

describe("guild engine helpers", () => {
  it("computes collective XP increment for a guild", () => {
    expect(computeGuildXpTotal(1200, 150)).toBe(1350);
  });

  it("seatsForPlan returns correct values for all plan types", () => {
    expect(seatsForPlan("FREE")).toBe(1);
    expect(seatsForPlan("SPARK")).toBe(1);
    expect(seatsForPlan("EXPLORER")).toBe(1);
    expect(seatsForPlan("ADVENTURER")).toBe(1);
    expect(seatsForPlan("FAMILY")).toBe(3);
    expect(seatsForPlan("CHAMPION")).toBe(3);
  });

  it("Phase 2 access correctly gated to CHAMPION plan", () => {
    expect(canAccessLesson(subscription("CHAMPION"), 1, 2)).toBe(true);
    expect(canAccessLesson(subscription("SPARK"), 1, 2)).toBe(false);
  });

  it("canAccessLesson returns false for phase 2 content on SPARK plan", () => {
    expect(canAccessLesson(subscription("SPARK"), 1, 2)).toBe(false);
  });
});
