import type { ReactNode } from "react";
import Image from "next/image";
import {
  compareEventsDesc,
  getTimelineEvents,
  groupTimelineByMonth,
  partitionMonthEvents,
  SNAPSHOT_COLUMNS,
  type SnapshotColumn,
  type TimelineEvent,
  type TimelineMonthGroup,
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
  if (event.kind === "launch") return "Launch";
  if (event.kind === "series") return "Series";
  if (event.lane === "changeable") return "ChangeAble.ai";
  if (event.lane === "role") return "Role";
  return "Milestone";
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
  monthKey: string;
  monthLabel: string;
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

/** Buffered review-only months flush as a tunnel segment before the next milestone—merge into one reviews block with that month. */
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
  groups: TimelineMonthGroup[],
  yearAnchorId: Map<string, string | undefined>,
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
        key: group.monthKey,
        monthKey: group.monthKey,
        monthLabel: group.monthLabel,
        parts,
        reviewsAfter: reviews,
        sectionId: yearAnchorId.get(group.monthKey),
      });
    } else if (reviews.length > 0) {
      /** Months with press or ChangeAble testimonials keep their own heading; do not buffer into the next milestone. */
      if (
        reviews.some(
          (e) => e.kind === "article" || e.kind === "testimonial",
        )
      ) {
        flushTunnel();
        out.push({
          type: "milestones",
          key: group.monthKey,
          monthKey: group.monthKey,
          monthLabel: group.monthLabel,
          parts,
          reviewsAfter: reviews,
          sectionId: yearAnchorId.get(group.monthKey),
        });
      } else {
        reviewBuffer.push(...reviews);
        reviewBufferKeys.push(group.monthKey);
      }
    }
  }
  flushTunnel();
  return mergeAdjacentTunnelIntoMilestones(out);
}

export function UnifiedTimeline() {
  const events = getTimelineEvents();
  const groups = groupTimelineByMonth(events);

  const seenYear = new Set<string>();
  const yearAnchorId = new Map<string, string | undefined>();
  for (const g of groups) {
    const y = g.monthKey.slice(0, 4);
    if (!seenYear.has(y)) {
      seenYear.add(y);
      yearAnchorId.set(g.monthKey, `year-${y}`);
    } else {
      yearAnchorId.set(g.monthKey, undefined);
    }
  }

  return (
    <section
      id="timeline"
      className="scroll-mt-6 border-t border-border bg-background px-5 py-6 sm:px-8 sm:py-8"
      aria-label="Timeline"
    >
      <div className="mx-auto max-w-6xl">
        <div className="space-y-1 sm:space-y-2">
          {buildTimelineSegments(groups, yearAnchorId).map((seg, gi) => {
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
                  aria-labelledby={`month-heading-${seg.monthKey}`}
                >
                  {isOnlyProfessionalMilestones(seg.parts) ? (
                    <>
                      {/*
                        Put the month title + review pin in one column on md+.
                        Otherwise the pin sat *below* the whole grid and lined up with the
                        bottom of the tall left column — huge gap under the heading.
                      */}
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-x-10 md:gap-y-3">
                        <header className="relative z-10 order-1 min-w-0 bg-background pb-2 md:col-start-2 md:row-start-1 md:pb-0">
                          <h3
                            id={`month-heading-${seg.monthKey}`}
                            className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
                          >
                            {seg.monthLabel}
                          </h3>
                        </header>
                        <div
                          className={`order-2 min-w-0 md:col-start-1 md:row-start-1 ${
                            seg.reviewsAfter.length > 0 ? "md:row-span-2" : ""
                          }`}
                        >
                          <MonthSnapshot
                            monthLabel={seg.monthLabel}
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
                          id={`month-heading-${seg.monthKey}`}
                          className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
                        >
                          {seg.monthLabel}
                        </h3>
                      </div>
                      <MonthSnapshot
                        monthLabel={seg.monthLabel}
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
      </div>
    </section>
  );
}
