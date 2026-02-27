"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import styles from "@/components/organisms/HeroSection.module.css";

const tokens = [
  { text: "# Spark Zone starter quest\n", className: "text-cq-text-secondary" },
  { text: "def ", className: "text-cq-cyan" },
  { text: "launch_rocket", className: "text-cq-text-primary" },
  { text: "():\n", className: "text-cq-text-primary" },
  { text: "    ", className: "text-cq-text-primary" },
  { text: "print", className: "text-cq-cyan" },
  { text: "(", className: "text-cq-text-primary" },
  { text: '"Ready for liftoff!"', className: "text-cq-gold" },
  { text: ")\n\n", className: "text-cq-text-primary" },
  { text: "launch_rocket()", className: "text-cq-text-primary" },
];

export function HeroSection() {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [hideIndicator, setHideIndicator] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const totalLength = useMemo(() => tokens.reduce((sum, token) => sum + token.text.length, 0), []);

  useEffect(() => {
    if (reduced) {
      setCount(totalLength);
      return;
    }
    const interval = setInterval(() => {
      setCount((prev) => (prev < totalLength ? prev + 1 : prev));
    }, 48);
    return () => clearInterval(interval);
  }, [reduced, totalLength]);

  useEffect(() => {
    if (reduced || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const symbols = ["<", ">", "{", "}", "/>", "//", "=>", "*", ";"];
    const particles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0.2 + Math.random() * 0.3,
      vy: 0.2 + Math.random() * 0.3,
      char: symbols[Math.floor(Math.random() * symbols.length)],
      size: 12 + Math.random() * 10,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(108,63,232,0.25)";
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > canvas.width + 40) p.x = -40;
        if (p.y > canvas.height + 40) p.y = -40;
        ctx.font = `${p.size}px JetBrains Mono, monospace`;
        ctx.fillText(p.char, p.x, p.y);
      });
      raf = window.requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  useEffect(() => {
    const onScroll = () => setHideIndicator(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6 },
    }),
  };

  const renderTokens = () => {
    let remaining = count;
    return tokens.map((token, index) => {
      if (remaining <= 0) return null;
      const slice = token.text.slice(0, remaining);
      remaining -= token.text.length;
      return (
        <span key={`${token.text}-${index}`} className={token.className}>
          {slice}
        </span>
      );
    });
  };

  return (
    <section id="top" className={`${styles.hero} relative flex min-h-[100dvh] items-center`}>
      <div className={styles.mesh} />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl"
            initial={!reduced ? "hidden" : "show"}
            animate="show"
            variants={variants}
            custom={0.2}
          >
            Where Every Child Becomes a{" "}
            <span className="text-cq-cyan drop-shadow-[0_0_18px_rgba(0,212,255,0.6)]">
              Developer
            </span>
            .
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-base text-cq-text-secondary sm:text-lg"
            initial={!reduced ? "hidden" : "show"}
            animate="show"
            variants={variants}
            custom={0.4}
          >
            An immersive, story-driven coding world for ages 6-14. Four kingdoms. Four mentors. One
            extraordinary journey.
          </motion.p>
          <motion.div
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-cq-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-cq-text-secondary"
            initial={!reduced ? "hidden" : "show"}
            animate="show"
            variants={variants}
            custom={0.5}
          >
            Phase 1 - Coming Q3 2026
          </motion.div>
          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            initial={!reduced ? "hidden" : "show"}
            animate="show"
            variants={variants}
            custom={0.6}
          >
            <Button size="lg" type="button" onClick={() => scrollTo("#waitlist")}>
              Start the Quest
            </Button>
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={() => scrollTo("#world-map")}
            >
              Watch the World
            </Button>
          </motion.div>
        </div>

        <motion.div
          className={`${styles.codePanel} rounded-2xl p-6`}
          initial={!reduced ? "hidden" : "show"}
          animate="show"
          variants={variants}
          custom={0.8}
        >
          <div className="mb-4 flex items-center gap-2 text-xs text-cq-text-secondary">
            <span className="h-2 w-2 rounded-full bg-cq-red" />
            <span className="h-2 w-2 rounded-full bg-cq-gold" />
            <span className="h-2 w-2 rounded-full bg-cq-green" />
            <span className="ml-2">spark-zone.py</span>
          </div>
          <pre className="font-code text-sm leading-relaxed">
            {renderTokens()}
            {count < totalLength && !reduced && <span className={styles.codeCaret} />}
          </pre>
        </motion.div>
      </div>

      <div className={`${styles.scrollIndicator} ${hideIndicator ? "opacity-0" : "opacity-100"}`}>
        <div className="h-8 w-[2px] bg-cq-cyan" />
      </div>
    </section>
  );
}
