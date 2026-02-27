"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function RewardsPreview() {
  const reduced = useReducedMotion();
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLevel(7);
      setStreak(14);
      return;
    }
    let l = 1;
    let s = 0;
    const interval = setInterval(() => {
      l = Math.min(7, l + 1);
      s = Math.min(14, s + 2);
      setLevel(l);
      setStreak(s);
      if (l === 7 && s === 14) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl"
        initial={!reduced ? { opacity: 0, y: 20 } : false}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Every Line of Code Earns Its Reward
      </motion.h2>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          className="rounded-2xl border border-cq-border bg-cq-bg-panel p-6 shadow-panel"
          initial={!reduced ? { opacity: 0, y: 20 } : false}
          whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Level</p>
              <p className="mt-2 font-display text-3xl">Level {level}</p>
              <p className="text-sm text-cq-text-secondary">Apprentice</p>
            </div>
            <div className="rounded-full border border-cq-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-cq-text-secondary">
              Badge
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-cq-text-secondary">
              <span>XP</span>
              <span>650 / 1000</span>
            </div>
            <div className="h-3 rounded-full bg-cq-bg-overlay">
              <div className="h-3 w-2/3 rounded-full bg-cq-gold shadow-glow-gold" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-cq-border bg-cq-bg-elevated p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Streak</p>
              <p className="mt-2 text-xl">{streak} Day Streak</p>
            </div>
            <span className="text-cq-gold">+200 XP</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            {["Loop Legend", "First Deploy", "Guild Champion"].map((badge) => (
              <div key={badge} className="rounded-lg border border-cq-border bg-cq-bg-elevated p-3">
                <div className="text-lg">*</div>
                <p className="mt-2 text-cq-text-secondary">{badge}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={!reduced ? { opacity: 0, y: 20 } : false}
          whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            {
              title: "XP & Levels",
              text: "Earn XP for every lesson and level up through 50 ranks from Cadet to Grand Developer.",
              icon: "XP",
            },
            {
              title: "Streak System",
              text: "Code every day, maintain your streak, unlock legendary rewards.",
              icon: "STK",
            },
            {
              title: "Skill Cards",
              text: "Collect 200+ cards that prove your mastery across the kingdoms.",
              icon: "CARD",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-cq-border bg-cq-bg-panel p-6"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full border border-cq-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-cq-text-secondary">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl">{item.title}</h3>
              </div>
              <p className="mt-3 text-sm text-cq-text-secondary">{item.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
