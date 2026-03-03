import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { XP_TABLE, computeLevel, type XPEventType } from "@/lib/xp-constants";
import { processStreakOnLessonComplete } from "@/lib/streak-engine";
import { getGuildXpIncrement } from "@/lib/guild-engine";
import { checkAchievements } from "@/lib/achievement-engine";

export async function awardXP(
  childId: string,
  type: XPEventType,
  metadata?: Record<string, unknown>,
  options?: { amountOverride?: number },
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
    select: { xpTotal: true, guildId: true },
  });

  const previousLevel = computeLevel(child.xpTotal);
  const baseXP =
    typeof options?.amountOverride === "number" ? options.amountOverride : XP_TABLE[type];

  let streakBonus = 0;
  if (type === "LESSON_COMPLETE") {
    const streak = await processStreakOnLessonComplete(childId);
    streakBonus = streak.streakBonus;
  }

  const totalXP = baseXP + streakBonus;
  const newXPTotal = child.xpTotal + totalXP;
  const newLevel = computeLevel(newXPTotal);

  const transaction: Prisma.PrismaPromise<unknown>[] = [
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
  ];

  if (child.guildId) {
    const guildIncrement = getGuildXpIncrement(totalXP);
    transaction.push(
      prisma.guild.update({
        where: { id: child.guildId },
        data: { xpTotal: { increment: guildIncrement } },
      }),
    );
  }

  await prisma.$transaction(transaction);

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
