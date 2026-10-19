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
    ? "text-base font-medium leading-relaxed text-foreground sm:text-lg"
    : "text-sm leading-relaxed text-foreground sm:text-base";

  return (
    <article className="relative flex w-full max-w-[min(100%,48rem)] flex-col justify-between border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-background/50 px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex size-5 items-center justify-center bg-accent font-[family-name:var(--font-fraunces)] text-sm font-bold leading-none text-accent-foreground">
            “
          </span>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
            {label}
          </p>
        </div>
        <time
          className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted tabular-nums"
          dateTime={event.sortDate}
        >
          {dateLabel}
        </time>
      </div>
      <div className="p-5 sm:p-6">
        <blockquote className={quoteClass} lang={lang}>
          &ldquo;{quote}&rdquo;
        </blockquote>
        {quoteEn ? (
          <p className="mt-3 text-sm leading-relaxed text-muted" lang="en">
            <span className="sr-only">English translation: </span>
            {quoteEn}
          </p>
        ) : null}
      </div>
      <footer className="flex items-center gap-3.5 border-t border-border/80 bg-background/40 px-5 py-3.5 sm:px-6">
        <div
          className="flex size-9 shrink-0 items-center justify-center border border-border bg-surface font-mono text-xs font-bold text-accent"
          aria-hidden
        >
          {initialsFromName(name)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          {line2 ? (
            <p className="mt-0.5 text-xs leading-snug text-muted">{line2}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}
