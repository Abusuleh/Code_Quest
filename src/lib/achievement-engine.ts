import { prisma } from "@/lib/prisma";
import { computeLevel, type XPEventType } from "@/lib/xp-constants";

type AchievementState = {
  streakCurrent: number;
  xpTotal: number;
  parentId: string;
};

type ConditionContext = {
  triggerType: XPEventType;
  newXPTotal: number;
  lessonCount: number;
  placementDone: boolean;
  childCountForParent: number;
  state: AchievementState;
};

const achievementChecks: Record<string, (ctx: ConditionContext) => boolean> = {
  FIRST_LESSON: ({ triggerType, lessonCount }) =>
    triggerType === "LESSON_COMPLETE" && lessonCount === 1,
  STREAK_3: ({ state }) => state.streakCurrent >= 3,
  STREAK_7: ({ state }) => state.streakCurrent >= 7,
  STREAK_30: ({ state }) => state.streakCurrent >= 30,
  LEVEL_5: ({ newXPTotal }) => computeLevel(newXPTotal) >= 5,
  LEVEL_10: ({ newXPTotal }) => computeLevel(newXPTotal) >= 10,
  LEVEL_20: ({ newXPTotal }) => computeLevel(newXPTotal) >= 20,
  XP_1000: ({ newXPTotal }) => newXPTotal >= 1000,
  XP_10000: ({ newXPTotal }) => newXPTotal >= 10000,
  PERFECT_LESSON: ({ triggerType }) => triggerType === "PERFECT_SCORE",
  PLACEMENT_DONE: ({ placementDone }) => placementDone,
  FIRST_CHILD: ({ childCountForParent }) => childCountForParent === 1,
};

export async function checkAchievements(
  childId: string,
  triggerType: XPEventType,
  newXPTotal: number,
): Promise<string[]> {
  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    select: { streakCurrent: true, xpTotal: true, parentId: true },
  });

  const [existing, lessonCount, placementDone, childCountForParent, achievements] =
    await prisma.$transaction([
      prisma.childAchievement.findMany({
        where: { childId },
        select: { achievementId: true },
      }),
      prisma.xPEvent.count({
        where: { childId, type: "LESSON_COMPLETE" },
      }),
      prisma.placementResult.findFirst({
        where: { childId },
        select: { id: true },
      }),
      prisma.child.count({
        where: { parentId: child.parentId },
      }),
      prisma.achievement.findMany(),
    ]);

  const existingIds = new Set(existing.map((entry) => entry.achievementId));
  const earned: { achievementId: string; childId: string }[] = [];
  const earnedKeys: string[] = [];

  const context: ConditionContext = {
    triggerType,
    newXPTotal,
    lessonCount,
    placementDone: Boolean(placementDone),
    childCountForParent,
    state: child,
  };

  let bonusXP = 0;
  let bonusGems = 0;

  for (const achievement of achievements) {
    if (existingIds.has(achievement.id)) continue;
    const checker = achievementChecks[achievement.key];
    if (!checker) continue;
    if (!checker(context)) continue;

    earned.push({ achievementId: achievement.id, childId });
    earnedKeys.push(achievement.key);
    bonusXP += achievement.xpReward;
    bonusGems += achievement.gemReward;
  }

  if (earned.length === 0) return [];

  await prisma.$transaction([
    prisma.childAchievement.createMany({
      data: earned,
      skipDuplicates: true,
    }),
    prisma.child.update({
      where: { id: childId },
      data: {
        xpTotal: { increment: bonusXP },
        gems: { increment: bonusGems },
      },
    }),
  ]);

  return earnedKeys;
}
