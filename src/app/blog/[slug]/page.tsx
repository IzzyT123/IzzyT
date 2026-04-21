import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { site, type PostEntry } from "@/data/site";
import { SiteFooter } from "@/components/site-footer";

function findPost(slug: string): PostEntry | undefined {
  for (const p of site.posts.items) {
    if (p.slug === slug) return p;
  }
  return undefined;
}

function formatPostDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return site.posts.items.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <>
      <header className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>←</span>
            Blog
          </Link>
          <p className="mt-5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            {formatPostDate(post.date)}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {post.excerpt}
          </p>
        </div>
      </header>

      <article className="border-b border-border bg-background px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-neutral max-w-none text-base leading-relaxed text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 hover:[&_a]:decoration-foreground [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-semibold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>

          {post.tags && post.tags.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((t) => (
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

      <SiteFooter />
    </>
  );
}
