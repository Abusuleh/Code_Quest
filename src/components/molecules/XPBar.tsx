"use client";

import { motion } from "framer-motion";

type Props = {
  currentXP: number;
  nextLevelXP: number;
  level: number;
};

export function XPBar({ currentXP, nextLevelXP, level }: Props) {
  const percent = Math.min(100, Math.round((currentXP / nextLevelXP) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-cq-text-secondary">
        <span>Level {level}</span>
        <span>
          {currentXP}/{nextLevelXP} XP
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-cq-bg-elevated">
        <motion.div
          className="h-full bg-cq-gold shadow-[0_0_12px_rgba(250,200,60,0.6)]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
    </div>
  );
}
