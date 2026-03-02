import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PricingPageClient } from "./PricingPageClient";

export const metadata: Metadata = {
  title: "Pricing | CodeQuest",
  description: "Choose the CodeQuest plan that unlocks the full Spark Zone experience.",
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  return <PricingPageClient parentName={session?.user?.name ?? null} />;
}
