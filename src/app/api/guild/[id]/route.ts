import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const guild = await prisma.guild.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      emblem: true,
      description: true,
      xpTotal: true,
      trialWins: true,
      isOpen: true,
      maxMembers: true,
      createdAt: true,
      members: {
        select: {
          username: true,
          xpTotal: true,
          xpLevel: true,
        },
      },
    },
  });

  if (!guild) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ guild });
}
