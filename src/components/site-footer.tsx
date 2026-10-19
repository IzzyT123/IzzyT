import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <FadeIn viewportMargin="0px 0px -5% 0px">
      <footer className="border-t border-border bg-accent px-5 py-12 text-accent-foreground sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-[family-name:var(--font-fraunces)] text-xl font-extrabold uppercase leading-snug tracking-tight text-white">
              {site.motto}
            </p>
            <p className="text-sm text-white/80">{site.footer.credit}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/experiments"
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Experiments
            </Link>
            <Link
              href="/timeline"
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Timeline
            </Link>
            <Link
              href="/testimonials"
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Testimonials
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              Blog
            </Link>
            <a
              href={site.links.x}
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="X profile"
            >
              X
            </a>
            <a
              href={site.links.github}
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
            <a
              href={site.links.linkedin}
              className="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
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
