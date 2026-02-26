export default function Home() {
  return (
    <main className="min-h-screen bg-cq-bg-base text-cq-text-primary">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
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
        <div className="mt-10 flex items-center gap-4">
          <div className="h-2 w-32 rounded-full bg-cq-bg-overlay">
            <div className="h-2 w-10 rounded-full bg-cq-primary shadow-glow-primary" />
          </div>
          <span className="text-sm text-cq-text-secondary">M1 setup</span>
        </div>
      </section>
    </main>
  );
}
