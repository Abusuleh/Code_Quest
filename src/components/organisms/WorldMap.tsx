"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const kingdoms = [
  {
    name: "Spark Zone",
    age: "Ages 6–8",
    accent: "cyan",
    phase: "01",
    tags: ["Block Coding", "Sequences", "First Games"],
  },
  {
    name: "Builder's Guild",
    age: "Ages 8–10",
    accent: "green",
    phase: "02",
    tags: ["Python", "Functions", "Real Apps"],
  },
  {
    name: "The Forge",
    age: "Ages 10–12",
    accent: "red",
    phase: "03",
    tags: ["JavaScript", "Web Dev", "Algorithms"],
  },
  {
    name: "Developer's Realm",
    age: "Ages 12–14",
    accent: "violet",
    phase: "04",
    tags: ["React", "APIs", "AI/ML"],
  },
];

export function WorldMap() {
  const reduced = useReducedMotion();
  return (
    <section id="world-map" className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl"
        initial={!reduced ? { opacity: 0, y: 20 } : false}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Choose Your Kingdom
      </motion.h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {kingdoms.map((kingdom, index) => (
          <motion.div
            key={kingdom.name}
            className={`group rounded-2xl border border-cq-border bg-cq-bg-panel p-6 shadow-panel transition duration-300 hover:-translate-y-1 ${
              kingdom.accent === "cyan"
                ? "hover:border-cq-cyan hover:shadow-[0_0_24px_rgba(0,212,255,0.35)]"
                : kingdom.accent === "green"
                  ? "hover:border-cq-green hover:shadow-[0_0_24px_rgba(0,229,160,0.35)]"
                  : kingdom.accent === "red"
                    ? "hover:border-cq-red hover:shadow-[0_0_24px_rgba(255,77,109,0.35)]"
                    : "hover:border-cq-violet hover:shadow-[0_0_24px_rgba(176,107,255,0.35)]"
            }`}
            initial={!reduced ? { opacity: 0, y: 20 } : false}
            whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <div
              className={`h-1 w-14 rounded-full ${
                kingdom.accent === "cyan"
                  ? "bg-cq-cyan"
                  : kingdom.accent === "green"
                    ? "bg-cq-green"
                    : kingdom.accent === "red"
                      ? "bg-cq-red"
                      : "bg-cq-violet"
              }`}
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-5xl font-display text-cq-text-disabled/40">
                {kingdom.phase}
              </span>
              <div
                className={`h-16 w-16 rounded-full text-center text-2xl leading-[64px] ${
                  kingdom.accent === "cyan"
                    ? "bg-cq-cyan/20 text-cq-cyan"
                    : kingdom.accent === "green"
                      ? "bg-cq-green/20 text-cq-green"
                      : kingdom.accent === "red"
                        ? "bg-cq-red/20 text-cq-red"
                        : "bg-cq-violet/20 text-cq-violet"
                }`}
              >
                {kingdom.name[0]}
              </div>
            </div>
            <h3 className="mt-4 font-heading text-2xl">{kingdom.name}</h3>
            <p className="mt-2 text-sm text-cq-text-secondary">{kingdom.age}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {kingdom.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cq-border px-3 py-1 text-xs text-cq-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
