import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MarketingLayout } from "@/components/templates/MarketingLayout";

export const metadata: Metadata = {
  title: {
    default: "CodeQuest — The World's Most Immersive Coding Adventure for Kids",
    template: "%s | CodeQuest",
  },
  description:
    "An immersive, story-driven coding education platform for children aged 6–14. Four kingdoms, four AI mentors, real projects. From block coding to full-stack development.",
  keywords: [
    "coding for kids",
    "learn to code",
    "kids programming",
    "coding education",
    "STEM for children",
    "block coding",
    "Python for kids",
    "JavaScript for kids",
    "coding platform UK",
    "children coding course",
  ],
  authors: [{ name: "CodeQuest" }],
  creator: "CodeQuest",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://codequest.world",
    siteName: "CodeQuest",
    title: "CodeQuest — Where Every Child Becomes a Developer",
    description: "The world's most immersive coding adventure for ages 6–14.",
    images: [
      {
        url: "https://codequest.world/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeQuest — World of Coding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeQuest — Where Every Child Becomes a Developer",
    description: "An immersive coding world for ages 6–14.",
    images: ["https://codequest.world/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function MarketingRootLayout({ children }: { children: ReactNode }) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
