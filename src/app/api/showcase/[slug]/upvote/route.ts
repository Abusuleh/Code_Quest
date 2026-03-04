import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { gallerySlug: params.slug },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const voterId = session.activeChildId ?? session.user.id;

  try {
    await prisma.$transaction([
      prisma.projectUpvote.create({
        data: { projectId: project.id, userId: voterId },
      }),
      prisma.project.update({
        where: { id: project.id },
        data: { upvotes: { increment: 1 } },
      }),
    ]);
  } catch {
    return NextResponse.json({ ok: true, alreadyVoted: true });
  }

  return NextResponse.json({ ok: true });
}
