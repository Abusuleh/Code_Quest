"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

const isChildRoute = (pathname: string) =>
  pathname.startsWith("/dashboard") || pathname.startsWith("/placement");

if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: "memory",
  });
}

export function PostHogGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (isChildRoute(pathname)) {
      posthog.opt_out_capturing();
      return;
    }
    posthog.opt_in_capturing();
    posthog.capture("$pageview");
  }, [pathname]);

  if (!POSTHOG_KEY) return <>{children}</>;

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
