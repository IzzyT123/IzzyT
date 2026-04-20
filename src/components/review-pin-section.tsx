"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { TimelineEvent } from "@/data/build-timeline";
import { site } from "@/data/site";
import { ChangeableFeaturedArticleCard } from "@/components/changeable-featured-article-card";
import { ChangeableTestimonialCard } from "@/components/changeable-testimonial-card";
import { GptReviewBubble } from "@/components/gpt-review-bubble";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Wheel-scrub “stage” (absolute stacking + body lock) used to activate from scroll and
 * swapped layout mid-read, so testimonials jumped over the PROFESSIONAL / PERSONAL labels.
 * Flow layout stays on for normal scrolling; set true only if you reintroduce a dedicated
 * scrub entry (e.g. explicit control) and fix stage vs. header stacking.
 */
const ALLOW_FINE_POINTER_SCRUB_STAGE = false;

function totalWheelDeltaForReviews(reviewCount: number): number {
  const n = Math.max(reviewCount, 1);
  return Math.max(520, 320 + n * 200);
}

function applyBodyScrollLock(scrollY: number) {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function clearBodyScrollLock(savedScrollY: number) {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo({ top: savedScrollY, left: 0, behavior: "instant" });
}

/** Restores scroll Y when body was locked with `top: -Npx` (falls back if unset). */
function readScrollYForUnlock(savedFallback: number): number {
  if (typeof document === "undefined") return savedFallback;
  const raw = document.body.style.top;
  if (!raw || raw === "0px") return savedFallback;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return savedFallback;
  return Math.max(0, -n);
}

function formatDay(iso: string) {
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fadeWidthForCount(n: number): number {
  return Math.max(0.35, Math.min(0.85, 10 / Math.max(n, 1)));
}

/**
 * Taller stage when press articles / testimonials are present so stacked layers
 * don’t visually collide (absolute-positioned rows).
 */
function reviewStageMinHeightExpr(
  nReviews: number,
  hasTallCards: boolean,
  splitColumns: boolean,
  /** Full height only while scroll-scrub is active; idle uses a short strip so gaps don’t balloon */
  scrubActive: boolean,
): string {
  const n = Math.max(nReviews, 1);
  const spread = Math.min(n, 10);
  /** Narrow columns wrap more text — need extra vertical room */
  const splitBoostRem = splitColumns ? (hasTallCards ? 10 : 4) : 0;
  const baseRem = hasTallCards
    ? 14 + spread * 2.35 + splitBoostRem
    : 5.25 + spread * 1.72 + (splitColumns ? 3 : 0);
  const floorRem = hasTallCards ? (splitColumns ? 26 : 15) : 9;

  if (!scrubActive) {
    /** Idle: hard-capped — review count used to scale only slightly so gaps don’t track toward 20rem+ */
    const idleCore = hasTallCards
      ? 6 + spread * 0.65 + (splitColumns ? 2.5 : 0)
      : 3.5 + spread * 0.45 + (splitColumns ? 1.5 : 0);
    const capIdle = hasTallCards ? (splitColumns ? 14 : 13) : 9;
    return `min(${capIdle}rem, max(6rem, ${idleCore}rem))`;
  }

  /** Scrubbing: allow viewport-based room so layers don’t collide */
  const capVh = hasTallCards ? (splitColumns ? 48 : 42) : 28;
  const capRem = hasTallCards ? (splitColumns ? 40 : 32) : 18;
  return `min(${capVh}vh, min(${capRem}rem, max(${floorRem}rem, ${baseRem}rem)))`;
}

/** Extra vertical reserve below anchor band when cards are tall. */
function stageBottomReservePct(hasTallCards: boolean): number {
  return hasTallCards ? 34 : 26;
}

function reviewBubbleTopPercent(
  index: number,
  total: number,
  reservePct: number,
): string {
  const n = Math.max(total, 1);
  if (n === 1) return "0";
  const usable = 100 - reservePct;
  /** First card in a column sits flush to the top so left/right columns align */
  if (index === 0) return "0";
  return `${(index / (n - 1)) * usable}%`;
}

type StripHAlign = "left" | "center" | "right";

/** ChangeAble press + testimonials vs GPT reviews / bubbles */
function pinColumnForEvent(e: TimelineEvent): "professional" | "personal" {
  if (e.kind === "article" || e.kind === "testimonial") return "professional";
  return "personal";
}

/** Stack vertically within each column so a lone testimonial sits high, not mid-stage. */
function columnVerticalMetrics(
  pinItems: TimelineEvent[],
  globalIndex: number,
): { indexInCol: number; countInCol: number } {
  const target = pinItems[globalIndex];
  if (!target) return { indexInCol: 0, countInCol: 1 };
  const col = pinColumnForEvent(target);
  const sameCol = pinItems.filter((e) => pinColumnForEvent(e) === col);
  const countInCol = sameCol.length;
  const indexInCol = sameCol.findIndex((e) => e.id === target.id);
  return {
    indexInCol: indexInCol >= 0 ? indexInCol : 0,
    countInCol,
  };
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Stable pseudo-random horizontal lane per timeline item (SSR-safe). */
function stripHAlignFromId(id: string): StripHAlign {
  const h = hashString(id) % 3;
  if (h === 0) return "left";
  if (h === 1) return "center";
  return "right";
}

function stripAlignFlexClass(h: StripHAlign): string {
  switch (h) {
    case "left":
      return "justify-start pl-1 sm:pl-2";
    case "center":
      return "justify-center px-2";
    case "right":
      return "justify-end pr-1 sm:pr-4";
    default:
      return "justify-start";
  }
}

/** Pull GPT bubbles up over each other to cut vertical scroll; later items paint above */
function gptBubbleStackWrapClass(stackIndex: number): string {
  const base = "relative isolate";
  if (stackIndex === 0) return base;
  return `${base} -mt-8 sm:-mt-10 md:-mt-11`;
}

/** Tail tucks under the matching side; centered cards pick a side from id. */
function gptTailAlignFromStrip(
  h: StripHAlign,
  id: string,
): "left" | "right" {
  if (h === "left") return "left";
  if (h === "right") return "right";
  return hashString(`${id}:tail`) % 2 === 0 ? "left" : "right";
}

/** Same entrance/exit as {@link GptReviewBubble} for flow-layout press + testimonials */
function flowReviewCardMotion(motionIdx: number) {
  return {
    style: { transformOrigin: "center bottom" as const },
    initial: { opacity: 0, y: 12, scale: 0.2 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: false, amount: 0.2, margin: "-6% 0px -6% 0px" },
    transition: {
      duration: 0.48,
      delay: motionIdx * 0.055,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
}

/** Shared wheel-scrub motion for stacked quote bubbles. */
function ScrubStripLayer({
  index,
  total,
  progressMv,
  horizontal,
  children,
  /** Default 0.96: subtle lift for cards; use ~0.2 for speech-bubble “pop” */
  enterScaleFrom = 0.96,
}: {
  index: number;
  total: number;
  progressMv: MotionValue<number>;
  horizontal: StripHAlign;
  children: ReactNode;
  enterScaleFrom?: number;
}) {
  const n = Math.max(total, 1);
  const fade = fadeWidthForCount(n);
  const stackPx = index * -5;

  const opacity = useTransform(progressMv, (p) => {
    if (n === 1) {
      if (p >= 0.25) return 1;
      const v = Math.min(1, p / 0.25);
      return Math.max(v, 0.48 + p * 5);
    }
    const t = p * n;
    let raw: number;
    if (t <= index) raw = 0;
    else if (t >= index + fade) raw = 1;
    else raw = (t - index) / fade;
    if (index === 0 && raw < 0.55) return Math.max(raw, 0.52 + p * 6);
    return raw;
  });

  const y = useTransform(progressMv, (p) => {
    if (n === 1) {
      const o = p <= 0 ? 0 : p >= 0.25 ? 1 : p / 0.25;
      return (1 - o) * 14 + stackPx;
    }
    const t = p * n;
    let enter = 0;
    if (t <= index) enter = 14;
    else if (t >= index + fade) enter = 0;
    else enter = 14 * (1 - (t - index) / fade);
    return enter + stackPx;
  });

  const scaleMin = enterScaleFrom;
  const scale = useTransform(progressMv, (p) => {
    if (n === 1) {
      const o = p <= 0 ? 0 : p >= 0.25 ? 1 : p / 0.25;
      return scaleMin + o * (1 - scaleMin);
    }
    const t = p * n;
    if (t <= index) return scaleMin;
    if (t >= index + fade) return 1;
    return scaleMin + ((t - index) / fade) * (1 - scaleMin);
  });

  const originStyle =
    enterScaleFrom < 0.9 ? { transformOrigin: "center bottom" as const } : {};

  return (
    <motion.div
      className={`pointer-events-none flex w-full items-start ${stripAlignFlexClass(horizontal)}`}
      style={{ opacity, y, scale, zIndex: index + 1, ...originStyle }}
    >
      <div className="pointer-events-auto">{children}</div>
    </motion.div>
  );
}

function ScrollReviewBubble({
  review,
  index,
  total,
  progressMv,
  stripAlign,
}: {
  review: TimelineEvent;
  index: number;
  total: number;
  progressMv: MotionValue<number>;
  stripAlign?: StripHAlign;
}) {
  const h = stripAlign ?? stripHAlignFromId(review.id);
  return (
    <ScrubStripLayer
      index={index}
      total={total}
      progressMv={progressMv}
      horizontal={h}
      enterScaleFrom={0.2}
    >
      <div className="w-full max-w-[min(100%,42rem)] [&_blockquote]:text-base [&_blockquote]:leading-relaxed">
        <GptReviewBubble
          quote={review.body}
          quoteEn={review.quoteEn}
          lang={review.lang ?? "en"}
          dateLabel={formatDay(review.sortDate)}
          dateTime={review.sortDate}
          motionIndex={index}
          motionStyle={{ opacity: 1 }}
          tailAlign={gptTailAlignFromStrip(h, review.id)}
          bubbleFill="surface"
          shellClassName="shadow-none"
        />
      </div>
    </ScrubStripLayer>
  );
}

function ScrollChangeableTestimonial({
  event,
  index,
  total,
  progressMv,
  stripAlign,
}: {
  event: TimelineEvent;
  index: number;
  total: number;
  progressMv: MotionValue<number>;
  stripAlign?: StripHAlign;
}) {
  return (
    <ScrubStripLayer
      index={index}
      total={total}
      progressMv={progressMv}
      horizontal={stripAlign ?? stripHAlignFromId(event.id)}
    >
      <div className="w-full max-w-[min(100%,48rem)]">
        <ChangeableTestimonialCard
          event={event}
          dateLabel={formatDay(event.sortDate)}
        />
      </div>
    </ScrubStripLayer>
  );
}

function ScrollFeaturedArticle({
  event,
  index,
  total,
  progressMv,
  stripAlign,
}: {
  event: TimelineEvent;
  index: number;
  total: number;
  progressMv: MotionValue<number>;
  stripAlign?: StripHAlign;
}) {
  return (
    <ScrubStripLayer
      index={index}
      total={total}
      progressMv={progressMv}
      horizontal={stripAlign ?? stripHAlignFromId(event.id)}
    >
      <div className="w-full max-w-[min(100%,52rem)]">
        <ChangeableFeaturedArticleCard
          title={event.title}
          body={event.body}
          href={event.href ?? "#"}
          hrefLabel={event.hrefLabel ?? "Read the article"}
          attribution={event.attribution}
          dateLabel={formatDay(event.sortDate)}
          dateTime={event.sortDate}
        />
      </div>
    </ScrubStripLayer>
  );
}

type Props = {
  reviews: TimelineEvent[];
};

type Phase = "idle" | "active" | "done";

type ScrubMode = "forward" | "reverse";

function subscribeFinePointer(cb: () => void) {
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getFinePointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

function getFinePointerServerSnapshot() {
  return true;
}

function startProgressAfterLock(count: number): number {
  if (count <= 1) return 0.08;
  return Math.min(0.12, 0.45 / count);
}

export function ReviewPinSection({ reviews }: Props) {
  const pinItems = reviews.filter(
    (e) =>
      e.kind === "review" ||
      e.kind === "testimonial" ||
      e.kind === "article",
  );
  const hasTallCards = pinItems.some(
    (e) => e.kind === "testimonial" || e.kind === "article",
  );
  const reservePct = stageBottomReservePct(hasTallCards);
  const reduced = usePrefersReducedMotion();
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const progressRef = useRef(progress);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const savedScrollRef = useRef(0);
  const accumRef = useRef(0);
  const completingRef = useRef(false);
  const modeRef = useRef<ScrubMode>("forward");
  const lastScrollYRef = useRef(0);
  const forwardExitRef = useRef<() => void>(() => {});
  const reverseExitRef = useRef<() => void>(() => {});

  const n = pinItems.length;

  const professionalItems = pinItems.filter(
    (e) => e.kind === "article" || e.kind === "testimonial",
  );
  const personalItems = pinItems.filter((e) => e.kind === "review");
  const splitReviewColumns =
    professionalItems.length > 0 && personalItems.length > 0;

  /** GPT-only pin blocks (e.g. Feb 2025 / Feb 2024): keep bubbles in the right column like split months */
  const reviewsOnlyRightHalf =
    !splitReviewColumns &&
    professionalItems.length === 0 &&
    personalItems.length > 0;

  /** Wheel-scrub stage only while active; otherwise use normal flow so absolute layers don’t bleed into the next month */
  const scrubbingWithPointer =
    ALLOW_FINE_POINTER_SCRUB_STAGE &&
    finePointer &&
    !reduced &&
    phase === "active";

  /** Clears body lock and refs when leaving active; returns whether a session was in progress. */
  const releaseInteractiveLockSync = useCallback((): boolean => {
    if (phaseRef.current !== "active") return false;
    const y = readScrollYForUnlock(savedScrollRef.current);
    clearBodyScrollLock(y);
    phaseRef.current = "idle";
    progressRef.current.set(0);
    accumRef.current = 0;
    modeRef.current = "forward";
    completingRef.current = false;
    return true;
  }, []);

  const abortInteractiveSession = useCallback(() => {
    if (!releaseInteractiveLockSync()) return;
    setPhase("idle");
  }, [releaseInteractiveLockSync]);

  useLayoutEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    lastScrollYRef.current = window.scrollY;
  }, []);

  useLayoutEffect(() => {
    forwardExitRef.current = () => {
      if (phaseRef.current !== "active" || completingRef.current) return;
      if (modeRef.current !== "forward") return;
      completingRef.current = true;
      phaseRef.current = "done";
      setPhase("done");
      progressRef.current.set(1);

      const saved = savedScrollRef.current;
      clearBodyScrollLock(saved);

      const advance = Math.min(Math.round(window.innerHeight * 0.48), 520);
      requestAnimationFrame(() => {
        window.scrollTo({
          top: saved + advance,
          left: 0,
          behavior: "instant",
        });
        completingRef.current = false;
      });
    };

    reverseExitRef.current = () => {
      if (phaseRef.current !== "active" || completingRef.current) return;
      if (modeRef.current !== "reverse") return;
      completingRef.current = true;
      phaseRef.current = "idle";
      setPhase("idle");
      progressRef.current.set(0);

      const saved = savedScrollRef.current;
      clearBodyScrollLock(saved);

      const advance = Math.min(Math.round(window.innerHeight * 0.48), 520);
      requestAnimationFrame(() => {
        window.scrollTo({
          top: Math.max(0, saved - advance),
          left: 0,
          behavior: "instant",
        });
        completingRef.current = false;
      });
    };
  }, []);

  useEffect(() => {
    if (
      !ALLOW_FINE_POINTER_SCRUB_STAGE ||
      phase !== "idle" ||
      reduced ||
      !finePointer
    )
      return;

    const tryEnter = () => {
      if (phaseRef.current !== "idle") return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const top = rect.top;
      const y = window.scrollY;
      const prevY = lastScrollYRef.current;
      lastScrollYRef.current = y;
      const scrollingUp = y < prevY;

      if (top > 80 || top < -120) return;

      const totalDelta = totalWheelDeltaForReviews(n);
      const startP = startProgressAfterLock(n);

      /** On scroll-up entry, snap so section top sits here; avoids locking with reviews clipped at the top. */
      const alignScrollToSectionTop = (targetTopPx: number) => {
        const alignY = Math.max(0, y + top - targetTopPx);
        if (alignY !== y) {
          window.scrollTo({ top: alignY, left: 0, behavior: "instant" });
        }
        const lockedY = window.scrollY;
        lastScrollYRef.current = lockedY;
        return lockedY;
      };

      // px from viewport top — same visual anchor as a typical forward entry (section top near viewport top)
      const lockAlignTop = 8;

      if (scrollingUp) {
        modeRef.current = "reverse";
        phaseRef.current = "active";
        savedScrollRef.current = alignScrollToSectionTop(lockAlignTop);
        accumRef.current = totalDelta;
        applyBodyScrollLock(savedScrollRef.current);
        progressRef.current.set(1);
        setPhase("active");
        return;
      }

      modeRef.current = "forward";
      phaseRef.current = "active";
      savedScrollRef.current = y;
      accumRef.current = startP * totalDelta;
      applyBodyScrollLock(savedScrollRef.current);
      progressRef.current.set(startP);
      setPhase("active");
    };

    window.addEventListener("scroll", tryEnter, { passive: true });
    tryEnter();
    return () => window.removeEventListener("scroll", tryEnter);
  }, [phase, reduced, finePointer, n]);

  useEffect(() => {
    if (phase !== "active" || reduced || !finePointer) return;

    const totalDelta = totalWheelDeltaForReviews(n);
    const startP = startProgressAfterLock(n);

    const onWheel = (e: WheelEvent) => {
      if (phaseRef.current !== "active") return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      e.preventDefault();
      e.stopPropagation();

      accumRef.current += e.deltaY;
      accumRef.current = Math.max(0, Math.min(totalDelta, accumRef.current));
      const p = accumRef.current / totalDelta;
      progressRef.current.set(p);

      if (modeRef.current === "forward" && p >= 0.998) {
        forwardExitRef.current();
      } else if (modeRef.current === "reverse" && p <= startP + 0.02) {
        reverseExitRef.current();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      abortInteractiveSession();
    };
  }, [phase, n, reduced, finePointer, abortInteractiveSession]);

  useEffect(() => {
    if (phase !== "active" || reduced || !finePointer) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (modeRef.current === "forward") {
        accumRef.current = totalWheelDeltaForReviews(n);
        progressRef.current.set(1);
        forwardExitRef.current();
      } else {
        accumRef.current = 0;
        progressRef.current.set(0);
        reverseExitRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      abortInteractiveSession();
    };
  }, [phase, n, reduced, finePointer, abortInteractiveSession]);

  useEffect(() => {
    if (phase !== "done" || reduced || !finePointer) return;

    const resetWhenGone = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const out =
        rect.bottom < -80 || rect.top > window.innerHeight + 80;
      if (out) {
        setPhase("idle");
        phaseRef.current = "idle";
      }
    };

    window.addEventListener("scroll", resetWhenGone, { passive: true });
    resetWhenGone();
    return () => window.removeEventListener("scroll", resetWhenGone);
  }, [phase, reduced, finePointer]);

  useEffect(() => {
    return () => {
      if (phaseRef.current === "active") {
        clearBodyScrollLock(readScrollYForUnlock(savedScrollRef.current));
        phaseRef.current = "idle";
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!reduced && finePointer) return;
    if (!releaseInteractiveLockSync()) return;
    queueMicrotask(() => setPhase("idle"));
  }, [reduced, finePointer, releaseInteractiveLockSync]);

  if (n === 0) return null;

  const renderFlowItem = (r: TimelineEvent, motionIdx: number) => {
    const h = stripHAlignFromId(r.id);
    const alignClass = splitReviewColumns
      ? pinColumnForEvent(r) === "professional"
        ? "justify-start"
        : stripAlignFlexClass(h)
      : stripAlignFlexClass(h);

    const rowClass = `flex w-full items-start ${alignClass}`;

    const card =
      r.kind === "article" ? (
        <ChangeableFeaturedArticleCard
          title={r.title}
          body={r.body}
          href={r.href ?? "#"}
          hrefLabel={r.hrefLabel ?? "Read the article"}
          attribution={r.attribution}
          dateLabel={formatDay(r.sortDate)}
          dateTime={r.sortDate}
        />
      ) : r.kind === "testimonial" ? (
        <ChangeableTestimonialCard
          event={r}
          dateLabel={formatDay(r.sortDate)}
        />
      ) : (
        <GptReviewBubble
          quote={r.body}
          quoteEn={r.quoteEn}
          lang={r.lang ?? "en"}
          dateLabel={formatDay(r.sortDate)}
          dateTime={r.sortDate}
          motionIndex={motionIdx}
          tailAlign={gptTailAlignFromStrip(h, r.id)}
          bubbleFill="surface"
          shellClassName="shadow-none"
        />
      );

    if (r.kind === "review" || reduced) {
      return (
        <div key={r.id} className={rowClass}>
          {card}
        </div>
      );
    }

    return (
      <motion.div key={r.id} className={rowClass} {...flowReviewCardMotion(motionIdx)}>
        {card}
      </motion.div>
    );
  };

  if (!scrubbingWithPointer) {
    return (
      <div
        ref={finePointer && !reduced ? containerRef : undefined}
        className="relative z-0 mb-1 mt-0 w-full scroll-mt-20 pt-1 sm:pt-2 sm:mb-2"
      >
        <section aria-label="Timeline quotes, testimonials, and press">
          <div className="w-full max-w-6xl px-0 sm:px-1">
            {splitReviewColumns ? (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-12 md:gap-y-2">
                <div className="space-y-4 pt-1 md:pt-1">
                  {professionalItems.map((r, i) => renderFlowItem(r, i))}
                </div>
                <div>
                  {personalItems.map((r, i) => (
                    <div
                      key={r.id}
                      className={gptBubbleStackWrapClass(i)}
                      style={{ zIndex: 10 + i }}
                    >
                      {renderFlowItem(r, i)}
                    </div>
                  ))}
                </div>
              </div>
            ) : reviewsOnlyRightHalf ? (
              <div className="w-full min-w-0 md:pl-2 lg:pl-4">
                {pinItems.map((r, i) => (
                  <div
                    key={r.id}
                    className={gptBubbleStackWrapClass(i)}
                    style={{ zIndex: 10 + i }}
                  >
                    {renderFlowItem(r, i)}
                  </div>
                ))}
              </div>
            ) : pinItems.every((e) => e.kind === "review") ? (
              <div>
                {pinItems.map((r, i) => (
                  <div
                    key={r.id}
                    className={gptBubbleStackWrapClass(i)}
                    style={{ zIndex: 10 + i }}
                  >
                    {renderFlowItem(r, i)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pinItems.map((r, i) => renderFlowItem(r, i))}
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  const stageMinHeight = reviewStageMinHeightExpr(
    n,
    hasTallCards,
    splitReviewColumns,
    phase === "active",
  );

  return (
    <div
      ref={containerRef}
      className={`relative z-0 mb-1 mt-0 w-full scroll-mt-20 pt-3 sm:mb-2 sm:pt-4 ${
        phase === "active" ? "z-[60]" : ""
      }`}
    >
      <section
        aria-label="Timeline quotes, testimonials, and press"
        aria-live={phase === "active" ? "polite" : undefined}
      >
        <p className="sr-only">
          When this section aligns with the top of the screen, the page pauses.
          Scroll down to move through GPT Builder quotes, ChangeAble customer
          testimonials, and the ChangeAble press highlight; scroll up to rewind.
          Finishing forward nudges the page down; finishing a rewind nudges it
          up by the same distance. On touch devices, items are shown as a list.
          Press Escape to skip the current direction.
        </p>
        <div className="w-full max-w-6xl px-0 sm:px-1">
          <div
            className={
              phase === "active"
                ? "relative w-full pb-8 pt-2 sm:pb-10 sm:pt-3"
                : "relative w-full overflow-visible pb-1 pt-0.5 sm:pb-2 sm:pt-1"
            }
            style={{ minHeight: stageMinHeight }}
          >
            {pinItems.map((r, i) => {
              const col = pinColumnForEvent(r);
              const { indexInCol, countInCol } = columnVerticalMetrics(
                pinItems,
                i,
              );
              const topPct = splitReviewColumns
                ? reviewBubbleTopPercent(indexInCol, countInCol, reservePct)
                : reviewBubbleTopPercent(i, n, reservePct);
              /** Optical: ChangeAble cards sit a hair above GPT bubbles at top:0 — nudge pro column down */
              const topWithAlign =
                splitReviewColumns && col === "professional"
                  ? topPct === "0"
                    ? "0.75rem"
                    : `calc(${topPct} + 0.75rem)`
                  : topPct;
              const positionClass = splitReviewColumns
                ? col === "professional"
                  ? "pointer-events-none absolute left-0 top-0 w-1/2 pr-2 sm:pr-4"
                  : "pointer-events-none absolute left-1/2 top-0 w-1/2 pl-2 sm:pl-4"
                : reviewsOnlyRightHalf
                  ? "pointer-events-none absolute left-1/2 top-0 w-1/2 pl-2 sm:pl-4"
                  : "pointer-events-none absolute inset-x-0 sm:inset-x-1";
              const alignStrip: StripHAlign | undefined = splitReviewColumns
                ? col === "professional"
                  ? "left"
                  : stripHAlignFromId(r.id)
                : undefined;

              return (
                <div
                  key={r.id}
                  className={positionClass}
                  style={{
                    top: topWithAlign,
                    transform: "none",
                  }}
                >
                  {r.kind === "article" ? (
                    <ScrollFeaturedArticle
                      event={r}
                      index={i}
                      total={n}
                      progressMv={progress}
                      stripAlign={alignStrip}
                    />
                  ) : r.kind === "testimonial" ? (
                    <ScrollChangeableTestimonial
                      event={r}
                      index={i}
                      total={n}
                      progressMv={progress}
                      stripAlign={alignStrip}
                    />
                  ) : (
                    <ScrollReviewBubble
                      review={r}
                      index={i}
                      total={n}
                      progressMv={progress}
                      stripAlign={alignStrip}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
