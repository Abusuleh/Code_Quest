"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getRankTitle, xpToNextLevel } from "@/lib/xp-constants";

type Props = {
  xpTotal: number;
};

export function XPBar({ xpTotal }: Props) {
  const { current, required, level } = xpToNextLevel(xpTotal);
  const percent = Math.min(100, Math.round((current / required) * 100));
  const [displayPercent, setDisplayPercent] = useState(percent);
  const prevLevel = useRef(level);

  useEffect(() => {
    if (level > prevLevel.current) {
      setDisplayPercent(112);
      const timeout = setTimeout(() => setDisplayPercent(percent), 450);
      prevLevel.current = level;
      return () => clearTimeout(timeout);
    }
    setDisplayPercent(percent);
    prevLevel.current = level;
  }, [level, percent]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Level {level}</p>
          <p className="text-sm text-white">{getRankTitle(level)}</p>
        </div>
        <span className="text-xs text-cq-text-secondary">
          {current} / {required} XP
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-cq-bg-elevated">
        <motion.div
          className="h-full bg-cq-gold shadow-[0_0_12px_rgba(250,200,60,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${displayPercent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cq-gold xp-glow"
          animate={{ left: `${Math.min(displayPercent, 100)}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>
    </div>
  );
}
