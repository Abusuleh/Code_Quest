import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/atoms/Avatar";
import { GalleryDetailClient } from "./GalleryDetailClient";

export default async function GalleryDetailPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { gallerySlug: params.slug },
    select: {
      id: true,
      title: true,
      description: true,
      phase: true,
      embedUrl: true,
      upvotes: true,
      lessonId: true,
      lesson: {
        select: {
          title: true,
          xpReward: true,
          module: {
            select: {
              title: true,
              phase: { select: { title: true, number: true } },
            },
          },
        },
      },
      child: {
        select: {
          displayName: true,
          username: true,
          avatarConfig: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-16 text-cq-text-primary">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Gallery</p>
            <h1 className="mt-2 text-3xl font-heading text-white">{project.title}</h1>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Phase {project.phase} • {project.lesson?.module.title ?? "Spark Zone"}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-cq-border bg-cq-bg-elevated px-4 py-3">
            <Avatar
              config={
                (project.child.avatarConfig as { variant?: string; label?: string }) ?? undefined
              }
              fallback={project.child.displayName ?? project.child.username ?? "P"}
              size={48}
            />
            <div>
              <p className="text-sm text-white">
                {project.child.displayName ?? project.child.username ?? "Pixel Pioneer"}
              </p>
              <p className="text-xs text-cq-text-secondary">Spark Zone Creator</p>
            </div>
          </div>
        </header>

        <div className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-4">
          <iframe
            title={project.title}
            src={project.embedUrl ?? ""}
            className="h-[420px] w-full rounded-2xl border border-cq-border bg-white"
            sandbox="allow-scripts"
          />
        </div>

        <GalleryDetailClient
          slug={params.slug}
          initialUpvotes={project.upvotes}
          canUpvote={Boolean(session?.user?.id)}
        />

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
          <h2 className="text-lg font-heading text-white">Lesson Context</h2>
          <p className="mt-2 text-sm text-cq-text-secondary">
            {project.lesson?.title ?? "Spark Zone Project"}
          </p>
          <p className="mt-1 text-xs text-cq-text-secondary">
            {project.lesson?.module.phase.title ?? "Spark Zone"} • {project.lesson?.xpReward ?? 0}{" "}
            XP
          </p>
          {project.lessonId ? (
            <Link
              href={`/learn/${project.lessonId}`}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-cq-cyan/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cq-cyan"
            >
              Try this lesson
            </Link>
          ) : null}
        </section>
      </div>
    </main>
  );
}
