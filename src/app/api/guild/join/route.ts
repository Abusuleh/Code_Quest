import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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
  if (child.guildId) {
    return NextResponse.json({ error: "ALREADY_IN_GUILD" }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const guildId = payload?.guildId as string | undefined;
  if (!guildId) {
    return NextResponse.json({ error: "INVALID_GUILD" }, { status: 400 });
  }

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    select: { id: true, isOpen: true, maxMembers: true, _count: { select: { members: true } } },
  });
  if (!guild) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  if (!guild.isOpen) {
    return NextResponse.json({ error: "GUILD_CLOSED" }, { status: 403 });
  }
  if (guild._count.members >= guild.maxMembers) {
    return NextResponse.json({ error: "GUILD_FULL" }, { status: 409 });
  }

  await prisma.child.update({
    where: { id: session.activeChildId },
    data: { guildId: guild.id },
  });

  return NextResponse.json({ joined: true });
}
