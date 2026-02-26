import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { DM_Sans, JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeQuest",
  description: "The world's most immersive, narrative-driven coding education platform for kids.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
