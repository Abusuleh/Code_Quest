import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "newest";
  const cursor = searchParams.get("cursor");
  const limit = Math.min(Number(searchParams.get("limit") ?? 12), 24);

  const where = filter === "phase1" ? { isPublished: true, phase: 1 } : { isPublished: true };

  const orderBy =
    filter === "upvoted"
      ? [{ upvotes: "desc" as const }, { createdAt: "desc" as const }]
      : [{ createdAt: "desc" as const }];

  const projects = await prisma.project.findMany({
    where,
    orderBy,
    take: limit,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : {}),
    select: {
      id: true,
      title: true,
      phase: true,
      gallerySlug: true,
      embedUrl: true,
      upvotes: true,
      publishedAt: true,
      child: {
        select: {
          username: true,
          displayName: true,
          avatarConfig: true,
        },
      },
      lesson: {
        select: {
          title: true,
          module: {
            select: {
              title: true,
              phase: { select: { title: true, number: true } },
            },
          },
        },
      },
    },
  });

  const nextCursor = projects.length === limit ? projects[projects.length - 1]?.id : null;

  return NextResponse.json({ projects, nextCursor });
}
