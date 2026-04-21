import Image from "next/image";
import Link from "next/link";
import {
  getProjectDemoById,
  site,
  type ExperimentEntry,
  type ProjectDemoMedia,
} from "@/data/site";

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

export function ExperimentsTeaser({ limit = 3 }: { limit?: number } = {}) {
  const items = [...site.experiments.items]
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section
      className="border-b border-border bg-surface px-5 py-8 sm:px-8 sm:py-10"
      aria-labelledby="experiments-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="experiments-teaser-heading"
            className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {site.experiments.heading}
          </h2>
          <Link
            href="/experiments"
            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            See all experiments <span aria-hidden>→</span>
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {site.experiments.intro}
        </p>

        <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-5">
          {items.map((item) => {
            const media = experimentMedia(item);
            const posterSrc = media ? posterSrcForMedia(media) : undefined;
            return (
              <li key={item.id} className="list-none">
                <article className="flex h-full flex-col border border-border bg-background p-3 shadow-sm transition-colors hover:border-foreground/35 sm:p-4">
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
                  <h3 className="mt-3 font-[family-name:var(--font-fraunces)] text-base font-semibold leading-snug sm:text-lg">
                    <Link
                      href={`/experiments/${item.slug}`}
                      className="underline decoration-transparent underline-offset-4 transition hover:decoration-foreground"
                    >
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
