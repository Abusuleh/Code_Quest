import type { ReactNode } from "react";
import { NavBar } from "@/components/organisms/NavBar";

type Props = {
  children: ReactNode;
};

export function MarketingLayout({ children }: Props) {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-cq-bg-base text-cq-text-primary">
      <NavBar />
      <main>{children}</main>
      <footer className="border-t border-cq-border bg-cq-bg-base">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-cq-text-secondary md:flex-row">
          <div className="font-display tracking-[0.2em]">
            <span className="text-cq-cyan">CODE</span>
            <span className="text-cq-text-primary">QUEST</span>
          </div>
          <p>© {year} CodeQuest. Built for the next generation of developers.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-cq-text-primary">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-cq-text-primary">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
