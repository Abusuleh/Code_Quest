"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "@/components/organisms/NavBar.module.css";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Quest Preview", href: "#quest-preview" },
  { label: "The World", href: "#world-map" },
  { label: "Mentors", href: "#mentors" },
  { label: "Our Story", href: "/about" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition duration-300 ${
          scrolled ? "bg-[rgba(10,10,15,0.8)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="font-display text-xl tracking-[0.2em]">
            <span className="text-cq-cyan">CODE</span>
            <span className="text-cq-text-primary">QUEST</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`${styles.navLink} text-sm uppercase tracking-[0.2em] text-cq-text-secondary transition hover:text-cq-text-primary`}
              >
                {link.label}
              </a>
            ))}
            <Button
              size="md"
              className="text-sm"
              type="button"
              onClick={() => scrollTo("#waitlist")}
            >
              Join Waitlist
            </Button>
          </nav>

          <button
            type="button"
            aria-label="Open menu"
            className="md:hidden"
            onClick={() => setOpen(true)}
          >
            <span className="block h-0.5 w-6 bg-cq-text-primary" />
            <span className="mt-1 block h-0.5 w-6 bg-cq-text-primary" />
            <span className="mt-1 block h-0.5 w-6 bg-cq-text-primary" />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-cq-bg-panel p-6 transition duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg text-cq-text-primary">Menu</span>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            X
          </button>
        </div>
        <nav className="mt-10 flex flex-col gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-[0.2em] text-cq-text-secondary"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            size="md"
            className="w-full"
            type="button"
            onClick={() => {
              setOpen(false);
              scrollTo("#waitlist");
            }}
          >
            Join Waitlist
          </Button>
        </nav>
      </aside>
    </>
  );
}
