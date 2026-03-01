import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LessonPlayerClient } from "./LessonPlayerClient";

type LessonContent = {
  objective?: string;
  hint?: string;
  successCondition?: string;
  starterXml?: string;
};

export default async function LessonPlayerPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  if (!session.activeChildId) {
    redirect("/quest/1");
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    select: {
      id: true,
      title: true,
      type: true,
      content: true,
      xpReward: true,
      gemReward: true,
      estimatedMin: true,
      order: true,
      starterCode: true,
      moduleId: true,
      module: {
        select: {
          title: true,
          order: true,
          phase: {
            select: {
              number: true,
              title: true,
              kingdom: true,
              colorHex: true,
            },
          },
        },
      },
    },
  });

  if (!lesson) {
    redirect("/quest/1");
  }

  const moduleLessons = await prisma.lesson.findMany({
    where: { moduleId: lesson.moduleId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const lessonIds = moduleLessons.map((entry) => entry.id);

  const [child, progress] = await prisma.$transaction([
    prisma.child.findUnique({
      where: { id: session.activeChildId },
      select: { gems: true },
    }),
    prisma.progress.findMany({
      where: {
        childId: session.activeChildId,
        lessonId: { in: lessonIds },
      },
      select: { lessonId: true, status: true },
    }),
  ]);

  const progressMap = new Map(progress.map((entry) => [entry.lessonId, entry.status]));
  const progressDots = moduleLessons.map((entry) => ({
    id: entry.id,
    status: (progressMap.get(entry.id) ?? "NOT_STARTED") as
      | "NOT_STARTED"
      | "IN_PROGRESS"
      | "COMPLETED"
      | "MASTERED",
  }));

  const nextLesson = await prisma.lesson.findFirst({
    where: { moduleId: lesson.moduleId, order: { gt: lesson.order } },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  const content = lesson.content as LessonContent;
  const starterCode = (lesson.starterCode as { xml?: string } | null) ?? null;

  return (
    <LessonPlayerClient
      lesson={{
        id: lesson.id,
        title: lesson.title,
        type: lesson.type,
        content,
        xpReward: lesson.xpReward,
        gemReward: lesson.gemReward,
        estimatedMin: lesson.estimatedMin,
        order: lesson.order,
        starterCode,
        module: lesson.module,
      }}
      gems={child?.gems ?? 0}
      progressDots={progressDots}
      nextLessonId={nextLesson?.id ?? null}
    />
  );
}
