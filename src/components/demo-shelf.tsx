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
}: {
  children: ReactNode;
  badge?: string;
}) {
  return (
    <div className="group relative overflow-hidden border border-border bg-background shadow-sm transition hover:border-accent">
      <div className="relative aspect-video">{children}</div>
      {badge ? (
        <span className="pointer-events-none absolute bottom-2.5 right-2.5 border border-white/25 bg-accent/90 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xs">
          {badge}
        </span>
      ) : null}
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
  const featuredGptReviews = gptData.reviews.slice(0, 6);

  return (
    <>
      {/* SECTION 1: ENTERPRISE AI & CLIENT WORK */}
      <section
        id="enterprise-work"
        className="border-b border-border bg-surface px-5 py-10 sm:px-8 sm:py-14"
        aria-labelledby="enterprise-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                Head of AI at Issoria
              </p>
              <h2
                id="enterprise-heading"
                className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
              >
                Enterprise AI &amp; Client Work
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={site.links.changeable}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition hover:bg-accent-hover"
              >
                ChangeAble.ai <span aria-hidden>↗</span>
              </a>
              <a
                href={site.links.issoria}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-border bg-background px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-accent hover:text-accent"
              >
                issoriachange.com <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* Flagship Product: ChangeAble.ai + Early Custom GPTs */}
          <div className="mt-6 grid grid-cols-1 gap-6 border border-border border-t-[3px] border-t-accent bg-background p-4 shadow-sm sm:p-6 lg:grid-cols-12 lg:gap-8">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <button
                type="button"
                className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                onClick={() => openDemoLightbox(changeableDemo)}
                aria-haspopup="dialog"
                aria-label={`Open larger video preview: ${changeableDemo.title}`}
              >
                <MediaFrame badge="Click to expand video">
                  <DemoMedia
                    media={changeableDemo.media}
                    reduceMotion={reduce}
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                </MediaFrame>
              </button>

              {/* Secondary thumbnail: Early Custom GPTs poster */}
              <div className="flex flex-col gap-3 border border-border bg-surface p-3 sm:flex-row sm:items-center">
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
                </button>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                    From Custom GPTs to Enterprise Platform
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                    Started as custom GPTs generating structured Excel outputs (Issoria AI Benefits Tracker, Change Impact Assessment) before evolving into the full ChangeAble.ai platform and internal client deployments.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Flagship Platform · {changeableDemo.eyebrow}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
                  {site.changeable.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {site.changeable.summary}
                </p>

                <ol className="mt-5 space-y-3 border-l-2 border-accent/30 pl-4">
                  {site.changeable.phases.map((phase) => (
                    <li key={phase.sortDate} className="text-sm leading-snug">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                          {phase.date}
                        </span>
                        <span className="font-semibold text-foreground">
                          {phase.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-sm">
                        {phase.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-4">
                <a
                  href={site.links.changeable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition hover:decoration-accent"
                >
                  Visit ChangeAble.ai ↗
                </a>
                <a
                  href={site.links.issoria}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
                >
                  Issoria Change ↗
                </a>
              </div>
            </div>
          </div>

          {/* Client AI Tooling: Copilot, Claude, Amazon Quick, Internal AI Tooling */}
          <div className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold uppercase tracking-tight text-foreground">
                Client AI Builds — Inside the Enterprise Boundary
              </h3>
              <p className="font-mono text-xs text-muted">
                Microsoft Copilot · Claude · Amazon Quick · Internal AI Platforms
              </p>
            </div>
            <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              When enterprise data residency or procurement rules out external SaaS, I build and deploy AI agents directly inside the tools big companies already have approved:
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {site.changeable.clientPlatforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col border border-border border-l-[3px] border-l-accent bg-background p-4 shadow-xs"
                >
                  <h4 className="font-[family-name:var(--font-fraunces)] text-lg font-bold uppercase tracking-tight text-foreground">
                    {platform.name}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {platform.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Testimonials + CMI Press Feature */}
          <div className="mt-8 border-t border-border pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-bold uppercase tracking-tight text-foreground">
                What Enterprise Clients &amp; Industry Say
              </h3>
              <Link
                href="/testimonials"
                className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
              >
                All testimonials &amp; reviews <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="flex flex-col justify-between border border-border border-l-[3px] border-l-accent bg-background p-4 shadow-xs sm:p-5"
                >
                  <blockquote className="text-sm leading-relaxed text-foreground sm:text-base">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <footer className="mt-4 border-t border-border/60 pt-3">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">{t.attributionLine}</p>
                  </footer>
                </article>
              ))}
            </div>

            <div className="mt-4">
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
        className="border-b border-border bg-background px-5 py-10 sm:px-8 sm:py-14"
        aria-labelledby="shipped-apps-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
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
              className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
            >
              See all experiments <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Featured Hit: GPT Builder Pro 4.0 */}
          <div className="mt-6 grid grid-cols-1 gap-6 border border-border border-t-[3px] border-t-accent bg-surface p-4 shadow-sm sm:p-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <button
                type="button"
                className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                onClick={() => openDemoLightbox(gptBuilderDemo)}
                aria-haspopup="dialog"
                aria-label={`Open larger video preview: ${gptBuilderDemo.title}`}
              >
                <MediaFrame badge="Click to expand video">
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
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  OpenAI GPT Store · #1 Globally in Category
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
                  {gptBuilderDemo.title}
                </h3>

                <div className="mt-3 grid grid-cols-3 gap-2 border-y border-border py-3">
                  {site.gptBuilderPro.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase leading-none text-accent sm:text-3xl">
                        {stat.value}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  {gptBuilderDemo.proofLine}
                </p>

                {/* Sample user reviews */}
                <div className="mt-4">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Recent user feedback (from 1K+ reviews)
                  </p>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {featuredGptReviews.map((r) => (
                      <div
                        key={r.id}
                        className="border border-border bg-background px-3 py-2 text-xs leading-snug text-foreground"
                      >
                        <p className="font-medium">
                          &ldquo;{r.textEn ?? r.text}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <a
                  href={site.links.gptBuilderPro}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition hover:bg-accent-hover"
                >
                  Open in ChatGPT <span aria-hidden>↗</span>
                </a>
                <Link
                  href="/testimonials"
                  className="text-xs font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
                >
                  Read more user reviews →
                </Link>
              </div>
            </div>
          </div>

          {/* 3-Column Grid: Skimless, Canimate, DeGPT */}
          <motion.div
            className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3"
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
                  className="flex h-full flex-col border border-border border-t-[3px] border-t-accent bg-surface p-4 shadow-sm transition hover:border-accent/60"
                >
                  <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                    {demo.eyebrow}
                  </p>
                  <button
                    type="button"
                    className="cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    onClick={() => openDemoLightbox(demo)}
                    aria-haspopup="dialog"
                    aria-label={`Open larger preview: ${demo.title}`}
                  >
                    <MediaFrame
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
                  <h3 className="mt-3 font-[family-name:var(--font-fraunces)] text-xl font-bold uppercase leading-snug tracking-tight text-foreground sm:text-2xl">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-transparent underline-offset-4 transition hover:decoration-foreground"
                    >
                      {demo.title}
                    </a>
                  </h3>
                  {demo.statsLine ? (
                    <p className="mt-1.5 font-mono text-xs font-semibold tabular-nums text-accent">
                      {demo.statsLine}
                    </p>
                  ) : null}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {demo.proofLine}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                    <a
                      href={href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 transition hover:decoration-accent"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {demo.ctaLabel} <span aria-hidden>↗</span>
                    </a>
                    {demo.experimentSlug ? (
                      <Link
                        href={`/experiments/${demo.experimentSlug}`}
                        className="text-xs font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
                      >
                        Write-up →
                      </Link>
                    ) : null}
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
