import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  getProjectDemoById,
  site,
  type ExperimentEntry,
  type ProjectDemoMedia,
} from "@/data/site";
import { SiteFooter } from "@/components/site-footer";

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

function findExperiment(slug: string): ExperimentEntry | undefined {
  for (const item of site.experiments.items) {
    if (item.slug === slug) return item;
  }
  return undefined;
}

export async function generateStaticParams() {
  return site.experiments.items.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const item = findExperiment(slug);
  if (!item) return { title: "Experiment not found" };
  return {
    title: item.name,
    description: item.summary,
  };
}

export default async function ExperimentDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findExperiment(slug);
  if (!item) notFound();

  const sorted = [...site.experiments.items].sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  );
  const idx = sorted.findIndex((e) => e.slug === item.slug);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  const media = experimentMedia(item);
  const posterSrc = media ? posterSrcForMedia(media) : undefined;
  const externalHref =
    item.urlKey && item.urlKey in site.links
      ? site.links[item.urlKey as keyof typeof site.links]
      : undefined;

  return (
    <>
      <header className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/experiments"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>←</span>
            Experiments
          </Link>
          <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            {item.monthly ? "Monthly build" : "Side project"} · {item.period}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {item.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {item.summary}
          </p>
          {externalHref ? (
            <p className="mt-4">
              <a
                href={externalHref}
                className="text-sm font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
                rel="noopener noreferrer"
                target="_blank"
              >
                Visit {item.name}
                <span aria-hidden> →</span>
              </a>
            </p>
          ) : null}
        </div>
      </header>

      <article className="border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          {posterSrc ? (
            <div className="relative mb-8 aspect-video overflow-hidden border border-border">
              <Image
                src={posterSrc}
                alt={media?.alt ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
                priority
              />
            </div>
          ) : null}
          {item.body ? (
            <div className="prose prose-neutral max-w-none text-base leading-relaxed text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 hover:[&_a]:decoration-foreground [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-semibold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]">
              <ReactMarkdown>{item.body}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Write-up coming soon. In the meantime, try it:
              {externalHref ? (
                <>
                  {" "}
                  <a
                    href={externalHref}
                    className="font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.name}
                  </a>
                  .
                </>
              ) : null}
            </p>
          )}

          {item.tags && item.tags.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <li
                  key={t}
                  className="border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>

      <nav
        aria-label="More experiments"
        className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          {prev ? (
            <Link
              href={`/experiments/${prev.slug}`}
              className="font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
            >
              <span aria-hidden>←</span> {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/experiments/${next.slug}`}
              className="font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground sm:text-right"
            >
              {next.name} <span aria-hidden>→</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      </nav>

      <SiteFooter />
    </>
  );
}
