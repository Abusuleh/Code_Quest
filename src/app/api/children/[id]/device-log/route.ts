import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const fingerprint = payload?.fingerprint as string | undefined;
  if (!fingerprint) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  const child = await prisma.child.findFirst({
    where: { id: params.id, parentId: session.user.id },
    select: { id: true, deviceFingerprints: true },
  });

  if (!child) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const existing = Array.isArray(child.deviceFingerprints)
    ? (child.deviceFingerprints as string[])
    : [];
  const updated = existing.includes(fingerprint) ? existing : [...existing, fingerprint];

  await prisma.$transaction([
    prisma.deviceLog.create({
      data: {
        childId: child.id,
        fingerprint,
      },
    }),
    prisma.child.update({
      where: { id: child.id },
      data: {
        deviceFingerprints: updated as Prisma.InputJsonValue,
        deviceFpUpdatedAt: new Date(),
      },
    }),
  ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const distinctFingerprints = await prisma.deviceLog.findMany({
    where: { childId: child.id, seenAt: { gte: thirtyDaysAgo } },
    select: { fingerprint: true },
    distinct: ["fingerprint"],
  });

  return NextResponse.json({
    ok: true,
    fingerprintCount: distinctFingerprints.length,
    flagged: distinctFingerprints.length > 4,
  });
}
