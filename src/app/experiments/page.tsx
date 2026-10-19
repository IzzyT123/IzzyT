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
      <header className="border-b border-border bg-accent px-5 py-6 text-accent-foreground sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
            {site.experiments.heading}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
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
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const media = experimentMedia(item);
                const posterSrc = media ? posterSrcForMedia(media) : undefined;
                const externalHref =
                  item.urlKey && item.urlKey in site.links
                    ? site.links[item.urlKey as keyof typeof site.links]
                    : undefined;
                return (
                  <li key={item.id} className="list-none">
                    <article className="group flex h-full flex-col border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_14px_34px_-10px_rgba(31,59,115,0.14)]">
                      <div className="flex items-center justify-between gap-2 border-b border-border bg-background/50 px-5 py-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                          {item.monthly ? "Monthly build" : "Side project"} ·{" "}
                          {item.period}
                        </span>
                      </div>
                      {posterSrc ? (
                        <Link
                          href={`/experiments/${item.slug}`}
                          className="relative block aspect-video overflow-hidden border-b border-border bg-background"
                          aria-label={`Open ${item.name}`}
                        >
                          <Image
                            src={posterSrc}
                            alt={media?.alt ?? ""}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.015]"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            loading="lazy"
                          />
                        </Link>
                      ) : null}
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <h2 className="text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                          <Link
                            href={`/experiments/${item.slug}`}
                            className="transition-colors hover:text-accent"
                          >
                            {item.name}
                          </Link>
                        </h2>
                        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">
                          {item.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 border-t border-border/80 bg-background/35 px-5 py-3.5">
                        <Link
                          href={`/experiments/${item.slug}`}
                          className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent transition hover:underline"
                        >
                          Read write-up →
                        </Link>
                        {externalHref ? (
                          <a
                            href={externalHref}
                            className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Visit site ↗
                          </a>
                        ) : null}
                      </div>
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
