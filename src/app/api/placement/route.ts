import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const phase = Number(payload?.phase);
  const answers = payload?.answers ?? [];
  if (!phase || Number.isNaN(phase)) {
    return NextResponse.json({ error: "INVALID_PHASE" }, { status: 400 });
  }

  const existing = await prisma.placementResult.findFirst({
    where: { childId: session.activeChildId },
  });
  if (existing) {
    return NextResponse.json({ error: "ALREADY_PLACED" }, { status: 409 });
  }

  await prisma.$transaction([
    prisma.placementResult.create({
      data: {
        childId: session.activeChildId,
        answers,
        phase,
      },
    }),
    prisma.child.update({
      where: { id: session.activeChildId },
      data: { currentPhase: phase },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const existing = await prisma.placementResult.findFirst({
    where: { childId: session.activeChildId },
  });

  return NextResponse.json({ exists: Boolean(existing) });
}
