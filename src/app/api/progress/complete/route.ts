import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp-engine";
import { checkSuccessCondition } from "@/lib/lesson-success";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const lessonId = payload?.lessonId as string | undefined;
  const code = payload?.code as string | undefined;
  const score = payload?.score as number | undefined;

  if (!lessonId || !code) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      xpReward: true,
      gemReward: true,
      content: true,
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const content = lesson.content as { successCondition?: string };
  const successCondition = content?.successCondition ?? "";
  if (!checkSuccessCondition(code, successCondition)) {
    return NextResponse.json({ error: "CONDITION_NOT_MET" }, { status: 400 });
  }

  const existing = await prisma.progress.findUnique({
    where: {
      childId_lessonId: {
        childId: session.activeChildId,
        lessonId,
      },
    },
    select: { status: true },
  });

  if (existing?.status === "COMPLETED" || existing?.status === "MASTERED") {
    return NextResponse.json({ alreadyComplete: true });
  }

  const isPerfect = score === 100;

  const xpResult = await awardXP(session.activeChildId, "LESSON_COMPLETE", { lessonId });
  let bonusResult: typeof xpResult | null = null;
  if (isPerfect) {
    bonusResult = await awardXP(session.activeChildId, "PERFECT_SCORE", { lessonId });
  }

  const combinedAchievements = [
    ...xpResult.newAchievements,
    ...(bonusResult?.newAchievements ?? []),
  ];
  const achievementRecords =
    combinedAchievements.length > 0
      ? await prisma.achievement.findMany({
          where: { key: { in: combinedAchievements } },
          select: { id: true, title: true, rarity: true, xpReward: true, gemReward: true },
        })
      : [];

  await prisma.child.update({
    where: { id: session.activeChildId },
    data: { gems: { increment: lesson.gemReward } },
  });

  await prisma.progress.upsert({
    where: {
      childId_lessonId: {
        childId: session.activeChildId,
        lessonId,
      },
    },
    update: {
      status: isPerfect ? "MASTERED" : "COMPLETED",
      score: score ?? null,
      code,
      completedAt: new Date(),
      attempts: { increment: 1 },
      xpEarned: xpResult.xpAwarded + (bonusResult?.xpAwarded ?? 0),
    },
    create: {
      childId: session.activeChildId,
      lessonId,
      status: isPerfect ? "MASTERED" : "COMPLETED",
      score: score ?? null,
      code,
      completedAt: new Date(),
      attempts: 1,
      xpEarned: xpResult.xpAwarded + (bonusResult?.xpAwarded ?? 0),
    },
  });

  const finalResult = bonusResult ?? xpResult;

  return NextResponse.json({
    success: true,
    xpAwarded: xpResult.xpAwarded + (bonusResult?.xpAwarded ?? 0),
    xpTotal: finalResult.xpTotal,
    leveledUp: finalResult.leveledUp,
    newLevel: finalResult.newLevel,
    streakBonus: xpResult.streakBonus,
    newAchievements: achievementRecords,
    gems: lesson.gemReward,
  });
}
