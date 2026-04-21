import Link from "next/link";
import { site } from "@/data/site";

function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function WritingTeaser({ limit = 3 }: { limit?: number } = {}) {
  const posts = [...site.posts.items]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section
      className="border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10"
      aria-labelledby="writing-teaser-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2
            id="writing-teaser-heading"
            className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            {site.posts.heading}
          </h2>
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

        <ul className="mt-5 flex flex-col divide-y divide-border border-y border-border">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="block py-5 transition-colors hover:bg-surface sm:py-6"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  {formatPostDate(post.date)}
                </p>
                <h3 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
