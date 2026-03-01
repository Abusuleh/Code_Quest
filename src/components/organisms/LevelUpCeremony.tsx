"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Props = {
  open: boolean;
  level: number;
  rankTitle: string;
  onClose: () => void;
};

export function LevelUpCeremony({ open, level, rankTitle, onClose }: Props) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-6"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-3xl border border-cq-border bg-cq-bg-elevated p-8 text-center shadow-glow-primary"
            initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              className="absolute inset-0 -z-10 flex items-center justify-center"
              aria-hidden
            >
              {Array.from({ length: 20 }).map((_, index) => (
                <span
                  key={`particle-${index}`}
                  className="particle-burst"
                  style={{
                    ["--particle-angle" as string]: `${(360 / 20) * index}deg`,
                  }}
                />
              ))}
            </motion.div>
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Level Up</p>
            <motion.h2
              className="mt-3 text-3xl font-heading text-white"
              initial={reduceMotion ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
            >
              {rankTitle}
            </motion.h2>
            <motion.p
              className="mt-4 text-5xl font-heading text-cq-gold"
              initial={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Level {level}
            </motion.p>
            <motion.button
              type="button"
              className="mt-6 w-full rounded-full border border-cq-border px-6 py-2 text-sm text-cq-text-secondary"
              onClick={onClose}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 1.5 }}
            >
              TAP TO CONTINUE
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
