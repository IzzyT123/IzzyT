import { Megaphone } from "lucide-react";

type Props = {
  title: string;
  body: string;
  href: string;
  hrefLabel: string;
  /** Display label e.g. "22 Apr 2025" */
  dateLabel: string;
  dateTime: string;
  attribution?: string;
};

/**
 * Distinct from review speech bubbles: rectangular card, ChangeAble-forward branding, external link.
 * Watermark: Lucide `Megaphone` (recognizable outline megaphone) — see https://lucide.dev/icons/megaphone
 */
export function ChangeableFeaturedArticleCard({
  title,
  body,
  href,
  hrefLabel,
  dateLabel,
  dateTime,
  attribution,
}: Props) {
  return (
    <article className="relative w-full max-w-[min(100%,52rem)] overflow-hidden rounded-xl border border-emerald-900/20 bg-surface shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] ring-1 ring-emerald-900/15">
      <div
        className="pointer-events-none absolute bottom-2 right-4 z-0 select-none text-emerald-800/[0.14] sm:bottom-3 sm:right-5"
        aria-hidden
      >
        <Megaphone
          className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32"
          strokeWidth={1.15}
          aria-hidden
        />
      </div>
      <div className="relative z-10 border-l-[3px] border-emerald-700/55 py-3.5 pl-4 pr-16 sm:py-4 sm:pl-5 sm:pr-24 md:pr-28">
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-900/70">
            ChangeAble · Press
          </p>
          <time
            className="shrink-0 font-mono text-[10px] text-muted tabular-nums"
            dateTime={dateTime}
          >
            {dateLabel}
          </time>
        </div>
        <h3 className="mt-1.5 font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
        {attribution ? (
          <p className="mt-2 text-xs leading-snug text-muted/90">{attribution}</p>
        ) : null}
        <a
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-900/20 bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-emerald-800/35 hover:bg-[var(--surface-muted)]"
        >
          {hrefLabel}
          <span aria-hidden className="text-muted">
            ↗
          </span>
        </a>
      </div>
    </article>
  );
}
