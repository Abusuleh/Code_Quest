import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.activeChildId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const child = await prisma.child.findUnique({
    where: { id: session.activeChildId },
    select: { guildId: true, activeSessionToken: true },
  });
  if (!child?.activeSessionToken || child.activeSessionToken !== session.activeChildSessionToken) {
    return NextResponse.json({ reason: "SESSION_DISPLACED" }, { status: 409 });
  }

  if (!child.guildId) {
    return NextResponse.json({ left: true });
  }

  await prisma.child.update({
    where: { id: session.activeChildId },
    data: { guildId: null },
  });

  return NextResponse.json({ left: true });
}
