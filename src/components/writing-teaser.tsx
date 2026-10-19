import Link from "next/link";
import { site } from "@/data/site";
import { BlogPlayButton } from "@/components/blog-play-button";

function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function WritingTeaser({ limit = 4 }: { limit?: number } = {}) {
  const posts = [...site.posts.items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      className="border-b border-border bg-background px-5 py-12 sm:px-8 sm:py-16"
      aria-labelledby="writing-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              03 // Notes &amp; Essays
            </p>
            <h2
              id="writing-teaser-heading"
              className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
            >
              {site.posts.heading}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {site.posts.intro}
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-border bg-surface px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-2xs transition hover:border-accent hover:text-accent"
          >
            All posts <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post, idx) => (
            <li key={post.id} className="flex">
              <article className="group relative flex w-full flex-col justify-between border border-border bg-surface shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_14px_34px_-10px_rgba(31,59,115,0.14)]">
                {/* Top Card Metadata Bar */}
                <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-background/50 px-6 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="h-3 w-px bg-border" aria-hidden />
                    <time
                      dateTime={post.date}
                      className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted"
                    >
                      {formatPostDate(post.date)}
                    </time>
                  </div>
                  {post.audio?.src ? (
                    <div className="relative z-20">
                      <BlogPlayButton src={post.audio.src} title={post.title} />
                    </div>
                  ) : post.tags && post.tags.length > 0 ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {post.tags.slice(0, 2).join(" · ")}
                    </span>
                  ) : null}
                </div>

                {/* Card Body */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex flex-1 flex-col justify-between p-6 sm:p-7"
                >
                  <div>
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      Read article
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-sm text-accent transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
