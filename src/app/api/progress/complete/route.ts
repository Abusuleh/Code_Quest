import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp-engine";
import { checkSuccessCondition, checkPythonSuccess } from "@/lib/lesson-success";
import { render } from "@react-email/render";
import { getResend } from "@/lib/resend";
import { SparkGraduationEmail } from "@/emails/SparkGraduationEmail";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { activeSessionToken: true },
  });
  if (!child?.activeSessionToken || child.activeSessionToken !== session.activeChildSessionToken) {
    return NextResponse.json({ reason: "SESSION_DISPLACED" }, { status: 409 });
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
      module: {
        select: {
          phase: { select: { number: true } },
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const content = lesson.content as { successCondition?: string };
  const successCondition = content?.successCondition ?? "";
  const isPhase2 = lesson.module.phase.number === 2;
  const success = isPhase2
    ? checkPythonSuccess(code, successCondition)
    : checkSuccessCondition(code, successCondition);
  if (!success) {
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

  const completedCount = await prisma.progress.count({
    where: {
      childId: session.activeChildId,
      status: { in: ["COMPLETED", "MASTERED"] },
      lesson: { module: { phase: { number: 1 } } },
    },
  });

  let sparkGraduation = false;
  let builderGraduation = false;
  let sparkAchievement: {
    id: string;
    title: string;
    rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
    xpReward: number;
    gemReward: number;
  } | null = null;
  let builderAchievement: {
    id: string;
    title: string;
    rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
    xpReward: number;
    gemReward: number;
  } | null = null;

  if (completedCount >= 45) {
    sparkGraduation = true;
    const spark = await prisma.achievement.findUnique({
      where: { key: "SPARK_BADGE" },
      select: { id: true, title: true, rarity: true, xpReward: true, gemReward: true },
    });
    if (spark) {
      const existingSpark = await prisma.childAchievement.findUnique({
        where: {
          childId_achievementId: {
            childId: session.activeChildId,
            achievementId: spark.id,
          },
        },
      });

      if (!existingSpark) {
        await prisma.childAchievement.create({
          data: { childId: session.activeChildId, achievementId: spark.id },
        });
        await awardXP(session.activeChildId, "BADGE_EARN", {
          achievementKey: "SPARK_BADGE",
        });
        await prisma.child.update({
          where: { id: session.activeChildId },
          data: { currentPhase: 2 },
        });
        sparkAchievement = spark;

        const resend = getResend();
        if (resend) {
          const childProfile = await prisma.child.findUnique({
            where: { id: session.activeChildId },
            select: { displayName: true, xpTotal: true, parent: { select: { email: true } } },
          });
          if (childProfile?.parent.email) {
            const baseUrl =
              process.env.NEXT_PUBLIC_APP_URL ??
              process.env.NEXTAUTH_URL ??
              "http://localhost:3000";
            const html = await render(
              SparkGraduationEmail({
                childName: childProfile.displayName,
                xpTotal: childProfile.xpTotal,
                dashboardUrl: `${baseUrl}/parent/dashboard`,
              }),
            );
            await resend.emails.send({
              from: process.env.RESEND_FROM ?? "Byte from CodeQuest <byte@codequest.world>",
              to: childProfile.parent.email,
              subject: `${childProfile.displayName} just completed the Spark Zone!`,
              html,
            });
          }
        }
      }
    }
  }

  const builderCompletedCount = await prisma.progress.count({
    where: {
      childId: session.activeChildId,
      status: { in: ["COMPLETED", "MASTERED"] },
      lesson: { module: { phase: { number: 2 } } },
    },
  });

  if (builderCompletedCount >= 50) {
    const builder = await prisma.achievement.findUnique({
      where: { key: "BUILDER_BADGE" },
      select: { id: true, title: true, rarity: true, xpReward: true, gemReward: true },
    });
    if (builder) {
      const existingBuilder = await prisma.childAchievement.findUnique({
        where: {
          childId_achievementId: {
            childId: session.activeChildId,
            achievementId: builder.id,
          },
        },
      });

      if (!existingBuilder) {
        await prisma.childAchievement.create({
          data: { childId: session.activeChildId, achievementId: builder.id },
        });
        await awardXP(session.activeChildId, "BUILDER_BADGE", {
          achievementKey: "BUILDER_BADGE",
        });
        await prisma.child.update({
          where: { id: session.activeChildId },
          data: { currentPhase: 3 },
        });
        builderAchievement = builder;
        builderGraduation = true;
      }
    }
  }

  const finalResult = bonusResult ?? xpResult;
  const updatedChild = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { xpTotal: true, xpLevel: true },
  });

  const extraAchievements = [
    ...(sparkAchievement ? [sparkAchievement] : []),
    ...(builderAchievement ? [builderAchievement] : []),
  ];

  return NextResponse.json({
    success: true,
    xpAwarded: xpResult.xpAwarded + (bonusResult?.xpAwarded ?? 0),
    xpTotal: updatedChild?.xpTotal ?? finalResult.xpTotal,
    leveledUp: finalResult.leveledUp,
    newLevel: finalResult.newLevel,
    streakBonus: xpResult.streakBonus,
    newAchievements: extraAchievements.length
      ? [...achievementRecords, ...extraAchievements]
      : achievementRecords,
    gems: lesson.gemReward,
    sparkGraduation,
    builderGraduation,
  });
}
