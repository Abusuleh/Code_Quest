"use client";

import { useState } from "react";

type SourceCode = {
  html: string;
  css: string;
  js: string;
};

export function ShowcaseDetailClient({
  slug,
  initialUpvotes,
  canUpvote,
  source,
}: {
  slug: string;
  initialUpvotes: number;
  canUpvote: boolean;
  source: SourceCode;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [voting, setVoting] = useState(false);
  const [tab, setTab] = useState<"html" | "css" | "js">("html");

  const handleUpvote = async () => {
    if (!canUpvote || voting) {
      window.location.href = "/auth/login";
      return;
    }
    setVoting(true);
    try {
      const res = await fetch(`/api/showcase/${slug}/upvote`, { method: "POST" });
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

  const sourceValue = tab === "html" ? source.html : tab === "css" ? source.css : source.js;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-3xl border border-cq-border bg-cq-bg-elevated p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Applause</p>
          <p className="mt-2 text-2xl font-heading text-white">{upvotes} upvotes</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleUpvote}
            className="inline-flex items-center justify-center rounded-full bg-cq-orange px-5 py-2 text-xs uppercase tracking-[0.3em] text-black shadow-glow-gold"
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

      <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-6">
        <div className="flex items-center gap-3 border-b border-cq-border pb-4">
          {(["html", "css", "js"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] ${
                tab === value
                  ? "bg-cq-orange text-black"
                  : "border border-cq-border text-cq-text-secondary"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <pre className="mt-4 max-h-[360px] overflow-auto rounded-2xl bg-cq-bg-panel p-4 text-xs text-cq-text-secondary">
          <code>{sourceValue || "// No code provided yet."}</code>
        </pre>
      </section>
    </div>
  );
}
