import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { SiteFooter } from "@/components/site-footer";
import { BlogPlayButton } from "@/components/blog-play-button";

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
      <header className="border-b border-border bg-accent px-5 py-6 text-accent-foreground sm:px-8 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
            >
              <span aria-hidden>←</span>
              Home
            </Link>
            <div className="flex items-center gap-4">
              <a
                href={site.links.x}
                className="text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Follow Izzy Thomson on X"
              >
                Follow on X
              </a>
              <a
                href={site.links.linkedin}
                className="text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
                rel="noopener noreferrer"
                target="_blank"
                aria-label="Follow Izzy Thomson on LinkedIn"
              >
                Follow on LinkedIn
              </a>
            </div>
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
            {site.posts.heading}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
            {site.posts.intro}
          </p>
          <p className="mt-3 text-sm">
            <a
              href="/blog/feed.xml"
              className="font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
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
              <p className="font-[family-name:var(--font-fraunces)] text-xl font-bold uppercase tracking-tight">
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
            <ul className="flex flex-col gap-6">
              {posts.map((post) => (
                <li key={post.id}>
                  <article className="group relative flex flex-col justify-between border border-border bg-surface p-6 shadow-[0_1px_3px_rgba(15,29,58,0.04),0_10px_28px_-12px_rgba(15,29,58,0.08)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-[0_14px_34px_-10px_rgba(31,59,115,0.14)] sm:p-7">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <time
                          dateTime={post.date}
                          className="text-xs font-semibold uppercase tracking-wider text-accent"
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
                      <Link href={`/blog/${post.slug}`} className="mt-2.5 block">
                        <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
                          {post.title}
                        </h2>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted">
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
          )}
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
