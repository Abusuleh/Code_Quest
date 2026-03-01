import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "Our Story | CodeQuest",
  description:
    "CodeQuest was born from a conversation between two childhood friends who reached the top of their professions and decided to build something for the next generation.",
  openGraph: {
    title: "Our Story | CodeQuest",
    description:
      "Meet the two childhood friends behind CodeQuest — a Chartered Educational Psychologist and an accomplished Aircraft Engineer.",
    url: "https://codequest.world/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
