import { describe, expect, it } from "vitest";
import type { Subscription } from "@prisma/client";
import { canAccessLesson } from "@/lib/subscription-gate";

const baseSubscription = {
  id: "sub-1",
  userId: "user-1",
  stripeCustomerId: "cus_1",
  stripeSubscriptionId: null,
  plan: "FREE",
  status: "ACTIVE",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  childSeats: 1,
  stripeNgn: false,
} as Subscription;

describe("canAccessLesson", () => {
  it("returns true for moduleOrder=1 with FREE plan", () => {
    expect(canAccessLesson(baseSubscription, 1)).toBe(true);
  });

  it("returns false for moduleOrder=2 with FREE plan", () => {
    expect(canAccessLesson(baseSubscription, 2)).toBe(false);
  });

  it("returns true for moduleOrder=2 with SPARK plan, status=ACTIVE", () => {
    const sub = { ...baseSubscription, plan: "SPARK", status: "ACTIVE" } as Subscription;
    expect(canAccessLesson(sub, 2)).toBe(true);
  });

  it("returns false for moduleOrder=2 with SPARK plan, status=CANCELLED", () => {
    const sub = { ...baseSubscription, plan: "SPARK", status: "CANCELLED" } as Subscription;
    expect(canAccessLesson(sub, 2)).toBe(false);
  });

  it("returns false for moduleOrder=2 with SPARK plan, status=PAST_DUE", () => {
    const sub = { ...baseSubscription, plan: "SPARK", status: "PAST_DUE" } as Subscription;
    expect(canAccessLesson(sub, 2)).toBe(false);
  });

  it("returns true for moduleOrder=5 with CHAMPION plan, status=ACTIVE", () => {
    const sub = { ...baseSubscription, plan: "CHAMPION", status: "ACTIVE" } as Subscription;
    expect(canAccessLesson(sub, 5)).toBe(true);
  });
});
