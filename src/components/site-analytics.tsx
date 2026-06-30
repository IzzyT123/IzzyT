"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { track } from "@vercel/analytics";

/** Ignore quick bounces so dwell-time data stays meaningful. */
const MIN_SECONDS = 3;

function bucket(seconds: number): string {
  if (seconds < 10) return "0-10s";
  if (seconds < 30) return "10-30s";
  if (seconds < 60) return "30-60s";
  if (seconds < 180) return "1-3m";
  if (seconds < 600) return "3-10m";
  return "10m+";
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    let accumulatedMs = 0;
    let segmentStart: number | null =
      document.visibilityState === "visible" ? Date.now() : null;
    let sent = false;

    const flush = () => {
      if (segmentStart !== null) {
        accumulatedMs += Date.now() - segmentStart;
        segmentStart = null;
      }
      if (sent) return;
      const seconds = Math.round(accumulatedMs / 1000);
      if (seconds < MIN_SECONDS) return;
      sent = true;
      track("page_time", {
        path: pathname,
        seconds,
        duration: bucket(seconds),
      });
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        // Tab hidden is the most reliable "leaving" signal, especially on mobile.
        flush();
      } else if (segmentStart === null) {
        segmentStart = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin === window.location.origin) return;

      track("outbound_click", {
        href: url.href,
        host: url.host,
        path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
