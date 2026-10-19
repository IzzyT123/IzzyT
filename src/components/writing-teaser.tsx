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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Posting What I Learn
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
            className="text-sm font-semibold text-accent transition hover:underline"
          >
            Read all posts <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id} className="flex">
              <article className="group relative flex w-full flex-col justify-between border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_14px_34px_-10px_rgba(31,59,115,0.14)] sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <time
                      dateTime={post.date}
                      className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-accent"
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

                  <Link href={`/blog/${post.slug}`} className="mt-3 block">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 flex items-center justify-between border-t border-border/70 pt-4 text-sm font-semibold text-accent"
                >
                  <span>Read post</span>
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
