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
          <span className="pointer-events-none absolute bottom-3 right-3 border border-white/20 bg-foreground/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xs transition group-hover:bg-accent">
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

  const testimonials = [...changeableTestimonials.testimonials].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const cmi = site.changeable.cmiFeaturedArticle;
  const featuredGptReviews = gptData.reviews.slice(0, 3);

  return (
    <>
      {/* SECTION 1: ENTERPRISE AI & CLIENT WORK */}
      <section
        id="work"
        className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16"
        aria-labelledby="enterprise-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Head of AI at Issoria
            </p>
            <h2
              id="enterprise-heading"
              className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
            >
              Enterprise AI &amp; Client Work
            </h2>
          </div>

          {/* Flagship Product: ChangeAble.ai — Single Clean Split Card */}
          <article className="mt-6 grid grid-cols-1 gap-8 border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_12px_32px_-12px_rgba(15,29,58,0.08)] sm:p-8 lg:grid-cols-12 lg:gap-10">
            {/* Left 7 Cols: Product Video + Early GPT Suite Thumbnail */}
            <div className="flex flex-col justify-between gap-4 lg:col-span-7">
              <button
                type="button"
                className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                onClick={() => openDemoLightbox(changeableDemo)}
                aria-haspopup="dialog"
                aria-label={`Open larger video preview: ${changeableDemo.title}`}
              >
                <MediaFrame badge="Expand video">
                  <DemoMedia
                    media={changeableDemo.media}
                    reduceMotion={reduce}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </MediaFrame>
              </button>

              {/* Early Custom GPTs origin strip */}
              <div className="flex flex-col gap-4 border border-border bg-background/50 p-3.5 sm:flex-row sm:items-center">
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
                  className="group relative aspect-video w-full shrink-0 cursor-zoom-in overflow-hidden border border-border sm:w-40"
                  aria-label="Open screenshot of early ChangeAble custom GPT suite"
                >
                  <Image
                    src={EARLY_GPT_MEDIA.src}
                    alt={EARLY_GPT_MEDIA.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="160px"
                  />
                  <span className="pointer-events-none absolute bottom-1.5 right-1.5 bg-foreground/80 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
                    Zoom ⤢
                  </span>
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                    2024 Prototype → Enterprise Platform
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                    Started as custom GPTs generating structured Excel outputs before evolving into the full ChangeAble.ai platform and internal client deployments.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Product Story + Clean Progression List */}
            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                  Flagship Product
                </p>
                <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {site.changeable.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {site.changeable.summary}
                </p>

                <ol className="mt-6 space-y-4 border-l-2 border-border pl-5">
                  {site.changeable.phases.map((phase) => (
                    <li key={phase.sortDate}>
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-sm font-bold text-foreground">
                          {phase.label}
                        </span>
                        <span className="font-mono text-[11px] font-medium text-accent">
                          {phase.date}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                        {phase.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-5">
                <a
                  href={site.links.changeable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
                >
                  <span>Visit ChangeAble.ai</span>
                  <span aria-hidden>↗</span>
                </a>
                <a
                  href={site.links.issoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
                >
                  <span>issoriachange.com</span>
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </article>

          {/* Client AI Tooling: Copilot, Claude, Amazon Quick, Internal AI Tooling */}
          <div id="client-builds" className="mt-14">
            <div className="max-w-3xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Enterprise Advisory &amp; Engineering
              </p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Client AI Builds — Inside the Enterprise Boundary
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                When enterprise data residency or procurement rules out external SaaS, I design and build working AI agents directly inside the platforms big companies already have approved:
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {site.changeable.clientPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col justify-between border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_8px_24px_-12px_rgba(15,29,58,0.07)]"
                >
                  <div>
                    <span className="inline-block border border-border bg-background px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                      {platform.tag}
                    </span>
                    <h4 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                      {platform.name}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {platform.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Testimonials + CMI Press Feature */}
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Client Feedback
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  What Enterprise Clients &amp; Industry Say
                </h3>
              </div>
              <Link
                href="/testimonials"
                className="text-sm font-semibold text-accent transition hover:underline"
              >
                View all testimonials <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="flex flex-col justify-between border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_8px_24px_-12px_rgba(15,29,58,0.07)] sm:p-7"
                >
                  <blockquote className="text-sm leading-relaxed text-foreground sm:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-5 border-t border-border/70 pt-4">
                    <p className="text-sm font-bold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {t.attributionLine}
                    </p>
                  </footer>
                </article>
              ))}
            </div>

            <div className="mt-5">
              <ChangeableFeaturedArticleCard
                title={cmi.title}
                body={cmi.excerpt}
                href={cmi.href}
                hrefLabel={cmi.hrefLabel}
                attribution={cmi.attribution}
                dateLabel="Apr 2025"
                dateTime={cmi.sortDate}
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHIPPED AI APPS & TOOLS */}
      <section
        id="shipped-apps"
        className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16"
        aria-labelledby="shipped-apps-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Independent Builds &amp; Public Launches
              </p>
              <h2
                id="shipped-apps-heading"
                className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
              >
                AI Apps &amp; Agents I&apos;ve Shipped
              </h2>
            </div>
            <Link
              href="/experiments"
              className="text-sm font-semibold text-accent transition hover:underline"
            >
              All experiments <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Featured Hit: GPT Builder Pro 4.0 */}
          <article className="mt-6 border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_12px_32px_-12px_rgba(15,29,58,0.08)] sm:p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <button
                  type="button"
                  className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  onClick={() => openDemoLightbox(gptBuilderDemo)}
                  aria-haspopup="dialog"
                  aria-label={`Open larger video preview: ${gptBuilderDemo.title}`}
                >
                  <MediaFrame badge="Expand video">
                    <DemoMedia
                      media={gptBuilderDemo.media}
                      reduceMotion={reduce}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </MediaFrame>
                </button>
              </div>

              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    OpenAI GPT Store · #1 Globally in Category
                  </p>
                  <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {gptBuilderDemo.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                    {gptBuilderDemo.proofLine}
                  </p>

                  {/* Clean 3-Stat Row */}
                  <div className="mt-6 grid grid-cols-3 divide-x divide-border border-y border-border py-4">
                    {site.gptBuilderPro.stats.map((stat, idx) => (
                      <div
                        key={stat.label}
                        className={idx === 0 ? "pr-3" : "px-3"}
                      >
                        <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase leading-none text-accent sm:text-3xl">
                          {stat.value}
                        </p>
                        <p className="mt-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={site.links.gptBuilderPro}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
                  >
                    <span>Open in ChatGPT</span>
                    <span aria-hidden>↗</span>
                  </a>
                  <Link
                    href="/testimonials"
                    className="text-sm font-medium text-muted transition hover:text-foreground"
                  >
                    Read user reviews →
                  </Link>
                </div>
              </div>
            </div>

            {/* Clean 3-Column User Feedback Strip */}
            <div className="mt-8 border-t border-border pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {featuredGptReviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-border bg-background/45 px-4 py-3.5"
                  >
                    <p className="text-sm leading-relaxed text-foreground">
                      &ldquo;{r.textEn ?? r.text}&rdquo;
                    </p>
                    <p className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                      ★★★★★ ChatGPT Store Review
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 3-Column Grid: Skimless, Canimate, DeGPT */}
          <motion.div
            id="independent-apps"
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
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
                  className="group flex h-full flex-col border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_14px_34px_-10px_rgba(31,59,115,0.14)]"
                >
                  {/* Flush Media Viewport at Top of Card */}
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

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                      {demo.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {demo.title}
                      </a>
                    </h3>
                    {demo.statsLine ? (
                      <p className="mt-1.5 font-mono text-xs font-medium text-accent">
                        {demo.statsLine}
                      </p>
                    ) : null}
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
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
