import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { awardXP } from "@/lib/xp-engine";
import { FORGE_TRIAL_SEEDS } from "@/data/forge-trials";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getWeekStart(date: Date) {
  const day = date.getUTCDay();
  const diff = (day + 6) % 7;
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - diff);
  start.setUTCHours(0, 0, 0, 0);
  return start;
}

function getWeekIndex(weekStart: Date) {
  const year = weekStart.getUTCFullYear();
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const jan1Day = jan1.getUTCDay();
  const offset = (jan1Day + 6) % 7;
  const firstMonday = new Date(Date.UTC(year, 0, 1 - offset));
  return Math.floor((weekStart.getTime() - firstMonday.getTime()) / ONE_WEEK_MS);
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret") ?? request.headers.get("cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const lastWeekStart = new Date(currentWeekStart.getTime() - ONE_WEEK_MS);

  const lastTrial = await prisma.forgeTrial.findUnique({
    where: { weekStart_phase: { weekStart: lastWeekStart, phase: 2 } },
    select: { id: true },
  });

  if (lastTrial) {
    const entries = await prisma.forgeTrialEntry.findMany({
      where: { trialId: lastTrial.id },
      orderBy: [{ score: "desc" }, { submittedAt: "asc" }],
      select: { id: true, childId: true, xpAwarded: true },
    });

    const bonusTable = [500, 300, 150];
    for (let index = 0; index < entries.length; index += 1) {
      const entry = entries[index];
      if (entry.xpAwarded > 0) continue;
      const bonus = index < bonusTable.length ? bonusTable[index] : 0;
      const totalAward = 100 + bonus;

      await awardXP(
        entry.childId,
        "FORGE_TRIAL_WIN",
        { trialId: lastTrial.id, rank: index + 1 },
        { amountOverride: totalAward },
      );

      await prisma.forgeTrialEntry.update({
        where: { id: entry.id },
        data: { xpAwarded: totalAward },
      });
    }
  }

  const existingCurrent = await prisma.forgeTrial.findUnique({
    where: { weekStart_phase: { weekStart: currentWeekStart, phase: 2 } },
    select: { id: true },
  });

  if (!existingCurrent) {
    const seedIndex = getWeekIndex(currentWeekStart) % FORGE_TRIAL_SEEDS.length;
    const seed = FORGE_TRIAL_SEEDS[seedIndex];
    await prisma.forgeTrial.create({
      data: {
        weekStart: currentWeekStart,
        title: seed.title,
        description: seed.description,
        challenge: seed.challenge,
        phase: 2,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
