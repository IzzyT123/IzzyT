import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Occasional notes on shipping AI products, tooling, and what I learn from monthly builds.",
};

function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogIndex() {
  const posts = [...site.posts.items].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <>
      <header className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {site.posts.heading}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {site.posts.intro}
          </p>
          <p className="mt-3 text-sm">
            <a
              href="/blog/feed.xml"
              className="font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
            >
              RSS feed
            </a>
          </p>
        </div>
      </header>

      <section
        className="border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10"
        aria-label="Posts"
      >
        <div className="mx-auto max-w-3xl">
          {posts.length === 0 ? (
            <div className="border border-dashed border-border bg-surface p-6 text-center sm:p-8">
              <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight">
                First post coming soon
              </p>
              <p className="mt-2 text-sm text-muted">
                Subscribe via{" "}
                <a
                  href="/blog/feed.xml"
                  className="font-medium underline decoration-border underline-offset-4 transition hover:decoration-foreground"
                >
                  RSS
                </a>{" "}
                to catch it when it lands.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-border border-y border-border">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block py-5 transition-colors hover:bg-surface sm:py-6"
                  >
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                      {formatPostDate(post.date)}
                    </p>
                    <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight sm:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                      {post.excerpt}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
