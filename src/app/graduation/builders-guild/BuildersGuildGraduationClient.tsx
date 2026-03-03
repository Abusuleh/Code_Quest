"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export function BuildersGuildGraduationClient({
  childName,
  xpTotal,
}: {
  childName: string;
  xpTotal: number;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showGlow, setShowGlow] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCtas, setShowCtas] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [xpCount, setXpCount] = useState(0);

  const message =
    "You built it. Fifty Python programs. You are officially... a Builder's Guild Champion.";

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowMessage(true), 2000),
      setTimeout(() => setShowBadge(true), 4000),
      setTimeout(() => setShowGlow(true), 6500),
      setTimeout(() => setShowConfetti(true), 8500),
      setTimeout(() => setShowCtas(true), 11000),
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

  const confettiDots = useMemo(() => Array.from({ length: 36 }), []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cq-bg px-6 text-cq-text-primary">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(176,107,255,0.3)_0,_transparent_50%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.14)_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 200, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="flex h-32 w-32 items-center justify-center rounded-full border border-cq-violet/60 bg-cq-bg-elevated text-4xl text-cq-violet shadow-glow-primary"
        >
          NV
        </motion.div>

        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-cq-text-secondary">
          Builder&apos;s Guild
        </p>
        <h1 className="mt-2 text-3xl font-heading text-white">{childName}&apos;s Emblem</h1>

        {showMessage ? (
          <p className="mt-6 max-w-2xl text-lg text-cq-text-secondary">{typedMessage}</p>
        ) : null}

        {showBadge ? (
          <motion.div
            initial={{ y: -220, rotate: 0, opacity: 0 }}
            animate={{ y: 0, rotate: 360, opacity: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
            className="mt-8 flex h-40 w-40 items-center justify-center rounded-[32px] border-4 border-cq-violet bg-gradient-to-br from-cq-violet/30 to-cq-bg-elevated text-center text-sm text-cq-violet shadow-glow-primary"
          >
            Builder&apos;s Emblem
          </motion.div>
        ) : null}

        {showGlow ? (
          <div className="mt-6 rounded-2xl border border-cq-gold/60 bg-cq-bg-elevated px-6 py-4 text-center text-sm text-cq-gold shadow-glow-gold">
            Total XP: {xpCount}
          </div>
        ) : null}

        {showConfetti ? (
          <div className="pointer-events-none absolute inset-0">
            {confettiDots.map((_, index) => (
              <motion.span
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={`absolute h-2 w-2 rounded-full ${
                  index % 2 === 0 ? "bg-cq-violet" : "bg-cq-gold"
                }`}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, 240 + Math.random() * 200],
                  x: [0, (Math.random() - 0.5) * 400],
                  scale: [0, 1, 0.6],
                }}
                transition={{ duration: 2.2, delay: Math.random() * 0.2 }}
                style={{ left: "50%", top: "35%" }}
              />
            ))}
          </div>
        ) : null}

        {showCtas ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/quest/3"
              className="rounded-full border border-cq-violet/60 px-6 py-3 text-sm text-cq-violet"
            >
              Enter the Forge (Coming Soon)
            </Link>
            <button
              type="button"
              className="rounded-full bg-cq-violet px-6 py-3 text-sm font-semibold text-white shadow-glow-primary"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Share My Achievement
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
