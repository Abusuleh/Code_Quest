import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const lessonId = payload?.lessonId as string | undefined;
  const code = payload?.code as string | undefined;

  if (!lessonId || !code) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
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
    return NextResponse.json({ ok: true });
  }

  await prisma.progress.upsert({
    where: {
      childId_lessonId: {
        childId: session.activeChildId,
        lessonId,
      },
    },
    update: {
      status: "IN_PROGRESS",
      code,
      attempts: { increment: 1 },
    },
    create: {
      childId: session.activeChildId,
      lessonId,
      status: "IN_PROGRESS",
      code,
      attempts: 1,
    },
  });

  return NextResponse.json({ ok: true });
}
