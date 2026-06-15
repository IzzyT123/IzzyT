import type { TimelineEvent } from "@/data/build-timeline";

type Props = {
  event: TimelineEvent;
  dateLabel: string;
  /** Larger Fraunces italic quote for the standalone testimonials deck. */
  featured?: boolean;
  /** Eyebrow label (defaults to the ChangeAble customer voice line). */
  label?: string;
  /** Footer name / monogram source (defaults to the event title). */
  name?: string;
  /** Footer second line (defaults to the testimonial attribution). */
  attribution?: string;
  /** English gloss shown under a non-English quote (e.g. GPT reviews). */
  quoteEn?: string;
  /** Language of the quote for the blockquote. */
  lang?: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * ChangeAble product testimonials — distinct from GPT speech bubbles and press article cards.
 * Generalized with optional label/name/attribution so the testimonials deck can render
 * GPT Builder reviews in the same card shell.
 */
export function ChangeableTestimonialCard({
  event,
  dateLabel,
  featured = false,
  label = "ChangeAble · Customer voice",
  name = event.title,
  attribution = event.testimonialAttribution ?? "",
  quoteEn,
  lang,
}: Props) {
  const quote = event.body;
  const line2 = attribution;

  const quoteClass = featured
    ? "mt-4 border-none pl-10 font-[family-name:var(--font-fraunces)] text-lg italic leading-relaxed text-foreground sm:pl-11 sm:text-xl"
    : "mt-3 border-none pl-10 text-sm italic leading-relaxed text-muted sm:pl-11 sm:text-base";

  return (
    <article className="relative w-full max-w-[min(100%,48rem)] border border-border/80 bg-surface px-4 pb-4 pt-5 shadow-[0_2px_14px_-4px_rgba(0,0,0,0.09)] sm:px-5 sm:pb-5 sm:pt-6">
      <div className="pointer-events-none absolute left-4 top-4 flex size-8 items-center justify-center rounded-full bg-emerald-700/90 font-[family-name:var(--font-fraunces)] text-sm font-semibold leading-none text-white shadow-sm sm:left-5">
        “
      </div>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 pl-10 sm:pl-11">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-900/75">
          {label}
        </p>
        <time
          className="shrink-0 font-mono text-[10px] text-muted tabular-nums"
          dateTime={event.sortDate}
        >
          {dateLabel}
        </time>
      </div>
      <blockquote className={quoteClass} lang={lang}>
        {quote}
      </blockquote>
      {quoteEn ? (
        <p
          className="mt-3 pl-10 text-sm leading-relaxed text-muted sm:pl-11"
          lang="en"
        >
          <span className="sr-only">English translation: </span>
          {quoteEn}
        </p>
      ) : null}
      <footer className="mt-4 flex items-start gap-3 border-t border-border/50 pt-4 pl-10 sm:pl-11">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)] font-mono text-xs font-semibold text-muted ring-1 ring-border/60"
          aria-hidden
        >
          {initialsFromName(name)}
        </div>
        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {line2 ? (
            <p className="mt-0.5 text-xs leading-snug text-muted">{line2}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
