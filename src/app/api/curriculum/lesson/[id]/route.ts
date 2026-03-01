import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.id },
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
      solutionCode: true,
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
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const progress = await prisma.progress.findUnique({
    where: {
      childId_lessonId: {
        childId: session.activeChildId,
        lessonId: lesson.id,
      },
    },
  });

  return NextResponse.json({ lesson, progress });
}
