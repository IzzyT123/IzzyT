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
      className="border-b border-border bg-surface px-5 py-10 sm:px-8 sm:py-14"
      aria-labelledby="writing-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Posting what I learn
            </p>
            <h2
              id="writing-teaser-heading"
              className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight sm:text-4xl"
            >
              {site.posts.heading}
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            Read all posts <span aria-hidden>→</span>
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {site.posts.intro}
        </p>

        <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="relative flex flex-col justify-between border border-border border-l-[3px] border-l-accent bg-background p-5 transition hover:border-accent/60"
            >
              <Link href={`/blog/${post.slug}`} className="block flex-1">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  {formatPostDate(post.date)}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
                  <span className={post.audio?.src ? "pr-12" : undefined}>
                    {post.title}
                  </span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  {post.excerpt}
                </p>
              </Link>
              {post.audio?.src ? (
                <BlogPlayButton
                  src={post.audio.src}
                  title={post.title}
                  className="absolute right-4 top-4"
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
