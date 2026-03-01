"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AchievementToastItem = {
  id: string;
  title: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  xpReward: number;
  gemReward: number;
};

type Props = {
  queue: AchievementToastItem[];
};

const rarityStyles: Record<AchievementToastItem["rarity"], string> = {
  COMMON: "border-cq-border text-cq-text-secondary",
  RARE: "border-cq-cyan/60 text-cq-cyan",
  EPIC: "border-cq-primary/70 text-cq-primary",
  LEGENDARY: "border-cq-gold/80 text-cq-gold",
};

export function AchievementToast({ queue }: Props) {
  const [active, setActive] = useState<AchievementToastItem | null>(null);
  const [pending, setPending] = useState<AchievementToastItem[]>([]);

  useEffect(() => {
    if (queue.length === 0) return;
    setPending(queue);
  }, [queue]);

  useEffect(() => {
    if (active || pending.length === 0) return;
    const next = pending[0];
    setActive(next);
    setPending((prev) => prev.slice(1));
    const timeout = setTimeout(() => setActive(null), 4000);
    return () => clearTimeout(timeout);
  }, [active, pending]);

  const toast = useMemo(() => active, [active]);

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-[80] flex flex-col gap-3">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3 }}
            className={`w-[260px] rounded-2xl border bg-cq-bg-elevated px-4 py-3 shadow-glow-primary ${rarityStyles[toast.rarity]}`}
          >
            <p className="text-xs uppercase tracking-[0.3em]">Achievement</p>
            <p className="mt-1 font-heading text-white">{toast.title}</p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span>{toast.rarity}</span>
              <span>
                +{toast.xpReward} XP - +{toast.gemReward} gems
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
