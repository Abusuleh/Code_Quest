"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const steps = [
  {
    title: "Take the Placement Quest",
    description: "A 15-minute gamified assessment to place your child perfectly.",
    icon: "01",
  },
  {
    title: "Enter Your Kingdom",
    description: "Start in the right phase for age and ability. No wasted time.",
    icon: "02",
  },
  {
    title: "Build, Level Up, Ship",
    description: "Complete lessons, earn XP, and publish real projects.",
    icon: "03",
  },
];

export function HowItWorks() {
  const reduced = useReducedMotion();
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl"
        initial={!reduced ? { opacity: 0, y: 20 } : false}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Your Adventure, Your Pace
      </motion.h2>

      <div className="relative mt-12">
        <motion.svg
          className="absolute left-0 top-7 hidden w-full md:block"
          height="2"
          viewBox="0 0 1000 2"
          initial={!reduced ? { pathLength: 0 } : false}
          whileInView={!reduced ? { pathLength: 1 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <motion.line
            x1="0"
            y1="1"
            x2="1000"
            y2="1"
            stroke="var(--cq-border-bright)"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
        </motion.svg>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="rounded-2xl border border-cq-border bg-cq-bg-panel p-6 text-left shadow-panel"
              initial={!reduced ? { opacity: 0, y: 20 } : false}
              whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cq-border text-xs tracking-[0.2em] text-cq-text-secondary">
                {step.icon}
              </div>
              <h3 className="font-heading text-xl">{step.title}</h3>
              <p className="mt-3 text-sm text-cq-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
