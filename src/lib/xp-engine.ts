import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { XP_TABLE, computeLevel, type XPEventType } from "@/lib/xp-constants";
import { processStreakOnLessonComplete } from "@/lib/streak-engine";
import { checkAchievements } from "@/lib/achievement-engine";

export async function awardXP(
  childId: string,
  type: XPEventType,
  metadata?: Record<string, unknown>,
): Promise<{
  xpAwarded: number;
  xpTotal: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  streakBonus: number;
  newAchievements: string[];
}> {
  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    select: { xpTotal: true },
  });

  const previousLevel = computeLevel(child.xpTotal);
  const baseXP = XP_TABLE[type];

  let streakBonus = 0;
  if (type === "LESSON_COMPLETE") {
    const streak = await processStreakOnLessonComplete(childId);
    streakBonus = streak.streakBonus;
  }

  const totalXP = baseXP + streakBonus;
  const newXPTotal = child.xpTotal + totalXP;
  const newLevel = computeLevel(newXPTotal);

  await prisma.$transaction([
    prisma.child.update({
      where: { id: childId },
      data: { xpTotal: newXPTotal, xpLevel: newLevel },
    }),
    prisma.xPEvent.create({
      data: {
        childId,
        type,
        amount: totalXP,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      },
    }),
  ]);

  const newAchievements = await checkAchievements(childId, type, newXPTotal);

  const updatedChild = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    select: { xpTotal: true, xpLevel: true },
  });

  const finalLevel = computeLevel(updatedChild.xpTotal);
  if (finalLevel !== updatedChild.xpLevel) {
    await prisma.child.update({
      where: { id: childId },
      data: { xpLevel: finalLevel },
    });
  }

  return {
    xpAwarded: totalXP,
    xpTotal: updatedChild.xpTotal,
    previousLevel,
    newLevel: finalLevel,
    leveledUp: finalLevel > previousLevel,
    streakBonus,
    newAchievements,
  };
}
