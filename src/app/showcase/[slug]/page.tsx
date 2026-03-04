import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShowcaseDetailClient } from "./ShowcaseDetailClient";

export default async function ShowcaseDetailPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const project = await prisma.project.findUnique({
    where: { gallerySlug: params.slug },
    select: {
      id: true,
      title: true,
      description: true,
      embedUrl: true,
      upvotes: true,
      phase: true,
      code: true,
      child: {
        select: {
          displayName: true,
          username: true,
        },
      },
      lesson: {
        select: {
          title: true,
          module: { select: { title: true } },
        },
      },
    },
  });

  if (!project) {
    return (
      <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
        <p>Project not found.</p>
      </main>
    );
  }

  const code = (project.code as { html?: string; css?: string; js?: string } | null) ?? {
    html: "",
    css: "",
    js: "",
  };

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-12 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/showcase"
          className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary"
        >
          ← Back to Showcase
        </Link>
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">
            Forge Build
          </p>
          <h1 className="text-3xl font-heading text-white">{project.title}</h1>
          <p className="text-sm text-cq-text-secondary">
            {project.child.displayName ?? project.child.username ?? "Forge Builder"} ·{" "}
            {project.lesson?.title ?? "Forge Project"}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-cq-border bg-white p-4 shadow-panel">
            {project.embedUrl ? (
              <iframe
                title={project.title}
                src={project.embedUrl}
                className="h-[420px] w-full rounded-2xl border border-cq-border bg-white"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-cq-text-secondary">
                Preview unavailable
              </div>
            )}
          </section>

          <ShowcaseDetailClient
            slug={params.slug}
            initialUpvotes={project.upvotes}
            canUpvote={Boolean(session?.user?.id)}
            source={{
              html: code.html ?? "",
              css: code.css ?? "",
              js: code.js ?? "",
            }}
          />
        </div>
      </div>
    </main>
  );
}
