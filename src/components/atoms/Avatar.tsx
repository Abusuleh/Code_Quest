"use client";

type AvatarConfig = {
  variant?: string;
  label?: string;
};

const palette: Record<string, { bg: string; text: string }> = {
  atlas: { bg: "bg-cq-cyan/20", text: "text-cq-cyan" },
  nova: { bg: "bg-cq-primary/20", text: "text-cq-primary" },
  ember: { bg: "bg-cq-gold/20", text: "text-cq-gold" },
  pulse: { bg: "bg-cq-border-bright/20", text: "text-cq-border-bright" },
  zen: { bg: "bg-cq-green/20", text: "text-cq-green" },
  wave: { bg: "bg-cq-blue/20", text: "text-cq-blue" },
  flare: { bg: "bg-cq-red/20", text: "text-cq-red" },
  echo: { bg: "bg-cq-text-secondary/20", text: "text-cq-text-secondary" },
};

export function Avatar({
  config,
  size = 64,
  fallback,
}: {
  config?: AvatarConfig | null;
  size?: number;
  fallback: string;
}) {
  const variant = config?.variant ?? "atlas";
  const label = config?.label ?? fallback.slice(0, 2).toUpperCase();
  const colors = palette[variant] ?? palette.atlas;

  return (
    <div
      className={`flex items-center justify-center rounded-full border border-cq-border ${colors.bg}`}
      style={{ width: size, height: size }}
    >
      <span className={`font-heading text-sm ${colors.text}`}>{label}</span>
    </div>
  );
}
