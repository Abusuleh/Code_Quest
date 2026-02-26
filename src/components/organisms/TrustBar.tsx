"use client";

import styles from "@/components/organisms/TrustBar.module.css";

const items = [
  "Designed for ages 6–14",
  "UK Curriculum Aligned",
  "COPPA & UK GDPR Compliant",
  "Child Safety First",
  "Free to Start",
];

export function TrustBar() {
  const loop = [...items, ...items];
  return (
    <section className="border-y border-cq-border bg-cq-bg-panel py-4">
      <div className={`${styles.marquee} mx-auto max-w-6xl`}>
        <div className={styles.track}>
          {loop.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-cq-text-secondary"
            >
              <span>{item}</span>
              <span className="text-cq-primary">◆</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
