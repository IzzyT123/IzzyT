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
    <article className="relative w-full overflow-hidden border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)]">
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
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-border/80 bg-background/50 px-5 py-3 sm:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          Press Feature · Change Management Institute
        </p>
        <time
          className="shrink-0 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted tabular-nums"
          dateTime={dateTime}
        >
          {dateLabel}
        </time>
      </div>
      <div className="relative z-10 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="max-w-3xl">
          <h3 className="text-lg font-bold leading-snug tracking-tight text-foreground sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          {attribution ? (
            <p className="mt-2 font-mono text-xs text-muted/90">{attribution}</p>
          ) : null}
        </div>
        <a
          href={href}
          rel="noopener noreferrer"
          target="_blank"
          className="relative z-10 inline-flex shrink-0 items-center gap-2 border border-accent bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition hover:bg-accent-hover"
        >
          {hrefLabel}
          <span aria-hidden>↗</span>
        </a>
      </div>
    </article>
  );
}
