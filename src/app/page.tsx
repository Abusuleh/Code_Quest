export default function Home() {
  return (
    <main className="min-h-screen bg-cq-bg-base text-cq-text-primary">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-4 rounded-full border border-cq-border px-4 py-2 text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
          CodeQuest // M1 Bootstrap
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl">
          A world-class learning universe is loading.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-cq-text-secondary sm:text-lg">
          This build is in progress. Landing experience, mentors, and the full Spark Zone curriculum
          arrive in the next milestones.
        </p>

        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="rounded-lg border border-cq-border bg-cq-bg-panel p-6 shadow-panel">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Status</p>
            <h2 className="mt-3 font-heading text-xl">M1 Complete</h2>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Project bootstrap, tooling, and deployment pipeline are ready.
            </p>
          </div>
          <div className="rounded-lg border border-cq-border bg-cq-bg-panel p-6 shadow-panel">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Awaiting</p>
            <h2 className="mt-3 font-heading text-xl">Founder Review</h2>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Approval required before entering M2: Landing Page Live.
            </p>
          </div>
          <div className="rounded-lg border border-cq-border bg-cq-bg-panel p-6 shadow-panel">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Next</p>
            <h2 className="mt-3 font-heading text-xl">Launchpad</h2>
            <p className="mt-2 text-sm text-cq-text-secondary">
              Animated hero, world map, mentors, and waitlist capture.
            </p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <div className="h-2 w-40 rounded-full bg-cq-bg-overlay">
            <div className="h-2 w-12 rounded-full bg-cq-primary shadow-glow-primary" />
          </div>
          <span className="text-sm text-cq-text-secondary">M1 setup</span>
        </div>
      </section>
    </main>
  );
}
