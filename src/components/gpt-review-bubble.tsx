"use client";

import type { CSSProperties } from "react";
import { motion, type MotionStyle } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import styles from "@/components/gpt-review-bubble.module.css";

type BubbleFill = "surface" | "background";

type Props = {
  quote: string;
  lang: string;
  dateLabel: string;
  dateTime: string;
  /** Stagger index within the month column */
  motionIndex: number;
  /** Scroll-driven motion (e.g. review pin section); skips in-view animation */
  motionStyle?: MotionStyle;
  /** Extra classes for the speech-bubble shell (e.g. lighter stack treatment) */
  shellClassName?: string;
  /** English gloss when the quote is not in English */
  quoteEn?: string;
  /** Which side the tail sits on (e.g. alternate in a column) */
  tailAlign?: "left" | "right";
  /** Must match the shell background so the tail reads as one shape */
  bubbleFill?: BubbleFill;
};

export function GptReviewBubble({
  quote,
  lang,
  dateLabel,
  dateTime,
  motionIndex,
  motionStyle,
  shellClassName = "",
  quoteEn,
  tailAlign = "left",
  bubbleFill = "surface",
}: Props) {
  const reduced = usePrefersReducedMotion();

  const flatElevation = /\bshadow-none\b/.test(shellClassName);
  const stripFilter = /\bfilter-none\b/.test(shellClassName);

  const rootClass = [
    styles.speechRoot,
    flatElevation && styles.speechRootFlat,
    stripFilter && styles.speechRootFilterNone,
    shellClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle = {
    "--p": tailAlign === "left" ? "24%" : "76%",
  } as CSSProperties;

  /** Long thin curved beak; mirrored in CSS when tailAlign is right */
  const tailPath =
    "M 36 0 L 64 0 C 59 16 32 32 11 40 C 14 37 24 32 34 22 C 42 14 46 6 47 0 L 36 0 Z";

  const inner = (
    <div className="relative inline-block max-w-[min(100%,42rem)] align-top">
      <div
        className={rootClass}
        style={rootStyle}
        data-fill={bubbleFill}
      >
        <div className={styles.speechBody}>
          <blockquote
            className="text-sm leading-relaxed text-foreground"
            lang={lang}
          >
            “{quote}”
          </blockquote>
          {quoteEn ? (
            <p
              className="mt-2 border-t border-border/35 pt-2 text-sm leading-relaxed text-muted"
              lang="en"
            >
              <span className="sr-only">English translation: </span>
              {quoteEn}
            </p>
          ) : null}
          <time
            className="mt-2 block font-mono text-[10px] text-muted tabular-nums"
            dateTime={dateTime}
          >
            {dateLabel}
          </time>
        </div>
        <div
          className={styles.speechTail}
          data-align={tailAlign}
          aria-hidden
        >
          <svg viewBox="0 0 72 46" preserveAspectRatio="xMidYMin meet">
            <path d={tailPath} />
          </svg>
        </div>
      </div>
    </div>
  );

  if (reduced) {
    return (
      <figure className="m-0">
        <figcaption className="sr-only">User feedback</figcaption>
        {inner}
      </figure>
    );
  }

  if (motionStyle) {
    return (
      <motion.div className="m-0" style={motionStyle}>
        <figure className="m-0">
          <figcaption className="sr-only">User feedback</figcaption>
          {inner}
        </figure>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="m-0"
      style={{ transformOrigin: "center bottom" }}
      initial={{ opacity: 0, y: 12, scale: 0.2 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2, margin: "-6% 0px -6% 0px" }}
      transition={{
        duration: 0.48,
        delay: motionIndex * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <figure className="m-0">
        <figcaption className="sr-only">User feedback</figcaption>
        {inner}
      </figure>
    </motion.div>
  );
}
