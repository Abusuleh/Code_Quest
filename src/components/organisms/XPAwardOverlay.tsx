"use client";

import { AnimatePresence, motion } from "framer-motion";

type Award = {
  id: string;
  amount: number;
  label?: string;
  x?: number;
  y?: number;
  isStreak?: boolean;
};

type Props = {
  awards: Award[];
};

export function XPAwardOverlay({ awards }: Props) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[70]">
      <AnimatePresence>
        {awards.map((award) => (
          <motion.div
            key={award.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-cq-bg-elevated/80 px-4 py-2 text-sm text-cq-gold shadow-glow-primary"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              left: `calc(50% + ${award.x ?? 0}px)`,
              top: `calc(50% + ${award.y ?? 0}px)`,
            }}
          >
            <span className={award.isStreak ? "text-cq-gold" : "text-cq-cyan"}>
              +{award.amount} XP
            </span>
            {award.label || award.isStreak ? (
              <span className="text-xs text-cq-text-secondary">{award.label ?? "STREAK"}</span>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
