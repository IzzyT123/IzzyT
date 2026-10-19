import type { Metadata } from "next";
import Link from "next/link";
import { UnifiedTimeline } from "@/components/unified-timeline";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "Full chronological timeline of ships, reviews, press, and testimonials.",
};

export default function TimelinePage() {
  return (
    <>
      <header className="border-b border-border bg-accent px-5 py-6 text-accent-foreground sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
        </div>
      </header>
      <UnifiedTimeline />
      <SiteFooter />
    </>
  );
}
