import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(108,63,232,0.18),_rgba(10,10,15,1)_70%)] px-6 py-16 text-cq-text-primary">
      <div className="mx-auto flex w-full max-w-[440px] flex-col items-center gap-8">
        <Link href="/" className="font-display text-base uppercase tracking-[0.35em] text-white">
          CodeQuest
        </Link>
        <section className="w-full rounded-3xl border border-cq-border bg-cq-bg-elevated/70 p-8 shadow-glow-primary">
          {children}
        </section>
      </div>
    </main>
  );
}
