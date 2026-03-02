"use client";

import { useState } from "react";

export function GalleryDetailClient({
  slug,
  initialUpvotes,
  canUpvote,
}: {
  slug: string;
  initialUpvotes: number;
  canUpvote: boolean;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voting, setVoting] = useState(false);

  const handleUpvote = async () => {
    if (!canUpvote || voting) {
      window.location.href = "/auth/login";
      return;
    }
    setVoting(true);
    try {
      const res = await fetch(`/api/gallery/${slug}/upvote`, { method: "POST" });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { alreadyVoted?: boolean } | null;
        if (!data?.alreadyVoted) {
          setUpvotes((prev) => prev + 1);
        }
      }
    } finally {
      setVoting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Applause</p>
        <p className="mt-2 text-2xl font-heading text-white">{upvotes} upvotes</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleUpvote}
          className="inline-flex items-center justify-center rounded-full bg-cq-cyan px-5 py-2 text-xs uppercase tracking-[0.3em] text-black shadow-glow-cyan"
          disabled={voting}
        >
          Upvote
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center justify-center rounded-full border border-cq-gold/60 px-5 py-2 text-xs uppercase tracking-[0.3em] text-cq-gold"
        >
          Share
        </button>
      </div>
    </section>
  );
}
