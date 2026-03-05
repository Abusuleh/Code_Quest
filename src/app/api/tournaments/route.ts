import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const title = payload?.title as string | undefined;
  const description = payload?.description as string | undefined;
  const startsAt = payload?.startsAt as string | undefined;
  const endsAt = payload?.endsAt as string | undefined;

  if (!title || !description || !startsAt || !endsAt) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const tournament = await prisma.tournament.create({
    data: {
      title,
      description,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      isActive: false,
    },
  });

  return NextResponse.json({ tournament });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      startsAt: true,
      endsAt: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ tournaments });
}
