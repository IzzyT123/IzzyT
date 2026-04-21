import type { ReactNode } from "react";
import Image from "next/image";
import {
  compareEventsDesc,
  getTimelineEvents,
  groupTimelineByYear,
  partitionMonthEvents,
  SNAPSHOT_COLUMNS,
  type SnapshotColumn,
  type TimelineEvent,
  type TimelineYearGroup,
} from "@/data/build-timeline";
import { getProjectDemoById, site, type ProjectDemo } from "@/data/site";
import { FadeIn } from "@/components/fade-in";
/** Pin stack: GPT reviews, ChangeAble testimonials, and press articles (same scrub). */
import { ReviewPinSection } from "@/components/review-pin-section";

const COLUMN_TITLE: Record<SnapshotColumn, string> = {
  professional: site.timeline.snapshotColumns.professional,
  personal: site.timeline.snapshotColumns.personal,
};

/** Work / ChangeAble milestones only this month — layout pairs them with the month heading on the right */
function isOnlyProfessionalMilestones(
  parts: Record<SnapshotColumn, TimelineEvent[]>,
): boolean {
  return parts.professional.length > 0 && parts.personal.length === 0;
}

function formatDay(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function eventSubtypeLabel(event: TimelineEvent): string {
  if (event.kind === "article") return "Press";
  if (event.kind === "testimonial") return "Testimonial";
  if (event.kind === "review") return "Review";
  if (event.kind === "post") return "Post";
  if (event.lane === "role" || event.lane === "changeable") return "Work";
  return "Side project";
}

function milestoneShellClass(column: SnapshotColumn): string {
  switch (column) {
    case "professional":
    case "personal":
      return "border border-border bg-surface shadow-sm transition-colors hover:border-foreground/35";
    default:
      return "";
  }
}

function demoThumbnailSrc(demo: ProjectDemo): string {
  return demo.media.kind === "video" ? demo.media.poster : demo.media.src;
}

function MilestoneCard({
  event,
  column,
}: {
  event: TimelineEvent;
  column: SnapshotColumn;
}) {
  const demo = event.demoId ? getProjectDemoById(event.demoId) : undefined;
  const outbound =
    event.href ?? (demo ? site.links[demo.hrefKey] : undefined);
  const bodyText = demo ? demo.proofLine : event.body;
  const thumbSrc =
    event.demoThumbnailSrc ??
    (demo ? demoThumbnailSrc(demo) : undefined);

  return (
    <article className={`p-3 sm:p-4 ${milestoneShellClass(column)}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
          {eventSubtypeLabel(event)}
        </span>
        <time
          className="font-mono text-[10px] text-muted tabular-nums"
          dateTime={event.sortDate}
        >
          {formatDay(event.sortDate)}
        </time>
      </div>
      {demo && outbound && thumbSrc ? (
        <a
          href={outbound}
          className="relative mt-2 block aspect-video overflow-hidden border border-border"
          rel="noopener noreferrer"
          target="_blank"
          aria-label={`${event.hrefLabel ?? "Open link"} — ${event.title}`}
        >
          <Image
            src={thumbSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, min(28rem, 40vw)"
            loading="lazy"
          />
        </a>
      ) : null}
      <h4 className="mt-2 font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug sm:text-lg">
        {event.title}
      </h4>
      {event.changeablePhases ? (
        <ol className="mt-2 flex flex-col gap-1 border-l border-border pl-3 text-xs leading-relaxed text-muted sm:text-sm">
          {[...event.changeablePhases]
            .sort((a, b) => a.sortDate.localeCompare(b.sortDate))
            .map((phase) => (
              <li key={phase.sortDate}>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted sm:text-[11px]">
                  {phase.date}
                </span>
                <span className="mx-1.5" aria-hidden>
                  ·
                </span>
                <span className="font-medium text-foreground">
                  {phase.label}
                </span>
                <span className="mx-1.5" aria-hidden>
                  —
                </span>
                <span>{phase.detail}</span>
              </li>
            ))}
        </ol>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-muted">{bodyText}</p>
      {outbound ? (
        <a
          href={outbound}
          className="mt-3 inline-flex text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
          rel="noopener noreferrer"
          target="_blank"
        >
          {event.hrefLabel ?? "Open link"}
        </a>
      ) : null}
    </article>
  );
}

function columnShellClass(col: SnapshotColumn): string {
  switch (col) {
    case "professional":
    case "personal":
      return "bg-background/90 p-3 sm:p-4";
    default:
      return "";
  }
}

function monthSnapshotGridClass(activeColumns: SnapshotColumn[]): string {
  const n = activeColumns.length;
  const base = "grid grid-cols-1 gap-4";
  if (n <= 1) return base;
  return `${base} md:grid-cols-2 md:gap-6 md:gap-x-8`;
}

function MilestoneColumn({
  col,
  monthLabel,
  parts,
}: {
  col: SnapshotColumn;
  monthLabel: string;
  parts: Record<SnapshotColumn, TimelineEvent[]>;
}) {
  const list = parts[col];
  const title = COLUMN_TITLE[col];

  const cells: ReactNode[] = list.map((ev) => (
    <li key={ev.id} className="list-none">
      <MilestoneCard event={ev} column={col} />
    </li>
  ));

  return (
    <div
      role="region"
      aria-label={`${title}, ${monthLabel}`}
      className={`flex flex-col ${columnShellClass(col)}`}
    >
      <p className="mb-2 hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted md:block">
        {title}
      </p>
      <ul className="flex flex-col gap-3">{cells}</ul>
    </div>
  );
}

function MonthSnapshot({
  monthLabel,
  parts,
}: {
  monthLabel: string;
  parts: Record<SnapshotColumn, TimelineEvent[]>;
}) {
  const activeColumns = SNAPSHOT_COLUMNS.filter((col) => parts[col].length > 0);
  if (activeColumns.length === 0) return null;

  if (activeColumns.length === 1 && activeColumns[0] === "professional") {
    return (
      <MilestoneColumn
        col="professional"
        monthLabel={monthLabel}
        parts={parts}
      />
    );
  }

  if (activeColumns.length === 1 && activeColumns[0] === "personal") {
    return (
      <div className="md:flex md:justify-end">
        <div className="w-full md:max-w-[min(100%,28rem)]">
          <MilestoneColumn
            col="personal"
            monthLabel={monthLabel}
            parts={parts}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={monthSnapshotGridClass(activeColumns)}>
      {activeColumns.map((col) => (
        <MilestoneColumn key={col} col={col} monthLabel={monthLabel} parts={parts} />
      ))}
    </div>
  );
}

type MilestoneTimelineSegment = {
  type: "milestones";
  key: string;
  yearKey: string;
  yearLabel: string;
  parts: Record<SnapshotColumn, TimelineEvent[]>;
  reviewsAfter: TimelineEvent[];
  sectionId?: string;
};

type ReviewTunnelSegment = {
  type: "review-tunnel";
  key: string;
  reviews: TimelineEvent[];
};

type TimelineSegment = MilestoneTimelineSegment | ReviewTunnelSegment;

/** Buffered review-only years flush as a tunnel segment before the next milestone—merge into one reviews block with that year. */
function mergeAdjacentTunnelIntoMilestones(
  segments: TimelineSegment[],
): TimelineSegment[] {
  const merged: TimelineSegment[] = [];
  let i = 0;
  while (i < segments.length) {
    const cur = segments[i];
    const nxt = segments[i + 1];
    if (cur.type === "review-tunnel" && nxt?.type === "milestones") {
      merged.push({
        ...nxt,
        reviewsAfter: [...cur.reviews, ...nxt.reviewsAfter].sort(
          compareEventsDesc,
        ),
      });
      i += 2;
    } else {
      merged.push(cur);
      i += 1;
    }
  }
  return merged;
}

function buildTimelineSegments(
  groups: TimelineYearGroup[],
): TimelineSegment[] {
  const out: TimelineSegment[] = [];
  let reviewBuffer: TimelineEvent[] = [];
  let reviewBufferKeys: string[] = [];

  const flushTunnel = () => {
    if (reviewBuffer.length === 0) return;
    out.push({
      type: "review-tunnel",
      key: `tunnel-${reviewBufferKeys.join("-")}`,
      reviews: reviewBuffer,
    });
    reviewBuffer = [];
    reviewBufferKeys = [];
  };

  for (const group of groups) {
    const milestones = group.events.filter(
      (e) =>
        e.kind !== "review" &&
        e.kind !== "article" &&
        e.kind !== "testimonial",
    );
    const reviews = group.events
      .filter(
        (e) =>
          e.kind === "review" ||
          e.kind === "article" ||
          e.kind === "testimonial",
      )
      .sort(compareEventsDesc);
    const parts = partitionMonthEvents(milestones);
    const hasMilestoneGrid = SNAPSHOT_COLUMNS.some(
      (col) => parts[col].length > 0,
    );

    if (hasMilestoneGrid) {
      flushTunnel();
      out.push({
        type: "milestones",
        key: group.yearKey,
        yearKey: group.yearKey,
        yearLabel: group.yearLabel,
        parts,
        reviewsAfter: reviews,
        sectionId: `year-${group.yearKey}`,
      });
    } else if (reviews.length > 0) {
      /** Years with press or ChangeAble testimonials keep their own heading; do not buffer into the next milestone. */
      if (
        reviews.some(
          (e) => e.kind === "article" || e.kind === "testimonial",
        )
      ) {
        flushTunnel();
        out.push({
          type: "milestones",
          key: group.yearKey,
          yearKey: group.yearKey,
          yearLabel: group.yearLabel,
          parts,
          reviewsAfter: reviews,
          sectionId: `year-${group.yearKey}`,
        });
      } else {
        reviewBuffer.push(...reviews);
        reviewBufferKeys.push(group.yearKey);
      }
    }
  }
  flushTunnel();
  return mergeAdjacentTunnelIntoMilestones(out);
}

export function UnifiedTimeline({
  limitYears,
}: {
  /** When set, only the most recent N years of milestone groups are rendered; a "View full timeline" CTA is shown. */
  limitYears?: number;
} = {}) {
  const events = getTimelineEvents();
  const allGroups = groupTimelineByYear(events);
  const groups =
    typeof limitYears === "number" ? allGroups.slice(0, limitYears) : allGroups;
  const isTrimmed = groups.length < allGroups.length;

  const yearList = groups.map((g) => g.yearKey);

  return (
    <section
      id="timeline"
      className="scroll-mt-6 border-t border-border bg-background px-5 py-6 sm:px-8 sm:py-8"
      aria-labelledby="timeline-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="timeline-heading"
          className="mb-4 font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:mb-5 sm:text-3xl"
        >
          Timeline
        </h2>
        {yearList.length > 1 ? (
          <nav
            aria-label="Jump to year"
            className="sticky top-0 z-20 -mx-5 mb-4 border-y border-border bg-background/95 px-5 py-2 backdrop-blur sm:-mx-8 sm:mb-5 sm:px-8"
          >
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {yearList.map((y) => (
                <li key={y}>
                  <a
                    href={`#year-${y}`}
                    className="font-mono text-xs font-semibold tabular-nums text-muted underline decoration-transparent underline-offset-4 transition hover:text-foreground hover:decoration-foreground sm:text-sm"
                  >
                    {y}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div className="relative space-y-1 border-l border-border pl-5 sm:space-y-2 sm:pl-6">
          {buildTimelineSegments(groups).map((seg, gi) => {
            if (seg.type === "review-tunnel") {
              return seg.reviews.length > 0 ? (
                <FadeIn
                  key={seg.key}
                  delay={gi * 0.02}
                  viewportMargin="0px 0px 15% 0px"
                >
                  <div className="mt-2 border-t border-border/50 pt-5 sm:mt-3 sm:pt-6">
                    <ReviewPinSection reviews={seg.reviews} />
                  </div>
                </FadeIn>
              ) : null;
            }

            return (
              <FadeIn
                key={seg.key}
                delay={gi * 0.03}
                viewportMargin="0px 0px 15% 0px"
              >
                <div
                  id={seg.sectionId}
                  className="relative isolate scroll-mt-28"
                  role="group"
                  aria-labelledby={`year-heading-${seg.yearKey}`}
                >
                  <span
                    aria-hidden
                    className="absolute -left-[calc(1.25rem+4px)] top-2 h-2 w-2 rounded-full bg-foreground sm:-left-[calc(1.5rem+4px)]"
                  />
                  {isOnlyProfessionalMilestones(seg.parts) ? (
                    <>
                      {/*
                        Put the year title + review pin in one column on md+.
                        Otherwise the pin sat *below* the whole grid and lined up with the
                        bottom of the tall left column — huge gap under the heading.
                      */}
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-x-10 md:gap-y-3">
                        <header className="relative z-10 order-1 min-w-0 bg-background pb-2 md:col-start-2 md:row-start-1 md:pb-0">
                          <h3
                            id={`year-heading-${seg.yearKey}`}
                            className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
                          >
                            {seg.yearLabel}
                          </h3>
                        </header>
                        <div
                          className={`order-2 min-w-0 md:col-start-1 md:row-start-1 ${
                            seg.reviewsAfter.length > 0 ? "md:row-span-2" : ""
                          }`}
                        >
                          <MonthSnapshot
                            monthLabel={seg.yearLabel}
                            parts={seg.parts}
                          />
                        </div>
                        {seg.reviewsAfter.length > 0 ? (
                          <div className="order-3 min-w-0 md:col-start-2 md:row-start-2 md:w-full">
                            <ReviewPinSection reviews={seg.reviewsAfter} />
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative z-10 mb-3 border-b border-border/60 bg-background pb-2 sm:mb-4 sm:pb-2.5">
                        <h3
                          id={`year-heading-${seg.yearKey}`}
                          className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
                        >
                          {seg.yearLabel}
                        </h3>
                      </div>
                      <MonthSnapshot
                        monthLabel={seg.yearLabel}
                        parts={seg.parts}
                      />
                      {seg.reviewsAfter.length > 0 ? (
                        <div className="mt-2 sm:mt-3">
                          <ReviewPinSection reviews={seg.reviewsAfter} />
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
        {isTrimmed ? (
          <p className="mt-8 sm:mt-10">
            <a
              href="/timeline"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
            >
              View full timeline
              <span aria-hidden>→</span>
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
