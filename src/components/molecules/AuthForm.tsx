"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";

type Props = {
  title: string;
  subtitle?: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  error?: string;
  children: ReactNode;
  submitLabel: string;
};

export function AuthForm({
  title,
  subtitle,
  onSubmit,
  isLoading = false,
  error,
  children,
  submitLabel,
}: Props) {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Authentication</p>
        <h2 className="text-2xl font-heading text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-cq-text-secondary">{subtitle}</p> : null}
      </header>
      {children}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Working..." : submitLabel}
      </Button>
      {error ? (
        <p className="rounded-2xl border border-cq-red/50 px-4 py-3 text-sm text-cq-red">{error}</p>
      ) : null}
    </form>
  );
}
