"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { TimelineEvent, TimelineKind } from "@/data/build-timeline";
import { ChangeableFeaturedArticleCard } from "@/components/changeable-featured-article-card";
import { ChangeableTestimonialCard } from "@/components/changeable-testimonial-card";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Props = {
  items: TimelineEvent[];
};

type FilterId = "all" | "testimonial" | "review" | "article";

const FILTERS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "testimonial", label: "ChangeAble customers" },
  { id: "review", label: "GPT Builder users" },
  { id: "article", label: "Press" },
];

function formatDay(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function matchesFilter(event: TimelineEvent, filter: FilterId): boolean {
  if (filter === "all") return true;
  return event.kind === (filter as TimelineKind);
}

function TestimonialCardSwitch({ event }: { event: TimelineEvent }) {
  const dateLabel = formatDay(event.sortDate);
  if (event.kind === "article") {
    return (
      <ChangeableFeaturedArticleCard
        title={event.title}
        body={event.body}
        href={event.href ?? "#"}
        hrefLabel={event.hrefLabel ?? "Read the article"}
        attribution={event.attribution}
        dateLabel={dateLabel}
        dateTime={event.sortDate}
      />
    );
  }
  if (event.kind === "testimonial") {
    return (
      <ChangeableTestimonialCard event={event} dateLabel={dateLabel} featured />
    );
  }
  return (
    <ChangeableTestimonialCard
      event={event}
      dateLabel={dateLabel}
      featured
      label="GPT Builder Pro · User feedback"
      name="GPT Builder Pro"
      attribution="ChatGPT user review"
      quoteEn={event.quoteEn}
      lang={event.lang ?? "en"}
    />
  );
}

export function TestimonialDeck({ items }: Props) {
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<FilterId>("all");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const filtered = useMemo(
    () => items.filter((e) => matchesFilter(e, filter)),
    [items, filter],
  );

  const count = filtered.length;
  const safeIndex = count > 0 ? Math.min(index, count - 1) : 0;
  const active = filtered[safeIndex];

  const paginate = useCallback(
    (dir: number) => {
      if (count <= 1) return;
      setDirection(dir);
      setIndex((i) => {
        const base = Math.min(i, count - 1);
        return (base + dir + count) % count;
      });
    },
    [count],
  );

  const goTo = useCallback(
    (target: number) => {
      setDirection(target > safeIndex ? 1 : -1);
      setIndex(target);
    },
    [safeIndex],
  );

  const selectFilter = useCallback((next: FilterId) => {
    setFilter(next);
    setDirection(0);
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        paginate(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        paginate(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [paginate]);

  const onDragEnd = useCallback(
    (_e: unknown, info: PanInfo) => {
      const threshold = 60;
      if (info.offset.x <= -threshold || info.velocity.x <= -400) {
        paginate(1);
      } else if (info.offset.x >= threshold || info.velocity.x >= 400) {
        paginate(-1);
      }
    },
    [paginate],
  );

  if (count === 0 || !active) return null;

  const hasStack = count > 1;
  const showDots = count <= 12;

  const cardMotion = reduced
    ? {}
    : {
        custom: direction,
        variants: {
          enter: (dir: number) => ({
            opacity: 0,
            x: dir === 0 ? 0 : dir > 0 ? 48 : -48,
            scale: 0.97,
          }),
          center: { opacity: 1, x: 0, scale: 1 },
          exit: (dir: number) => ({
            opacity: 0,
            x: dir > 0 ? -48 : 48,
            scale: 0.97,
          }),
        },
        initial: "enter" as const,
        animate: "center" as const,
        exit: "exit" as const,
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Testimonials"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="mx-auto w-full max-w-3xl">
      <div
        role="group"
        aria-label="Filter testimonials by source"
        className="flex flex-wrap justify-center gap-2"
      >
        {FILTERS.map((f) => {
          const activeFilter = f.id === filter;
          const available =
            f.id === "all" || items.some((e) => matchesFilter(e, f.id));
          if (!available) return null;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => selectFilter(f.id)}
              aria-pressed={activeFilter}
              className={`border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                activeFilter
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex min-h-[28rem] items-center sm:mt-10">
        <div className="relative w-full">
        {hasStack ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 border border-border/70 bg-surface/70 sm:translate-x-4 sm:translate-y-4"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 translate-x-1.5 translate-y-1.5 border border-border/80 bg-surface/85 sm:translate-x-2 sm:translate-y-2"
            />
          </>
        ) : null}

        <div className="relative z-10 flex justify-center">
          {reduced ? (
            <div key={active.id} className="flex w-full justify-center">
              <TestimonialCardSwitch event={active} />
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.id}
                {...cardMotion}
                drag={hasStack ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={hasStack ? onDragEnd : undefined}
                className="flex w-full cursor-grab justify-center active:cursor-grabbing"
              >
                <TestimonialCardSwitch event={active} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => paginate(-1)}
          disabled={!hasStack}
          aria-label="Previous testimonial"
          className="flex size-10 items-center justify-center border border-border bg-surface text-foreground transition hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden>&larr;</span>
        </button>

        {showDots ? (
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            role="tablist"
            aria-label="Choose testimonial"
          >
            {filtered.map((e, i) => {
              const current = i === safeIndex;
              return (
                <button
                  key={e.id}
                  type="button"
                  role="tab"
                  aria-selected={current}
                  aria-label={`Testimonial ${i + 1} of ${count}`}
                  onClick={() => goTo(i)}
                  className={`size-2.5 rounded-full border transition ${
                    current
                      ? "border-foreground bg-foreground"
                      : "border-border bg-transparent hover:border-foreground/50"
                  }`}
                />
              );
            })}
          </div>
        ) : (
          <p className="font-mono text-xs tabular-nums text-muted">
            <span className="font-semibold text-foreground">
              {String(safeIndex + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(count).padStart(2, "0")}
          </p>
        )}

        <button
          type="button"
          onClick={() => paginate(1)}
          disabled={!hasStack}
          aria-label="Next testimonial"
          className="flex size-10 items-center justify-center border border-border bg-surface text-foreground transition hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span aria-hidden>&rarr;</span>
        </button>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        <span aria-hidden>&larr; &rarr;</span> to navigate
      </p>

      <p className="sr-only" aria-live="polite">
        Testimonial {safeIndex + 1} of {count}
      </p>
      </div>
    </section>
  );
}
