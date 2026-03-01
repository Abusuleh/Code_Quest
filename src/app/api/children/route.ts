import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { childCreateSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (
    session.user.role !== "PARENT" &&
    session.user.role !== "EDUCATOR" &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = childCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const dob = new Date(parsed.data.dateOfBirth);
  if (Number.isNaN(dob.getTime())) {
    return NextResponse.json({ error: "INVALID_DOB" }, { status: 400 });
  }

  const existingChildren = await prisma.child.count({
    where: { parentId: session.user.id },
  });
  if (existingChildren >= 5) {
    return NextResponse.json({ error: "MAX_CHILDREN" }, { status: 400 });
  }

  try {
    const pinHash = await hashPassword(parsed.data.pin);
    const child = await prisma.child.create({
      data: {
        parentId: session.user.id,
        username: parsed.data.username,
        displayName: parsed.data.displayName,
        dateOfBirth: dob,
        avatarConfig: parsed.data.avatarConfig as Prisma.InputJsonValue,
        pinHash,
      },
      select: {
        id: true,
        displayName: true,
        username: true,
        currentPhase: true,
        xpTotal: true,
        avatarConfig: true,
      },
    });
    return NextResponse.json({ child }, { status: 201 });
  } catch (error) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === "P2002") {
      return NextResponse.json({ error: "USERNAME_TAKEN" }, { status: 409 });
    }
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (
    session.user.role !== "PARENT" &&
    session.user.role !== "EDUCATOR" &&
    session.user.role !== "ADMIN"
  ) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const children = await prisma.child.findMany({
    where: { parentId: session.user.id },
    select: {
      id: true,
      displayName: true,
      username: true,
      currentPhase: true,
      xpTotal: true,
      avatarConfig: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ children });
}
