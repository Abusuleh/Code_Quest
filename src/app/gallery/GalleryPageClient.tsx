"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/atoms/Avatar";

type ProjectItem = {
  id: string;
  title: string;
  phase: number;
  gallerySlug: string | null;
  embedUrl: string | null;
  upvotes: number;
  publishedAt: string | Date | null;
  child: {
    username: string | null;
    displayName: string | null;
    avatarConfig: unknown;
  };
  lesson: {
    title: string;
    module: {
      title: string;
      phase: { title: string; number: number };
    };
  } | null;
};

const filters = [
  { key: "all", label: "All" },
  { key: "phase1", label: "Phase 1" },
  { key: "upvoted", label: "Most Upvoted" },
  { key: "newest", label: "Newest" },
];

export function GalleryPageClient({
  initialProjects,
  initialCursor,
}: {
  initialProjects: ProjectItem[];
  initialCursor: string | null;
}) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [filter, setFilter] = useState("newest");
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const activeFilter = useMemo(() => (filter === "all" ? "newest" : filter), [filter]);

  useEffect(() => {
    if (filter === "newest") {
      setProjects(initialProjects);
      setCursor(initialCursor);
      return;
    }
    setLoading(true);
    fetch(`/api/gallery?filter=${activeFilter}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data.projects ?? []);
        setCursor(data.nextCursor ?? null);
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [activeFilter, filter, initialCursor, initialProjects]);

  useEffect(() => {
    if (!loaderRef.current || loading || !cursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setLoading(true);
        fetch(`/api/gallery?filter=${activeFilter}&cursor=${cursor}&limit=12`)
          .then((res) => res.json())
          .then((data) => {
            setProjects((prev) => [...prev, ...(data.projects ?? [])]);
            setCursor(data.nextCursor ?? null);
          })
          .catch(() => null)
          .finally(() => setLoading(false));
      },
      { rootMargin: "200px" },
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [activeFilter, cursor, loading]);

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-16 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Gallery</p>
          <h1 className="text-4xl font-heading text-white">CodeQuest Gallery</h1>
          <p className="text-sm text-cq-text-secondary">
            Explore the worlds built by Pixel Pioneers across the Spark Zone.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                filter === item.key
                  ? "border-cq-cyan bg-cq-cyan text-black"
                  : "border-cq-border text-cq-text-secondary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/gallery/${project.gallerySlug ?? ""}`}
              className="group rounded-3xl border border-cq-border bg-cq-bg-elevated p-4 shadow-panel transition hover:border-cq-cyan/60 hover:shadow-glow-cyan"
            >
              <div className="relative h-44 overflow-hidden rounded-2xl border border-cq-border bg-white">
                {project.embedUrl ? (
                  <iframe
                    title={project.title}
                    src={project.embedUrl}
                    className="h-full w-full origin-top-left scale-[0.4]"
                    sandbox="allow-scripts"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-cq-text-secondary">
                    Preview unavailable
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-cq-text-secondary">
                  <span>Phase {project.phase}</span>
                  <span>{project.upvotes} upvotes</span>
                </div>
                <h3 className="text-lg font-heading text-white">{project.title}</h3>
                <div className="flex items-center gap-3 text-xs text-cq-text-secondary">
                  <Avatar
                    config={
                      (project.child.avatarConfig as { variant?: string; label?: string }) ??
                      undefined
                    }
                    fallback={project.child.displayName ?? project.child.username ?? "P"}
                    size={32}
                  />
                  <div>
                    <p className="text-sm text-white">
                      {project.child.displayName ?? project.child.username ?? "Pixel Pioneer"}
                    </p>
                    <p className="text-[11px] text-cq-text-secondary">
                      {project.lesson?.title ?? "Spark Zone Project"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <div ref={loaderRef} className="h-10" />
        {loading ? (
          <p className="text-center text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
            Loading more...
          </p>
        ) : null}
      </div>
    </main>
  );
}
