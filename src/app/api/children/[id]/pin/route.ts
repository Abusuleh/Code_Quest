import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";

const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const child = await prisma.child.findFirst({
    where: { id: params.id, parentId: session.user.id },
  });

  if (!child) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (child.pinLockedUntil && child.pinLockedUntil > new Date()) {
    return NextResponse.json(
      { error: "PIN_LOCKED", lockedUntil: child.pinLockedUntil.toISOString() },
      { status: 423 },
    );
  }

  const payload = await request.json().catch(() => null);
  const pin = payload?.pin;
  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "INVALID_PIN" }, { status: 400 });
  }

  const valid = child.pinHash ? await comparePassword(pin, child.pinHash) : false;
  if (!valid) {
    const nextAttempts = (child.pinAttempts ?? 0) + 1;
    const shouldLock = nextAttempts >= MAX_ATTEMPTS;
    const lockedUntil = shouldLock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null;

    await prisma.child.update({
      where: { id: child.id },
      data: {
        pinAttempts: nextAttempts,
        pinLockedUntil: lockedUntil,
      },
    });

    if (shouldLock) {
      return NextResponse.json(
        { error: "PIN_LOCKED", lockedUntil: lockedUntil?.toISOString() },
        { status: 423 },
      );
    }

    return NextResponse.json({ error: "INVALID_PIN" }, { status: 401 });
  }

  await prisma.child.update({
    where: { id: child.id },
    data: {
      pinAttempts: 0,
      pinLockedUntil: null,
    },
  });

  return NextResponse.json({ ok: true });
}
