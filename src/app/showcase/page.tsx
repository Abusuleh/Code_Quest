import { prisma } from "@/lib/prisma";
import { ShowcasePageClient } from "./ShowcasePageClient";

export default async function ShowcasePage() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true, phase: 3 },
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

  return <ShowcasePageClient initialProjects={projects} initialCursor={nextCursor} />;
}
