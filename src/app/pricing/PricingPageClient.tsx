"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Billing = "monthly" | "annual";

const plans = [
  {
    key: "SPARK",
    name: "Spark",
    accent: "border-cq-cyan/60",
    badge: null,
    seats: "1 Child",
    monthly: "₦2,500",
    annual: "₦24,000",
    cta: "Start Learning",
    features: [
      "All 45 Phase 1 lessons",
      "Byte AI hints",
      "Gallery publishing",
      "Weekly parent digest",
      "Spark Badge graduation",
    ],
  },
  {
    key: "FAMILY",
    name: "Family",
    accent: "border-cq-violet/60",
    badge: "MOST POPULAR",
    seats: "3 Children",
    monthly: "₦5,500",
    annual: "₦52,000",
    cta: "Start Together",
    features: [
      "All 45 Phase 1 lessons",
      "Up to 3 child profiles",
      "Byte AI hints for every child",
      "Gallery publishing",
      "Weekly parent digest",
      "Spark Badge graduation",
    ],
  },
  {
    key: "CHAMPION",
    name: "Champion",
    accent: "border-cq-gold/70",
    badge: null,
    seats: "3 Children + Early Access",
    monthly: "₦8,500",
    annual: "₦80,000",
    cta: "Go Champion",
    features: [
      "All 45 Phase 1 lessons",
      "Phase 2 early access",
      "Priority support",
      "Gallery publishing",
      "Weekly parent digest",
      "Spark Badge graduation",
    ],
  },
];

const faq = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel from the billing portal and keep access through the end of your billing period.",
  },
  {
    q: "Will my child lose their progress?",
    a: "Never. Progress and achievements remain, and Module 1 stays open even on the Free tier.",
  },
  {
    q: "Is this in Naira?",
    a: "Yes. All subscriptions are billed in Nigerian Naira with transparent pricing.",
  },
  {
    q: "Can I add more children?",
    a: "Family and Champion plans support up to 3 child profiles. You can upgrade at any time.",
  },
  {
    q: "What is Phase 2?",
    a: "Phase 2 is the Builder's Guild — advanced projects and real-world coding challenges.",
  },
];

export function PricingPageClient({ parentName }: { parentName: string | null }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroHeadline = parentName ? "Unlock the Full Spark Zone" : "The Spark Zone Is Ready";
  const heroSubhead = parentName
    ? "Your pioneer has completed Module 1. 36 more lessons — and a Spark Badge — are waiting."
    : "Choose a plan that keeps your child learning, building, and celebrating every milestone.";

  const handleCheckout = async (plan: string) => {
    setLoadingPlan(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing }),
      });
      const data = (await res.json().catch(() => null)) as { url?: string } | null;
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  const tableRows = useMemo(
    () => [
      {
        label: "Lessons",
        free: "Module 1 (9)",
        spark: "All 45",
        family: "All 45",
        champion: "All 45",
      },
      { label: "Child accounts", free: "1", spark: "1", family: "3", champion: "3" },
      {
        label: "Byte AI hints",
        free: "Limited",
        spark: "Unlimited",
        family: "Unlimited",
        champion: "Unlimited",
      },
      { label: "Gallery publishing", free: "—", spark: "Yes", family: "Yes", champion: "Yes" },
      { label: "Parent digest", free: "—", spark: "Yes", family: "Yes", champion: "Yes" },
      { label: "Phase 2 access", free: "—", spark: "—", family: "—", champion: "Early access" },
      { label: "Priority support", free: "—", spark: "—", family: "—", champion: "Yes" },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-cq-bg px-6 py-16 text-cq-text-primary">
      <div className="mx-auto max-w-6xl space-y-16">
        <section className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Pricing</p>
          <h1 className="text-4xl font-heading text-white md:text-5xl">{heroHeadline}</h1>
          <p className="mx-auto max-w-2xl text-sm text-cq-text-secondary md:text-base">
            {heroSubhead}
          </p>
          <div className="flex justify-center">
            <motion.div
              layout
              className="flex items-center rounded-full border border-cq-border bg-cq-bg-elevated p-1"
            >
              {(["monthly", "annual"] as Billing[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBilling(option)}
                  className={`relative rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                    billing === option ? "text-black" : "text-cq-text-secondary"
                  }`}
                >
                  {billing === option ? (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full bg-cq-cyan"
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  ) : null}
                  <span className="relative">{option}</span>
                </button>
              ))}
            </motion.div>
          </div>
          {billing === "annual" ? (
            <p className="text-xs uppercase tracking-[0.3em] text-cq-gold">Save 20%</p>
          ) : null}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <motion.div
              key={plan.key}
              className={`rounded-3xl border ${plan.accent} bg-cq-bg-elevated p-6 shadow-panel`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading text-white">{plan.name}</h2>
                {plan.badge ? (
                  <span className="rounded-full border border-cq-gold/60 bg-cq-gold/20 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cq-gold">
                    {plan.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cq-text-secondary">
                {plan.seats}
              </p>
              <p className="mt-6 text-4xl font-heading text-white">
                {billing === "monthly" ? plan.monthly : plan.annual}
              </p>
              <p className="mt-2 text-xs text-cq-text-secondary">
                {billing === "monthly" ? "per month" : "per year"}
              </p>
              <button
                type="button"
                onClick={() => handleCheckout(plan.key)}
                disabled={loadingPlan === plan.key}
                className="mt-6 w-full rounded-full bg-cq-cyan py-3 text-sm font-semibold text-black shadow-glow-cyan disabled:opacity-60"
              >
                {loadingPlan === plan.key ? "Redirecting..." : plan.cta}
              </button>
              <ul className="mt-6 space-y-2 text-sm text-cq-text-secondary">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cq-cyan" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        <section className="rounded-3xl border border-cq-border bg-cq-bg-elevated p-8">
          <h3 className="text-lg font-heading text-white">Plan Comparison</h3>
          <div className="mt-6 grid gap-4 text-sm text-cq-text-secondary">
            {tableRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-5 gap-4 border-b border-cq-border/60 pb-3"
              >
                <span className="text-cq-text-primary">{row.label}</span>
                <span>{row.free}</span>
                <span>{row.spark}</span>
                <span>{row.family}</span>
                <span>{row.champion}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-cq-text-secondary">
            Already on Free? You have Module 1 forever.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 rounded-3xl border border-cq-border bg-cq-bg-elevated p-8">
            <h3 className="text-lg font-heading text-white">FAQ</h3>
            <div className="space-y-3">
              {faq.map((item, index) => (
                <div key={item.q} className="rounded-2xl border border-cq-border bg-cq-bg-panel">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-white"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span>{item.q}</span>
                    <span className="text-cq-text-secondary">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index ? (
                    <div className="px-4 pb-4 text-sm text-cq-text-secondary">{item.a}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cq-border bg-gradient-to-br from-cq-bg-panel to-cq-bg-elevated p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">
              Spark Promise
            </p>
            <h3 className="mt-3 text-2xl font-heading text-white">
              Every lesson, every badge, every moment — unlocked.
            </h3>
            <p className="mt-3 text-sm text-cq-text-secondary">
              Your child gets the full Spark Zone journey, from their first block to their Spark
              Badge ceremony.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
