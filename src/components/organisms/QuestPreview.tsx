"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const steps = [
  {
    title: "Unlock the Mission",
    description: "A short story scene frames the problem and gives the child a clear goal.",
    time: "00:00",
  },
  {
    title: "Build the Solution",
    description: "Guided coding blocks or text editor with live hints and mentor voice.",
    time: "00:35",
  },
  {
    title: "Ship the Result",
    description: "Instant feedback, XP reward, and a shareable project snapshot.",
    time: "01:20",
  },
];

export function QuestPreview() {
  const reduced = useReducedMotion();
  return (
    <section id="quest-preview" className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl"
        initial={!reduced ? { opacity: 0, y: 20 } : false}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        A Quest in 90 Seconds
      </motion.h2>
      <p className="mt-4 max-w-2xl text-sm text-cq-text-secondary">
        Every lesson follows the same premium loop: story, build, ship. It keeps attention high,
        learning measurable, and progress visible to parents.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          className="space-y-6"
          initial={!reduced ? { opacity: 0, y: 20 } : false}
          whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-cq-border bg-cq-bg-panel p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-3 font-heading text-xl">{step.title}</h3>
                </div>
                <span className="text-xs text-cq-text-secondary">{step.time}</span>
              </div>
              <p className="mt-3 text-sm text-cq-text-secondary">{step.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="rounded-2xl border border-cq-border bg-cq-bg-panel p-6 shadow-panel"
          initial={!reduced ? { opacity: 0, y: 20 } : false}
          whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between text-xs text-cq-text-secondary">
            <span className="uppercase tracking-[0.3em]">Spark Zone Mission</span>
            <span>XP +50</span>
          </div>
          <div className="mt-4 rounded-xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
              Mission Brief
            </p>
            <p className="mt-3 text-sm">
              Program the rover to collect three crystals without hitting the lava tile.
            </p>
          </div>
          <div className="mt-5 rounded-xl border border-cq-border bg-cq-bg-elevated p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
              Code Snapshot
            </p>
            <pre className="mt-3 font-code text-xs leading-relaxed text-cq-text-secondary">
              {`for step in range(3):
  rover.move_forward()
  rover.collect()`}
            </pre>
          </div>
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-cq-text-secondary">
              <span>Progress</span>
              <span>3 / 4</span>
            </div>
            <div className="h-2 rounded-full bg-cq-bg-overlay">
              <div className="h-2 w-3/4 rounded-full bg-cq-cyan shadow-glow-cyan" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
