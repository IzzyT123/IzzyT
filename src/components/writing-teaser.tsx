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
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
        {/* Left 4 Columns: Section Header & Navigation */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Notes &amp; Essays
          </p>
          <h2
            id="writing-teaser-heading"
            className="mt-1.5 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-foreground sm:text-4xl"
          >
            {site.posts.heading}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {site.posts.intro}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 border-t border-border pt-5 text-sm font-semibold">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-accent transition hover:underline"
            >
              <span>Read all posts</span>
              <span aria-hidden>→</span>
            </Link>
            <a
              href="/blog/feed.xml"
              className="text-muted transition hover:text-foreground"
            >
              RSS feed
            </a>
          </div>
        </div>

        {/* Right 8 Columns: Editorial Publication Ledger (No 2x2 Box Grid) */}
        <ul className="divide-y divide-border border border-border bg-surface lg:col-span-8">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="group relative flex flex-col justify-between gap-4 p-6 transition hover:bg-background/40 sm:flex-row sm:items-start sm:gap-6 sm:p-7">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <time
                      dateTime={post.date}
                      className="text-xs font-semibold uppercase tracking-wider text-accent tabular-nums"
                    >
                      {formatPostDate(post.date)}
                    </time>
                    {post.audio?.src ? (
                      <div className="relative z-20">
                        <BlogPlayButton
                          src={post.audio.src}
                          title={post.title}
                        />
                      </div>
                    ) : null}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-2 block">
                    <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent sm:mt-6"
                >
                  <span>Read</span>
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
