import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cq-bg-base": "var(--cq-bg-base)",
        "cq-bg-panel": "var(--cq-bg-panel)",
        "cq-bg-elevated": "var(--cq-bg-elevated)",
        "cq-bg-overlay": "var(--cq-bg-overlay)",
        "cq-primary": "var(--cq-primary)",
        "cq-primary-glow": "var(--cq-primary-glow)",
        "cq-cyan": "var(--cq-cyan)",
        "cq-gold": "var(--cq-gold)",
        "cq-green": "var(--cq-green)",
        "cq-red": "var(--cq-red)",
        "cq-violet": "var(--cq-violet)",
        "cq-text-primary": "var(--cq-text-primary)",
        "cq-text-secondary": "var(--cq-text-secondary)",
        "cq-text-disabled": "var(--cq-text-disabled)",
        "cq-border": "var(--cq-border)",
        "cq-border-bright": "var(--cq-border-bright)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        code: ["var(--font-code)", "monospace"],
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        "glow-primary": "var(--glow-primary)",
        "glow-cyan": "var(--glow-cyan)",
        "glow-gold": "var(--glow-gold)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        full: "var(--r-full)",
      },
      spacing: {
        1: "var(--sp-1)",
        2: "var(--sp-2)",
        3: "var(--sp-3)",
        4: "var(--sp-4)",
        5: "var(--sp-5)",
        6: "var(--sp-6)",
        8: "var(--sp-8)",
        10: "var(--sp-10)",
        12: "var(--sp-12)",
        16: "var(--sp-16)",
        20: "var(--sp-20)",
        24: "var(--sp-24)",
      },
      transitionTimingFunction: {
        spring: "var(--ease-spring)",
        smooth: "var(--ease-smooth)",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
