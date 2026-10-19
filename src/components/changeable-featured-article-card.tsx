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
    <article className="relative w-full overflow-hidden border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_8px_24px_-12px_rgba(15,29,58,0.07)]">
      <div
        className="pointer-events-none absolute bottom-3 right-5 z-0 select-none text-accent/[0.06]"
        aria-hidden
      >
        <Megaphone
          className="h-24 w-24 sm:h-28 sm:w-28"
          strokeWidth={1.15}
          aria-hidden
        />
      </div>
      <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              Press Feature · Change Management Institute
            </p>
            <span className="h-3 w-px bg-border" aria-hidden />
            <time
              className="text-xs font-medium uppercase tracking-wider text-muted tabular-nums"
              dateTime={dateTime}
            >
              {dateLabel}
            </time>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          {attribution ? (
            <p className="mt-2 text-xs text-muted">{attribution}</p>
          ) : null}
        </div>
        <a
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className="relative z-10 inline-flex shrink-0 items-center gap-2 border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
        >
          <span>{hrefLabel}</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  );
}
