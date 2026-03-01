import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type LessonProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "MASTERED";

export async function GET(_request: NextRequest, { params }: { params: { n: string } }) {
  const phaseNumber = Number(params.n);
  if (!phaseNumber || Number.isNaN(phaseNumber)) {
    return NextResponse.json({ error: "INVALID_PHASE" }, { status: 400 });
  }

  const phase = await prisma.phase.findUnique({
    where: { number: phaseNumber },
    select: {
      number: true,
      title: true,
      kingdom: true,
      mentor: true,
      colorHex: true,
      ageMin: true,
      ageMax: true,
      modules: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          description: true,
          order: true,
          weeks: true,
          skills: true,
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              type: true,
              xpReward: true,
              estimatedMin: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!phase) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    return NextResponse.json({ phase });
  }

  const lessonIds = phase.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
  const progress = await prisma.progress.findMany({
    where: {
      childId: session.activeChildId,
      lessonId: { in: lessonIds },
    },
    select: {
      lessonId: true,
      status: true,
    },
  });

  const statusMap = new Map<string, LessonProgressStatus>(
    progress.map((entry) => [entry.lessonId, entry.status as LessonProgressStatus]),
  );

  const phaseWithProgress = {
    ...phase,
    modules: phase.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        progressStatus: statusMap.get(lesson.id) ?? "NOT_STARTED",
      })),
    })),
  };

  return NextResponse.json({ phase: phaseWithProgress });
}
