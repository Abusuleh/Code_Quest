import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ className = "", hasError = false, ...props }: Props) {
  const base =
    "w-full rounded-full border bg-cq-bg-elevated px-5 py-3 text-sm text-cq-text-primary outline-none transition duration-300 placeholder:text-cq-text-disabled focus:border-cq-cyan focus:shadow-[0_0_18px_rgba(0,212,255,0.35)]";
  const state = hasError ? "border-cq-red focus:border-cq-red" : "border-cq-border";
  return <input className={`${base} ${state} ${className}`} {...props} />;
}
