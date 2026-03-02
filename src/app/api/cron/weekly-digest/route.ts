import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getResend } from "@/lib/resend";
import { WeeklyDigestEmail } from "@/emails/WeeklyDigestEmail";
import { getRankTitle } from "@/lib/xp-constants";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") ?? request.headers.get("cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const since = new Date(Date.now() - ONE_WEEK_MS);

  const parents = await prisma.user.findMany({
    where: {
      role: "PARENT",
      children: {
        some: {
          progress: {
            some: { completedAt: { gte: since } },
          },
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      children: {
        select: {
          id: true,
          displayName: true,
          xpLevel: true,
          streakCurrent: true,
          progress: {
            where: {
              completedAt: { gte: since },
              status: { in: ["COMPLETED", "MASTERED"] },
            },
            select: { id: true },
          },
          achievements: {
            where: { earnedAt: { gte: since } },
            select: {
              achievement: { select: { title: true } },
            },
          },
        },
      },
    },
  });

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ error: "RESEND_NOT_CONFIGURED" }, { status: 500 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const batch = [];

  for (const parent of parents) {
    if (!parent.email) continue;
    const childDigests = [];

    for (const child of parent.children) {
      const xpAggregate = await prisma.xPEvent.aggregate({
        where: { childId: child.id, createdAt: { gte: since } },
        _sum: { amount: true },
      });
      const xpEarned = xpAggregate._sum.amount ?? 0;

      const achievements = child.achievements.map((entry) => entry.achievement.title).slice(0, 4);

      const lastHint = await prisma.xPEvent.findFirst({
        where: {
          childId: child.id,
          metadata: {
            path: ["byteMessage"],
            not: Prisma.DbNull,
          },
        },
        orderBy: { createdAt: "desc" },
        select: { metadata: true },
      });

      const byteMessage =
        (lastHint?.metadata as { byteMessage?: string } | null)?.byteMessage ??
        "Byte cheered this week: keep going, you are becoming a real coder!";

      childDigests.push({
        name: child.displayName,
        lessonsCompleted: child.progress.length,
        xpEarned,
        streak: child.streakCurrent,
        level: child.xpLevel,
        rankTitle: getRankTitle(child.xpLevel),
        achievements,
        byteMessage,
      });
    }

    if (childDigests.length === 0) continue;

    const subject = `${childDigests[0].name}'s CodeQuest week - ${childDigests[0].lessonsCompleted} lessons, ${childDigests[0].xpEarned} XP!`;
    const html = await render(
      WeeklyDigestEmail({
        parentName: parent.name,
        children: childDigests,
        dashboardUrl: `${baseUrl}/parent/dashboard`,
      }),
    );

    batch.push({
      from: process.env.RESEND_FROM ?? "Byte from CodeQuest <byte@codequest.world>",
      to: parent.email,
      subject,
      html,
    });
  }

  if (batch.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const batchApi = (
    resend as unknown as { batch?: { send: (payload: unknown[]) => Promise<unknown> } }
  ).batch;

  if (batchApi?.send) {
    await batchApi.send(batch);
  } else {
    for (const email of batch) {
      // eslint-disable-next-line no-await-in-loop
      await resend.emails.send(email);
    }
  }

  return NextResponse.json({ ok: true, sent: batch.length });
}
