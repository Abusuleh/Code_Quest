import type { ReactNode } from "react";
import { NavBar } from "@/components/organisms/NavBar";

type Props = {
  children: ReactNode;
};

export function MarketingLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-cq-bg-base text-cq-text-primary">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
