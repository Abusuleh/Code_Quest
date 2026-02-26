"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const mentors = [
  {
    name: "Byte",
    accent: "cyan",
    phase: "Spark Zone",
    description:
      "Enthusiastic, encouraging, celebrates every win. Byte speaks in simple, joyful language and makes learning feel like play.",
  },
  {
    name: "Nova",
    accent: "green",
    phase: "Builder Guild",
    description:
      "Brilliant inventor, curious and collaborative. Nova introduces Python as a superpower and makes every concept feel like a discovery.",
  },
  {
    name: "Forge",
    accent: "red",
    phase: "The Forge",
    description:
      "Efficient, direct, competitive. Forge trains you like a craftsperson — precision, speed, and real-world standards.",
  },
  {
    name: "Zenith",
    accent: "violet",
    phase: "Developer Realm",
    description:
      "Senior engineer energy. Zenith speaks to you as a peer, prepares you for the industry, and demands your best.",
  },
];

export function MentorShowcase() {
  const reduced = useReducedMotion();
  return (
    <section id="mentors" className="mx-auto max-w-6xl px-6 py-20">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl"
        initial={!reduced ? { opacity: 0, y: 20 } : false}
        whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Your Guides Through the World
      </motion.h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mentors.map((mentor, index) => {
          const accentClass =
            mentor.accent === "cyan"
              ? "from-cq-cyan/30 to-cq-cyan/5 text-cq-cyan group-hover:shadow-[0_0_24px_rgba(0,212,255,0.45)]"
              : mentor.accent === "green"
                ? "from-cq-green/30 to-cq-green/5 text-cq-green group-hover:shadow-[0_0_24px_rgba(0,229,160,0.45)]"
                : mentor.accent === "red"
                  ? "from-cq-red/30 to-cq-red/5 text-cq-red group-hover:shadow-[0_0_24px_rgba(255,77,109,0.45)]"
                  : "from-cq-violet/30 to-cq-violet/5 text-cq-violet group-hover:shadow-[0_0_24px_rgba(176,107,255,0.45)]";
          return (
            <motion.div
              key={mentor.name}
              className="group rounded-2xl border border-cq-border bg-cq-bg-panel p-6 text-left shadow-panel transition duration-300 hover:scale-[1.03]"
              initial={!reduced ? { opacity: 0, y: 20 } : false}
              whileInView={!reduced ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br ${accentClass}`}
              >
                <span className="font-display text-3xl">{mentor.name[0]}</span>
              </div>
              <h3 className="mt-6 font-display text-lg">{mentor.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                {mentor.phase}
              </p>
              <p className="mt-4 text-sm text-cq-text-secondary">{mentor.description}</p>
              <a
                href="#waitlist"
                className="mt-4 inline-flex items-center gap-2 text-sm text-cq-text-primary opacity-0 transition group-hover:opacity-100"
              >
                Meet {mentor.name} →
              </a>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
