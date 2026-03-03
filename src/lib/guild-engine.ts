export function computeGuildXpTotal(currentXp: number, xpAwarded: number): number {
  return currentXp + xpAwarded;
}

export function getGuildXpIncrement(xpAwarded: number): number {
  return computeGuildXpTotal(0, xpAwarded);
}
