import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const GUILD_EMBLEMS = ["⚡", "🔥", "🌊", "🏔️", "🌿", "⭐", "🎯", "🛡️"];

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
  const name = (payload?.name as string | undefined)?.trim();
  const description = (payload?.description as string | undefined)?.trim() ?? null;
  const emblem = (payload?.emblem as string | undefined) ?? "⚡";
  const isOpen = payload?.isOpen !== false;

  if (!name || name.length > 30) {
    return NextResponse.json({ error: "INVALID_NAME" }, { status: 400 });
  }
  if (!GUILD_EMBLEMS.includes(emblem)) {
    return NextResponse.json({ error: "INVALID_EMBLEM" }, { status: 400 });
  }

  const guild = await prisma.guild.create({
    data: {
      name,
      emblem,
      description,
      createdById: session.activeChildId,
      isOpen,
      members: {
        connect: { id: session.activeChildId },
      },
    },
  });

  await prisma.child.update({
    where: { id: session.activeChildId },
    data: { guildId: guild.id },
  });

  return NextResponse.json({ guildId: guild.id });
}
