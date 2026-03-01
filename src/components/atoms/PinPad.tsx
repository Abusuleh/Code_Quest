"use client";

import { motion } from "framer-motion";

type Props = {
  onDigit: (digit: string) => void;
  onDelete: () => void;
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export function PinPad({ onDigit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {digits.slice(0, 9).map((digit) => (
        <motion.button
          key={digit}
          type="button"
          whileTap={{ scale: 0.92 }}
          className="h-[72px] w-[72px] rounded-2xl border border-cq-border bg-cq-bg-elevated text-lg text-white shadow-glow-primary"
          onClick={() => onDigit(digit)}
        >
          {digit}
        </motion.button>
      ))}
      <div className="h-[72px] w-[72px]" />
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        className="h-[72px] w-[72px] rounded-2xl border border-cq-border bg-cq-bg-elevated text-lg text-white shadow-glow-primary"
        onClick={() => onDigit("0")}
      >
        0
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        className="h-[72px] w-[72px] rounded-2xl border border-cq-border bg-cq-bg-elevated text-sm text-cq-text-secondary"
        onClick={onDelete}
      >
        Backspace
      </motion.button>
    </div>
  );
}
