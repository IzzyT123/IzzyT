"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  site,
  type ProjectDemo,
  type ProjectDemoMedia,
} from "@/data/site";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const ease = [0.22, 1, 0.36, 1] as const;

function posterSrcForMedia(media: ProjectDemoMedia): string {
  return media.kind === "video" ? media.poster : media.src;
}

function DemoMedia({
  media,
  reduceMotion,
}: {
  media: ProjectDemoMedia;
  reduceMotion: boolean;
}) {
  if (media.kind === "image" || reduceMotion) {
    return (
      <Image
        src={posterSrcForMedia(media)}
        alt={media.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
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
      preload="none"
      poster={media.poster}
    >
      <source src={media.src} type="video/mp4" />
    </video>
  );
}

function MediaFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden border border-border bg-background shadow-sm">
      <div className="relative aspect-video">{children}</div>
    </div>
  );
}

function linkClassName() {
  return "text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";
}

function DemoLightbox({
  demo,
  reduceMotion,
  onClose,
}: {
  demo: ProjectDemo;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const media = demo.media;

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

  const showVideo =
    media.kind === "video" && !reduceMotion;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 cursor-default bg-foreground/40 backdrop-blur-[2px]"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[min(90vh,920px)] w-full max-w-5xl flex-col overflow-hidden border border-border bg-surface shadow-lg">
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="min-w-0 font-[family-name:var(--font-fraunces)] text-lg font-semibold leading-snug sm:text-xl"
          >
            {demo.title}
          </h2>
          <button
            type="button"
            className="shrink-0 border border-border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 bg-background p-2 sm:p-4">
          {showVideo ? (
            <video
              key={demo.id}
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
            <div className="relative mx-auto aspect-video w-full max-h-[min(75vh,800px)]">
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

export function DemoShelf() {
  const reduce = usePrefersReducedMotion();
  const demos = (site.projectDemos as readonly ProjectDemo[]).filter(
    (d) => d.shelf !== false,
  );
  const [lightbox, setLightbox] = useState<ProjectDemo | null>(null);

  const openLightbox = useCallback((demo: ProjectDemo) => {
    setLightbox(demo);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <section
      className="border-b border-border bg-surface px-5 py-5 sm:px-8 sm:py-6"
      aria-label="Featured work"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-5"
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
          {demos.map((raw) => {
            const demo = raw;
            const href = site.links[demo.hrefKey];
            const secondary = demo.secondaryLink;
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
                className="flex h-full flex-col border border-border bg-background p-3 shadow-sm sm:p-4"
              >
                <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  {demo.eyebrow}
                </p>
                <button
                  type="button"
                  className="cursor-zoom-in p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                  onClick={() => openLightbox(demo)}
                  aria-haspopup="dialog"
                  aria-label={`Open larger preview: ${demo.title}`}
                >
                  <MediaFrame>
                    <DemoMedia media={demo.media} reduceMotion={reduce} />
                  </MediaFrame>
                </button>
                <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug sm:text-lg">
                  {demo.title}
                </h2>
                {demo.statsLine ? (
                  <p className="mt-2 font-mono text-xs font-semibold tabular-nums text-foreground sm:text-sm">
                    {demo.statsLine}
                  </p>
                ) : null}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {demo.proofLine}
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a
                    href={href}
                    className={linkClassName()}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {demo.ctaLabel}
                  </a>
                  {secondary ? (
                    <a
                      href={site.links[secondary.hrefKey]}
                      className={linkClassName()}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {secondary.label}
                    </a>
                  ) : null}
                </p>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.p
          className="mt-6 text-center sm:mt-7"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.4, ease, delay: 0.1 }}
        >
          <a
            href="#timeline"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>↓</span>
            Scroll for the full timeline
          </a>
        </motion.p>
      </div>

      {lightbox ? (
        <DemoLightbox
          demo={lightbox}
          reduceMotion={reduce}
          onClose={closeLightbox}
        />
      ) : null}
    </section>
  );
}
