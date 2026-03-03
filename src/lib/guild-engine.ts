export type SeatPlan = "FREE" | "SPARK" | "EXPLORER" | "ADVENTURER" | "FAMILY" | "CHAMPION";

export function seatsForPlan(plan: SeatPlan): number {
  if (plan === "FAMILY" || plan === "CHAMPION") return 3;
  return 1;
}

export function computeGuildXpTotal(currentXp: number, xpAwarded: number): number {
  return currentXp + xpAwarded;
}

export function getGuildXpIncrement(xpAwarded: number): number {
  return computeGuildXpTotal(0, xpAwarded);
}
