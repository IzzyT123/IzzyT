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
  windowTitle,
  badge,
  flush = false,
}: {
  children: ReactNode;
  windowTitle?: string;
  badge?: string;
  flush?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden bg-surface ${
        flush ? "" : "border border-border shadow-xs transition hover:border-accent"
      }`}
    >
      {windowTitle ? (
        <div className="flex items-center justify-between border-b border-border bg-background/80 px-3.5 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-accent/70" aria-hidden />
            <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-muted">
              {windowTitle}
            </span>
          </div>
          {badge ? (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              {badge} ⤢
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="relative aspect-video bg-background">
        {children}
        {!windowTitle && badge ? (
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 border border-white/25 bg-accent/90 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-xs">
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
  const featuredGptReviews = gptData.reviews.slice(0, 6);

  return (
    <>
      {/* SECTION 1: ENTERPRISE AI & CLIENT WORK */}
      <section
        id="enterprise-work"
        className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16"
        aria-labelledby="enterprise-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                01 // Head of AI at Issoria
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
                className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground shadow-2xs transition hover:bg-accent-hover"
              >
                ChangeAble.ai <span aria-hidden>↗</span>
              </a>
              <a
                href={site.links.issoria}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-2xs transition hover:border-accent hover:text-accent"
              >
                issoriachange.com <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* Flagship Product: ChangeAble.ai Architectural Showcase Card */}
          <article className="mt-8 border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_12px_32px_-12px_rgba(15,29,58,0.08)]">
            {/* Top Card Chrome Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
                  Flagship Platform
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Enterprise Change Management AI
                </span>
              </div>
              <a
                href={site.links.changeable}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-semibold text-accent transition hover:underline"
              >
                changeable.ai ↗
              </a>
            </div>

            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              {/* Left 7 Cols: Media Viewport + Early GPT Suite Thumbnail */}
              <div className="flex flex-col justify-between gap-4 bg-background/35 p-5 sm:p-6 lg:col-span-7">
                <button
                  type="button"
                  className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  onClick={() => openDemoLightbox(changeableDemo)}
                  aria-haspopup="dialog"
                  aria-label={`Open larger video preview: ${changeableDemo.title}`}
                >
                  <MediaFrame
                    windowTitle="changeable.ai — product walkthrough"
                    badge="Expand video"
                  >
                    <DemoMedia
                      media={changeableDemo.media}
                      reduceMotion={reduce}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </MediaFrame>
                </button>

                {/* Secondary thumbnail: Early Custom GPTs poster */}
                <div className="flex flex-col gap-4 border border-border bg-surface p-3.5 sm:flex-row sm:items-center">
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
                    className="group relative aspect-video w-full shrink-0 cursor-zoom-in overflow-hidden border border-border sm:w-44"
                    aria-label="Open screenshot of early ChangeAble custom GPT suite"
                  >
                    <Image
                      src={EARLY_GPT_MEDIA.src}
                      alt={EARLY_GPT_MEDIA.alt}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="176px"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 right-1.5 bg-accent/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-white">
                      Zoom ⤢
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      2024 Origin · Custom GPT Suite
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                      Started as custom GPTs generating structured Excel outputs (Issoria AI Benefits Tracker, Change Impact Assessment) before evolving into the full ChangeAble.ai platform and internal client deployments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Product Story + Progression Table */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {site.changeable.heading}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                    {site.changeable.summary}
                  </p>

                  <div className="mt-6 border border-border divide-y divide-border bg-background/25">
                    {site.changeable.phases.map((phase, idx) => (
                      <div key={phase.sortDate} className="p-3.5 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sm font-semibold text-foreground">
                            {phase.label}
                          </span>
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                            0{idx + 1} · {phase.date}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted sm:text-sm">
                          {phase.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <a
                    href={site.links.changeable}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition hover:bg-accent-hover"
                  >
                    Visit ChangeAble.ai <span aria-hidden>↗</span>
                  </a>
                  <a
                    href={site.links.issoria}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
                  >
                    Issoria Change ↗
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Client AI Tooling Matrix: Copilot, Claude, Amazon Quick, Internal AI Tooling */}
          <div id="client-builds" className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Enterprise Advisory &amp; Engineering
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Client AI Builds — Inside the Enterprise Boundary
                </h3>
              </div>
              <p className="font-mono text-xs text-muted">
                When data cannot leave the client&apos;s environment
              </p>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              When enterprise data residency or procurement rules out external SaaS, I design and build working AI agents directly inside the platforms big companies already have approved:
            </p>

            {/* 4-Column Architectural Hairline Matrix */}
            <div className="mt-6 grid grid-cols-1 gap-px border border-border bg-border shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] sm:grid-cols-2 lg:grid-cols-4">
              {site.changeable.clientPlatforms.map((platform, idx) => (
                <div
                  key={platform.name}
                  className="flex flex-col justify-between bg-surface"
                >
                  <div className="flex items-center justify-between border-b border-border/80 bg-background/50 px-5 py-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {platform.tag}
                    </span>
                  </div>
                  <div className="flex-1 p-5 sm:p-6">
                    <h4 className="text-lg font-bold tracking-tight text-foreground">
                      {platform.name}
                    </h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">
                      {platform.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Testimonials + CMI Press Feature */}
          <div className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                  Verified Impact
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  What Enterprise Clients &amp; Industry Say
                </h3>
              </div>
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-2xs transition hover:border-accent hover:text-accent"
              >
                All testimonials <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((t, idx) => (
                <article
                  key={t.id}
                  className="flex flex-col justify-between border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)]"
                >
                  <div className="flex items-center justify-between border-b border-border/80 bg-background/50 px-6 py-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      Enterprise Client Quote
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-muted">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 p-6">
                    <blockquote className="text-sm leading-relaxed text-foreground sm:text-[15px]">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>
                  <footer className="border-t border-border/80 bg-background/35 px-6 py-3.5">
                    <p className="text-sm font-bold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted">
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
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                02 // Independent Builds &amp; Public Launches
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
              className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-2xs transition hover:border-accent hover:text-accent"
            >
              All experiments <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Featured Hit: GPT Builder Pro 4.0 Architectural Card */}
          <article className="mt-8 border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_12px_32px_-12px_rgba(15,29,58,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/60 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2.5">
                <span className="bg-accent px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
                  #1 GPT Builder Globally
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  OpenAI GPT Store
                </span>
              </div>
              <a
                href={site.links.gptBuilderPro}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-semibold text-accent transition hover:underline"
              >
                chatgpt.com ↗
              </a>
            </div>

            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <div className="bg-background/35 p-5 sm:p-6 lg:col-span-7">
                <button
                  type="button"
                  className="w-full cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  onClick={() => openDemoLightbox(gptBuilderDemo)}
                  aria-haspopup="dialog"
                  aria-label={`Open larger video preview: ${gptBuilderDemo.title}`}
                >
                  <MediaFrame
                    windowTitle="chatgpt.com — GPT Builder Pro 4.0"
                    badge="Expand video"
                  >
                    <DemoMedia
                      media={gptBuilderDemo.media}
                      reduceMotion={reduce}
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  </MediaFrame>
                </button>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {gptBuilderDemo.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                    {gptBuilderDemo.proofLine}
                  </p>

                  {/* 3-Column Architectural Stat Strip */}
                  <div className="mt-6 grid grid-cols-3 gap-px border border-border bg-border">
                    {site.gptBuilderPro.stats.map((stat) => (
                      <div key={stat.label} className="bg-background/40 p-3.5">
                        <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase leading-none text-accent sm:text-3xl">
                          {stat.value}
                        </p>
                        <p className="mt-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <a
                    href={site.links.gptBuilderPro}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 border border-accent bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition hover:bg-accent-hover"
                  >
                    Open in ChatGPT <span aria-hidden>↗</span>
                  </a>
                  <Link
                    href="/testimonials"
                    className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
                  >
                    More reviews →
                  </Link>
                </div>
              </div>
            </div>

            {/* Full-Width Verified User Reviews Strip */}
            <div className="border-t border-border bg-background/45 p-5 sm:p-6">
              <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  Verified User Feedback · Sampled from 1,000+ Ratings
                </p>
                <span className="font-mono text-xs font-bold tracking-widest text-accent">
                  ★★★★★ 4.4 / 5.0
                </span>
              </div>
              <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                {featuredGptReviews.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col justify-between bg-surface p-4"
                  >
                    <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                      &ldquo;{r.textEn ?? r.text}&rdquo;
                    </p>
                    <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      ★ ChatGPT Store User
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
                  {/* Top Card Metadata Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-border bg-background/50 px-5 py-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                      {demo.eyebrow}
                    </span>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted transition hover:text-accent"
                    >
                      {demo.ctaLabel} ↗
                    </a>
                  </div>

                  {/* Flush Media Viewport */}
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
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
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
                      <p className="mt-2 inline-block self-start border border-border bg-background/60 px-2.5 py-1 font-mono text-[11px] font-semibold tabular-nums text-accent">
                        {demo.statsLine}
                      </p>
                    ) : null}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {demo.proofLine}
                    </p>
                  </div>

                  {/* Card Footer Bar */}
                  <div className="flex items-center justify-between gap-2 border-t border-border/80 bg-background/35 px-5 py-3.5">
                    <a
                      href={href}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent transition hover:underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Launch {demo.ctaLabel} <span aria-hidden>↗</span>
                    </a>
                    {demo.experimentSlug ? (
                      <Link
                        href={`/experiments/${demo.experimentSlug}`}
                        className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
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
