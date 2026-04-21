import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <FadeIn viewportMargin="0px 0px -5% 0px">
    <footer className="border-t border-border bg-surface px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-[family-name:var(--font-fraunces)] text-base italic leading-snug text-foreground">
            {site.motto}
          </p>
          <p className="text-sm text-muted">{site.footer.credit}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/experiments"
            className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
          >
            Experiments
          </Link>
          <Link
            href="/timeline"
            className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
          >
            Timeline
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
          >
            Blog
          </Link>
          <a
            href={site.links.github}
            className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
            rel="noopener noreferrer"
            target="_blank"
            aria-label="GitHub profile"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
            rel="noopener noreferrer"
            target="_blank"
            aria-label={`${site.contactCta} — LinkedIn profile`}
          >
            {site.contactCta}
          </a>
        </div>
      </div>
    </footer>
    </FadeIn>
  );
}
