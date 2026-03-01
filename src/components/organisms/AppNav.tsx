"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  parentName?: string | null;
};

const links = [
  { href: "/parent/dashboard", label: "Parent Dashboard" },
  { href: "/dashboard", label: "Child Dashboard" },
  { href: "/placement", label: "Placement" },
];

export function AppNav({ parentName }: Props) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col justify-between border-r border-cq-border bg-cq-bg-elevated px-6 py-8">
      <div className="space-y-10">
        <Link href="/" className="font-display text-base uppercase tracking-[0.35em] text-white">
          CodeQuest
        </Link>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-full px-4 py-2 text-sm ${
                pathname.startsWith(link.href)
                  ? "bg-cq-primary text-white"
                  : "text-cq-text-secondary hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="rounded-2xl border border-cq-border bg-cq-bg px-4 py-3 text-sm text-cq-text-secondary">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Parent</p>
        <p className="mt-1 text-white">{parentName ?? "CodeQuest Parent"}</p>
      </div>
    </aside>
  );
}
