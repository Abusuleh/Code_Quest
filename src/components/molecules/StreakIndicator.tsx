"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

type Props = {
  current: number;
  longest: number;
};

export function StreakIndicator({ current, longest }: Props) {
  const prev = useRef(current);
  const [animatePulse, setAnimatePulse] = useState(false);
  const [animateShake, setAnimateShake] = useState(false);
  const count = useMotionValue(current);
  const rounded = useTransform(count, (value) => Math.round(value));

  useEffect(() => {
    if (current > prev.current) {
      setAnimatePulse(true);
      setAnimateShake(false);
    } else if (current < prev.current) {
      setAnimateShake(true);
      setAnimatePulse(false);
    }
    prev.current = current;
    const timeout = setTimeout(() => {
      setAnimatePulse(false);
      setAnimateShake(false);
    }, 900);
    return () => clearTimeout(timeout);
  }, [current]);

  useEffect(() => {
    const controls = animate(count, current, { duration: 0.8 });
    return () => controls.stop();
  }, [count, current]);

  return (
    <motion.div
      className="flex items-center gap-3"
      animate={animateShake ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
    >
      <motion.span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
          current === 0 ? "text-cq-text-secondary" : "text-cq-gold"
        }`}
        animate={animatePulse ? { scale: [1, 1.4, 1] } : undefined}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
          <path d="M12 2c-2 3-4 5-4 9a4 4 0 0 0 8 0c0-4-2-6-4-9z" />
          <path d="M9 14c0 2 1.5 4 3 4s3-2 3-4c0-1.5-1-2.5-3-4-2 1.5-3 2.5-3 4z" />
        </svg>
      </motion.span>
      <div>
        <p className="text-xl font-heading text-white">
          <motion.span>{rounded}</motion.span> days
        </p>
        <p className="text-xs text-cq-text-secondary">Best: {longest} days</p>
      </div>
    </motion.div>
  );
}
