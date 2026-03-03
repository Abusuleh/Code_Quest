import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLesson } from "@/lib/subscription-gate";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const [child, subscription] = await prisma.$transaction([
    prisma.child.findUnique({
      where: { id: session.activeChildId },
      select: { activeSessionToken: true },
    }),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);
  if (!child?.activeSessionToken || child.activeSessionToken !== session.activeChildSessionToken) {
    return NextResponse.json({ reason: "SESSION_DISPLACED" }, { status: 409 });
  }
  if (!canAccessLesson(subscription, 1, 2)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const trialId = payload?.trialId as string | undefined;
  const code = payload?.code as string | undefined;
  const scoreRaw = Number(payload?.score ?? 0);
  const score = Number.isFinite(scoreRaw) ? Math.max(0, Math.min(100, scoreRaw)) : 0;

  if (!trialId || !code) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const trial = await prisma.forgeTrial.findUnique({
    where: { id: trialId },
    select: { id: true },
  });
  if (!trial) {
    return NextResponse.json({ error: "TRIAL_NOT_FOUND" }, { status: 404 });
  }

  await prisma.forgeTrialEntry.upsert({
    where: {
      trialId_childId: {
        trialId,
        childId: session.activeChildId,
      },
    },
    update: {
      code,
      score,
      submittedAt: new Date(),
    },
    create: {
      trialId,
      childId: session.activeChildId,
      code,
      score,
    },
  });

  const leaderboard = await prisma.forgeTrialEntry.findMany({
    where: { trialId },
    orderBy: [{ score: "desc" }, { submittedAt: "asc" }],
    select: { childId: true },
  });
  const rank = leaderboard.findIndex((entry) => entry.childId === session.activeChildId) + 1;

  return NextResponse.json({ submitted: true, rank });
}
