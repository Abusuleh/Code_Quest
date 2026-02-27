"use client";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from "next/navigation";

const isChildRoute = (pathname: string) =>
  pathname.startsWith("/dashboard") || pathname.startsWith("/placement");

export function SpeedInsightsGate() {
  const pathname = usePathname();
  if (isChildRoute(pathname)) return null;
  return <SpeedInsights />;
}
