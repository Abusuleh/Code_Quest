export const XP_TABLE = {
  LESSON_COMPLETE: 100,
  CHALLENGE_WIN: 150,
  DAILY_QUEST: 50,
  STREAK_BONUS: 25,
  FIRST_LESSON: 200,
  PERFECT_SCORE: 75,
  BADGE_EARN: 50,
  PROJECT_PUBLISH: 300,
} as const;

export type XPEventType = keyof typeof XP_TABLE;

export const LEVEL_THRESHOLDS = [
  0, // Level 1
  500, // Level 2
  1200, // Level 3
  2100, // Level 4
  3200, // Level 5
  4500, // Level 6
  6000, // Level 7
  7700, // Level 8
  9600, // Level 9
  11700, // Level 10
  14000, // Level 11
  16500, // Level 12
  19200, // Level 13
  22100, // Level 14
  25200, // Level 15
  28500, // Level 16
  32000, // Level 17
  35700, // Level 18
  39600, // Level 19
  43700, // Level 20
] as const;

export function computeLevel(xpTotal: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i -= 1) {
    if (xpTotal >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function xpToNextLevel(xpTotal: number): {
  current: number;
  required: number;
  level: number;
} {
  const level = computeLevel(xpTotal);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return {
    current: xpTotal - currentThreshold,
    required: nextThreshold - currentThreshold,
    level,
  };
}

export const RANK_TITLES: Record<number, string> = {
  1: "Code Seed",
  2: "Pixel Sprout",
  3: "Loop Learner",
  4: "Variable Voyager",
  5: "Function Finder",
  6: "Array Adventurer",
  7: "Object Oracle",
  8: "Class Commander",
  9: "Module Master",
  10: "Algorithm Ace",
  11: "Debug Detective",
  12: "Logic Luminary",
  13: "Data Dynamo",
  14: "API Architect",
  15: "Framework Forger",
  16: "Stack Scholar",
  17: "System Sage",
  18: "Code Conjurer",
  19: "Quest Champion",
  20: "Code Legend",
};

export function getRankTitle(level: number): string {
  return RANK_TITLES[Math.min(level, 20)] ?? "Code Legend";
}
