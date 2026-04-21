import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getProjectDemoById,
  site,
  type ExperimentEntry,
  type ProjectDemoMedia,
} from "@/data/site";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Monthly public builds and side projects—ship, learn, write up.",
};

function posterSrcForMedia(media: ProjectDemoMedia): string {
  return media.kind === "video" ? media.poster : media.src;
}

function experimentMedia(item: ExperimentEntry): ProjectDemoMedia | undefined {
  if (item.media) return item.media;
  if (item.demoId) {
    const demo = getProjectDemoById(item.demoId);
    return demo?.media;
  }
  return undefined;
}

export default function ExperimentsPage() {
  const items = [...site.experiments.items].sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  );

  return (
    <>
      <header className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {site.experiments.heading}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {site.experiments.intro}
          </p>
        </div>
      </header>

      <section
        className="border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10"
        aria-label="Experiments list"
      >
        <div className="mx-auto max-w-6xl">
          {items.length === 0 ? (
            <p className="text-sm text-muted">
              No experiments published yet. Check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-5">
              {items.map((item) => {
                const media = experimentMedia(item);
                const posterSrc = media ? posterSrcForMedia(media) : undefined;
                return (
                  <li key={item.id} className="list-none">
                    <article className="flex h-full flex-col border border-border bg-surface p-3 shadow-sm transition-colors hover:border-foreground/35 sm:p-4">
                      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                        {item.monthly ? "Monthly build" : "Side project"} · {item.period}
                      </p>
                      {posterSrc ? (
                        <Link
                          href={`/experiments/${item.slug}`}
                          className="relative block aspect-video overflow-hidden border border-border"
                          aria-label={`Open ${item.name}`}
                        >
                          <Image
                            src={posterSrc}
                            alt={media?.alt ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading="lazy"
                          />
                        </Link>
                      ) : null}
                      <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug sm:text-lg">
                        <Link
                          href={`/experiments/${item.slug}`}
                          className="underline decoration-transparent underline-offset-4 transition hover:decoration-foreground"
                        >
                          {item.name}
                        </Link>
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                        {item.summary}
                      </p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Link
                          href={`/experiments/${item.slug}`}
                          className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
                        >
                          Read more
                        </Link>
                        {item.urlKey && item.urlKey in site.links ? (
                          <a
                            href={
                              site.links[
                                item.urlKey as keyof typeof site.links
                              ]
                            }
                            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Visit site
                          </a>
                        ) : null}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
