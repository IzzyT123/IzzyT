"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  getProjectDemoById,
  site,
  type ProjectDemo,
  type ProjectDemoMedia,
} from "@/data/site";
import changeableTestimonials from "@/data/changeable-testimonials.json";
import gptData from "@/data/gpt-reviews.json";
import { ChangeableFeaturedArticleCard } from "@/components/changeable-featured-article-card";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type LightboxTarget = {
  id: string;
  title: string;
  href?: string;
  ctaLabel?: string;
  media: ProjectDemoMedia;
};

function posterSrcForMedia(media: ProjectDemoMedia): string {
  return media.kind === "video" ? media.poster : media.src;
}

function DemoMedia({
  media,
  reduceMotion,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  media: ProjectDemoMedia;
  reduceMotion: boolean;
  sizes?: string;
}) {
  if (media.kind === "image" || reduceMotion) {
    return (
      <Image
        src={posterSrcForMedia(media)}
        alt={media.alt}
        fill
        className="object-cover transition duration-300 group-hover:scale-[1.015]"
        sizes={sizes}
        loading="lazy"
      />
    );
  }
  return (
    <video
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={media.poster}
    >
      <source src={media.src} type="video/mp4" />
    </video>
  );
}

function MediaFrame({
  children,
  badge,
  flush = false,
}: {
  children: ReactNode;
  badge?: string;
  flush?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-background ${
        flush
          ? ""
          : "border border-border transition duration-200 hover:border-accent"
      }`}
    >
      <div className="relative aspect-video">
        {children}
        {badge ? (
          <span className="pointer-events-none absolute bottom-3 right-3 border border-white/20 bg-foreground/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xs transition group-hover:bg-accent">
            {badge} ⤢
          </span>
        ) : null}
      </div>
    </div>
  );
}

function DemoLightbox({
  target,
  reduceMotion,
  onClose,
}: {
  target: LightboxTarget;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const media = target.media;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const showVideo = media.kind === "video" && !reduceMotion;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 cursor-default bg-foreground/55 backdrop-blur-[2px]"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,920px)] w-full max-w-5xl flex-col overflow-hidden border border-border bg-surface shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="min-w-0 font-[family-name:var(--font-fraunces)] text-xl font-bold uppercase leading-snug tracking-tight sm:text-2xl"
          >
            {target.title}
          </h2>
          <div className="flex items-center gap-2.5">
            {target.href ? (
              <a
                href={target.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-accent bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-accent-foreground transition hover:bg-accent-hover"
              >
                {target.ctaLabel ?? "Open site"}
                <span aria-hidden>↗</span>
              </a>
            ) : null}
            <button
              type="button"
              className="shrink-0 border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-background p-2 sm:p-4">
          {showVideo ? (
            <video
              key={target.id}
              className="mx-auto max-h-[min(75vh,800px)] w-full object-contain"
              controls
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={media.poster}
            >
              <source src={media.src} type="video/mp4" />
            </video>
          ) : (
            <div className="relative mx-auto aspect-video max-h-[min(75vh,800px)] w-full">
              <Image
                src={posterSrcForMedia(media)}
                alt={media.alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const EARLY_GPT_MEDIA: ProjectDemoMedia = {
  kind: "image",
  src: "/demos/changeable-gpt-poster.png",
  alt: "Early ChangeAble custom GPTs including Issoria AI Benefits Tracker 1.1, Prompt Master Pro, and TeamsDev.",
};

export function DemoShelf() {
  const reduce = usePrefersReducedMotion();
  const [lightbox, setLightbox] = useState<LightboxTarget | null>(null);

  const openDemoLightbox = useCallback((demo: ProjectDemo) => {
    setLightbox({
      id: demo.id,
      title: demo.title,
      href: site.links[demo.hrefKey],
      ctaLabel: demo.ctaLabel,
      media: demo.media,
    });
  }, []);

  const openCustomLightbox = useCallback((target: LightboxTarget) => {
    setLightbox(target);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const changeableDemo = getProjectDemoById("changeable")!;
  const gptBuilderDemo = getProjectDemoById("gptBuilderPro")!;
  const appDemos = [
    getProjectDemoById("skimless"),
    getProjectDemoById("canimate"),
    getProjectDemoById("degpt"),
  ].filter((d): d is ProjectDemo => Boolean(d));

  const allTestimonials = changeableTestimonials.testimonials;
  const pullQuotes = allTestimonials.filter(
    (t) => t.id === "global-bank-hocmo" || t.id === "f500-global-cm",
  );
  const caseQuotes = allTestimonials.filter(
    (t) => t.id === "global-eng-od-director" || t.id === "emma-everid",
  );
  const cmi = site.changeable.cmiFeaturedArticle;
  const featuredGptReviews = gptData.reviews.slice(0, 2);

  return (
    <>
      {/* SECTION 1: FEATURED WORK (Flagship Video Cards + Shipped Apps) */}
      <section
        id="work"
        className="border-b border-border bg-background px-5 py-10 sm:px-8 sm:py-14"
        aria-labelledby="work-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="work-heading"
              className="font-[family-name:var(--font-fraunces)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl"
            >
              Featured Work
            </h2>
            <Link
              href="/experiments"
              className="text-sm font-semibold text-accent transition hover:underline"
            >
              All experiments <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Top Row: Two Flagship Video Cards Side-by-Side (Visible Above the Fold) */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Flagship 1: ChangeAble.ai */}
            <article className="group flex flex-col border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:border-accent/60">
              <button
                type="button"
                className="w-full cursor-zoom-in border-b border-border p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                onClick={() => openDemoLightbox(changeableDemo)}
                aria-haspopup="dialog"
                aria-label={`Open larger video preview: ${changeableDemo.title}`}
              >
                <MediaFrame flush badge="Expand video">
                  <DemoMedia
                    media={changeableDemo.media}
                    reduceMotion={reduce}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </MediaFrame>
              </button>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Head of AI at Issoria · Enterprise Platform
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                    <a
                      href={site.links.changeable}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {site.changeable.heading}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {site.changeable.summary}
                  </p>

                  {/* Clean hairline row for 2024 Custom GPT Suite thumbnail (no nested box) */}
                  <div className="mt-5 flex items-center gap-3.5 border-t border-border/80 pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        openCustomLightbox({
                          id: "changeable-early-gpts",
                          title: "Early ChangeAble Custom GPT Suite (2024)",
                          href: site.links.changeable,
                          ctaLabel: "ChangeAble.ai",
                          media: EARLY_GPT_MEDIA,
                        })
                      }
                      className="group/thumb relative aspect-video w-24 shrink-0 cursor-zoom-in overflow-hidden border border-border"
                      aria-label="Open screenshot of early ChangeAble custom GPT suite"
                    >
                      <Image
                        src={EARLY_GPT_MEDIA.src}
                        alt={EARLY_GPT_MEDIA.alt}
                        fill
                        className="object-cover transition duration-300 group-hover/thumb:scale-105"
                        sizes="96px"
                      />
                    </button>
                    <p className="text-xs leading-relaxed text-muted">
                      <span className="font-semibold text-foreground">
                        Custom GPTs → Web App → Client Deployments:
                      </span>{" "}
                      Started as custom GPTs generating structured Excel outputs before evolving into the full platform.
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4">
                  <a
                    href={site.links.changeable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:underline"
                  >
                    <span>ChangeAble.ai</span>
                    <span aria-hidden>↗</span>
                  </a>
                  <a
                    href={site.links.issoria}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-muted transition hover:text-foreground"
                  >
                    issoriachange.com ↗
                  </a>
                </div>
              </div>
            </article>

            {/* Flagship 2: GPT Builder Pro 4.0 */}
            <article className="group flex flex-col border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:border-accent/60">
              <button
                type="button"
                className="w-full cursor-zoom-in border-b border-border p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                onClick={() => openDemoLightbox(gptBuilderDemo)}
                aria-haspopup="dialog"
                aria-label={`Open larger video preview: ${gptBuilderDemo.title}`}
              >
                <MediaFrame flush badge="Expand video">
                  <DemoMedia
                    media={gptBuilderDemo.media}
                    reduceMotion={reduce}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </MediaFrame>
              </button>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    #1 GPT Builder · 100K+ Chats · 4.4★ (1K+ Ratings)
                  </p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                    <a
                      href={site.links.gptBuilderPro}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-accent"
                    >
                      {gptBuilderDemo.title}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {gptBuilderDemo.proofLine}
                  </p>

                  {/* Clean hairline quote row (no nested boxes) */}
                  <div className="mt-5 border-t border-border/80 pt-4">
                    <p className="text-xs leading-relaxed text-muted">
                      <span className="font-semibold text-accent">★★★★★</span>{" "}
                      <span className="font-medium text-foreground">
                        &ldquo;{featuredGptReviews[0]?.textEn ?? featuredGptReviews[0]?.text}&rdquo;
                      </span>{" "}
                      &middot;{" "}
                      <span className="font-medium text-foreground">
                        &ldquo;{featuredGptReviews[1]?.textEn ?? featuredGptReviews[1]?.text}&rdquo;
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4">
                  <a
                    href={site.links.gptBuilderPro}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:underline"
                  >
                    <span>Open in ChatGPT</span>
                    <span aria-hidden>↗</span>
                  </a>
                  <Link
                    href="/testimonials"
                    className="text-sm font-medium text-muted transition hover:text-foreground"
                  >
                    1,000+ ratings &amp; reviews →
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* Second Row: 3 Shipped Apps (Skimless, Canimate, DeGPT) */}
          <motion.div
            id="independent-apps"
            className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3"
            initial={reduce ? "show" : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduce ? 0 : 0.06,
                  delayChildren: reduce ? 0 : 0.04,
                },
              },
            }}
          >
            {appDemos.map((demo) => {
              const href = site.links[demo.hrefKey];
              return (
                <motion.article
                  key={demo.id}
                  variants={{
                    hidden: reduce
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 12 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.45, ease },
                    },
                  }}
                  className="group flex h-full flex-col border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:border-accent/60"
                >
                  <button
                    type="button"
                    className="w-full cursor-zoom-in border-b border-border p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    onClick={() => openDemoLightbox(demo)}
                    aria-haspopup="dialog"
                    aria-label={`Open larger preview: ${demo.title}`}
                  >
                    <MediaFrame
                      flush
                      badge={
                        demo.media.kind === "video"
                          ? "Expand video"
                          : "Expand preview"
                      }
                    >
                      <DemoMedia
                        media={demo.media}
                        reduceMotion={reduce}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </MediaFrame>
                  </button>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {demo.statsLine ?? demo.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-foreground">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {demo.title}
                      </a>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                      {demo.proofLine}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-2 border-t border-border/80 pt-4">
                      <a
                        href={href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:underline"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span>{demo.ctaLabel}</span>
                        <span aria-hidden>↗</span>
                      </a>
                      {demo.experimentSlug ? (
                        <Link
                          href={`/experiments/${demo.experimentSlug}`}
                          className="text-sm font-medium text-muted transition hover:text-foreground"
                        >
                          Write-up →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: ENTERPRISE CLIENT WORK — Deep Navy Architectural Band */}
      <section
        id="client-ai"
        className="border-b border-border bg-accent px-5 py-12 text-accent-foreground sm:px-8 sm:py-16"
        aria-labelledby="client-ai-heading"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Left 5 Columns: Editorial Narrative */}
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Head of AI at Issoria
            </p>
            <h2
              id="client-ai-heading"
              className="mt-1.5 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl"
            >
              Enterprise Client Work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              When enterprise data residency or procurement rules out external SaaS, I design and build working AI agents directly inside the platforms big companies already have approved.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-white/15 pt-5 text-sm font-semibold">
              <a
                href={site.links.issoria}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white transition hover:underline"
              >
                <span>Issoria Change</span>
                <span aria-hidden>↗</span>
              </a>
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-white/80 transition hover:text-white hover:underline"
              >
                <span>Discuss a build</span>
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* Right 7 Columns: 2x2 Architectural Hairline Capability Matrix */}
          <div className="grid grid-cols-1 gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:col-span-7">
            {site.changeable.clientPlatforms.map((platform, idx) => (
              <div
                key={platform.name}
                className="flex flex-col justify-between bg-accent p-6 transition hover:bg-accent-hover sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      {platform.tag}
                    </span>
                    <span className="text-xs font-semibold text-white/40">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                    {platform.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {platform.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CLIENT & INDUSTRY PROOF — Editorial Pull-Quotes + Case Ledger */}
      <section
        id="proof"
        className="border-b border-border bg-surface px-5 py-12 sm:px-8 sm:py-16"
        aria-labelledby="proof-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="proof-heading"
              className="font-[family-name:var(--font-fraunces)] text-2xl font-bold uppercase tracking-tight text-foreground sm:text-3xl"
            >
              Client &amp; Industry Feedback
            </h2>
            <Link
              href="/testimonials"
              className="text-sm font-semibold text-accent transition hover:underline"
            >
              All testimonials <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Architectural Proof Frame (No Floating Uneven White Boxes) */}
          <div className="mt-6 border border-border bg-surface">
            {/* Row 1: Two Short Punchy Quotes Styled as Large Editorial Pull-Quotes */}
            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              {pullQuotes.map((t) => (
                <blockquote
                  key={t.id}
                  className="flex flex-col justify-between p-6 sm:p-8"
                >
                  <p className="text-xl font-semibold leading-snug tracking-tight text-foreground sm:text-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-5 flex items-center gap-2.5 text-sm">
                    <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
                    <span className="font-semibold text-foreground">
                      {t.name}
                    </span>
                    <span className="text-muted">&middot;</span>
                    <span className="text-muted">{t.attributionLine}</span>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Row 2: Two In-Depth Case Quotes Balanced Side-by-Side */}
            <div className="grid grid-cols-1 divide-y divide-border border-t border-border bg-background/35 md:grid-cols-2 md:divide-x md:divide-y-0">
              {caseQuotes.map((t) => (
                <blockquote
                  key={t.id}
                  className="flex flex-col justify-between p-6 sm:p-8"
                >
                  <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-5 border-t border-border/70 pt-4">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {t.attributionLine}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Row 3: Integrated Press Feature Banner */}
            <div className="border-t border-border">
              <ChangeableFeaturedArticleCard
                title={cmi.title}
                body={cmi.excerpt}
                href={cmi.href}
                hrefLabel={cmi.hrefLabel}
                attribution={cmi.attribution}
                dateLabel="Apr 2025"
                dateTime={cmi.sortDate}
                flush
              />
            </div>
          </div>
        </div>

        {lightbox ? (
          <DemoLightbox
            target={lightbox}
            reduceMotion={reduce}
            onClose={closeLightbox}
          />
        ) : null}
      </section>
    </>
  );
}
