"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ForgeGraduationClient({
  childName,
  xpTotal,
}: {
  childName: string;
  xpTotal: number;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [showEmbers, setShowEmbers] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [xpCount, setXpCount] = useState(0);

  const message = "You forged it. Fifty web builds. You are officially... a Forge Flame Master.";

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowMessage(true), 2000),
      setTimeout(() => setShowBadge(true), 5000),
      setTimeout(() => setShowGlow(true), 8000),
      setTimeout(() => setShowEmbers(true), 10000),
      setTimeout(() => setShowCtas(true), 14000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!showMessage) return;
    let index = 0;
    const words = message.split(" ");
    const interval = setInterval(() => {
      index += 1;
      setTypedMessage(words.slice(0, index).join(" "));
      if (index >= words.length) clearInterval(interval);
    }, 110);
    return () => clearInterval(interval);
  }, [showMessage]);

  useEffect(() => {
    if (!showGlow) return;
    const start = performance.now();
    const duration = 2000;
    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setXpCount(Math.floor(progress * xpTotal));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [showGlow, xpTotal]);

  const embers = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        size: 4 + Math.random() * 4,
      })),
    [],
  );

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cq-bg px-6 text-cq-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,153,74,0.3)_0,_transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />

      {showEmbers ? (
        <div className="pointer-events-none absolute inset-0">
          {embers.map((ember) => (
            <span
              key={ember.id}
              className="absolute bottom-0 rounded-full bg-cq-orange/80 blur-[1px] animate-ember"
              style={{
                left: `${ember.left}%`,
                width: `${ember.size}px`,
                height: `${ember.size}px`,
                animationDelay: `${ember.delay}s`,
                animationDuration: `${ember.duration}s`,
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 200, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="flex h-32 w-32 items-center justify-center rounded-full border border-cq-orange/60 bg-cq-bg-elevated text-4xl text-cq-orange shadow-glow-gold"
        >
          FG
        </motion.div>

        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-cq-text-secondary">The Forge</p>
        <h1 className="mt-2 text-3xl font-heading text-white">{childName}&apos;s Flame</h1>

        {showMessage ? (
          <p className="mt-6 max-w-2xl text-lg text-cq-text-secondary">{typedMessage}</p>
        ) : null}

        {showBadge ? (
          <motion.div
            initial={{ y: -220, rotate: 0, opacity: 0 }}
            animate={{ y: 0, rotate: 360, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
            className="mt-8 flex h-40 w-40 items-center justify-center rounded-[28px] border-4 border-cq-orange bg-gradient-to-br from-cq-orange/30 to-cq-bg-elevated text-center text-sm text-cq-orange shadow-glow-gold"
          >
            Forge Flame
          </motion.div>
        ) : null}

        {showGlow ? (
          <div className="mt-6 rounded-2xl border border-cq-gold/60 bg-cq-bg-elevated px-6 py-4 text-center text-sm text-cq-gold shadow-glow-gold">
            Total XP: {xpCount}
          </div>
        ) : null}

        {showCtas ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/showcase"
              className="rounded-full border border-cq-orange/60 px-6 py-3 text-sm text-cq-orange"
            >
              Visit the Showcase
            </Link>
            <button
              type="button"
              className="rounded-full bg-cq-orange px-6 py-3 text-sm font-semibold text-black shadow-glow-gold"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Share My Achievement
            </button>
            <span className="rounded-full border border-cq-border px-6 py-3 text-sm text-cq-text-secondary">
              Developer Realm (Coming Soon)
            </span>
          </div>
        ) : null}
      </div>
    </main>
  );
}
