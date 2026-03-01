import { prisma } from "@/lib/prisma";

export async function processStreakOnLessonComplete(
  childId: string,
): Promise<{ streakCurrent: number; streakLongest: number; streakBonus: number }> {
  const child = await prisma.child.findUniqueOrThrow({
    where: { id: childId },
    select: { streakCurrent: true, streakLongest: true, streakLastAt: true },
  });

  const now = new Date();
  const today = toCalendarDay(now);
  const lastDay = child.streakLastAt ? toCalendarDay(child.streakLastAt) : null;
  const dayDiff = lastDay ? daysBetween(lastDay, today) : null;

  let newStreak = child.streakCurrent;
  let streakBonus = 0;

  if (dayDiff === null || dayDiff > 1) {
    newStreak = 1;
  } else if (dayDiff === 1) {
    newStreak = child.streakCurrent + 1;
    streakBonus = 25;
  } else {
    newStreak = child.streakCurrent;
  }

  const newLongest = Math.max(newStreak, child.streakLongest);

  await prisma.child.update({
    where: { id: childId },
    data: {
      streakCurrent: newStreak,
      streakLongest: newLongest,
      streakLastAt: now,
    },
  });

  return { streakCurrent: newStreak, streakLongest: newLongest, streakBonus };
}

function toCalendarDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}
