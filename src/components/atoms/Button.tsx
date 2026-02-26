import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";
type Size = "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-heading transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cq-cyan";

const variants: Record<Variant, string> = {
  primary:
    "bg-cq-primary text-white shadow-glow-primary hover:shadow-[0_0_28px_rgba(108,63,232,0.6)]",
  secondary:
    "bg-cq-bg-elevated text-cq-text-primary border border-cq-border hover:border-cq-border-bright",
  outline:
    "border border-cq-border text-cq-text-primary backdrop-blur-md hover:border-cq-border-bright",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
