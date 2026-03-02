import { prisma } from "@/lib/prisma";
import { GalleryPageClient } from "./GalleryPageClient";

export default async function GalleryPage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ createdAt: "desc" }],
    take: 12,
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

  const nextCursor = projects.length === 12 ? projects[projects.length - 1]?.id : null;

  return <GalleryPageClient initialProjects={projects} initialCursor={nextCursor} />;
}
