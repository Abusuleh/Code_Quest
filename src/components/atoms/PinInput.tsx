"use client";

import { motion } from "framer-motion";

type Props = {
  value: string;
  status?: "idle" | "error" | "success";
};

export function PinInput({ value, status = "idle" }: Props) {
  const dots = Array.from({ length: 4 });

  return (
    <motion.div
      className="flex items-center justify-center gap-3"
      animate={status === "error" ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
    >
      {dots.map((_, idx) => {
        const filled = value.length > idx;
        return (
          <motion.div
            key={`pin-dot-${idx}`}
            className={`h-4 w-4 rounded-full border ${
              filled ? "border-cq-cyan bg-cq-cyan" : "border-cq-border"
            }`}
            animate={status === "success" ? { scale: [1, 1.15, 1] } : undefined}
          />
        );
      })}
    </motion.div>
  );
}
