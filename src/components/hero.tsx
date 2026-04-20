import { site } from "@/data/site";

export function Hero() {
  return (
    <header className="border-b border-border bg-surface px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
          <figure className="m-0 flex max-w-[min(100%,17.5rem)] items-center sm:max-w-xs">
            <blockquote className="m-0 border-r-[3px] border-foreground/25 pr-3 text-right font-[family-name:var(--font-fraunces)] text-lg font-medium italic leading-snug text-foreground sm:pr-5 sm:text-xl">
              <span aria-hidden="true" className="text-foreground/40">
                &ldquo;
              </span>
              {site.motto}
              <span aria-hidden="true" className="text-foreground/40">
                &rdquo;
              </span>
            </blockquote>
          </figure>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <a
              href={site.links.github}
              className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
            <a
              href={site.links.linkedin}
              className="inline-flex items-center justify-center border border-accent bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_12px_28px_-10px_rgba(39,66,201,0.55)] sm:px-5"
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${site.contactCta} — LinkedIn profile`}
            >
              {site.contactCta}
            </a>
          </div>
        </div>

        <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-[1.08] tracking-tight sm:mt-6 sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-3 text-lg leading-snug text-foreground sm:text-xl">
          {site.role}
        </p>
      </div>
    </header>
  );
}
