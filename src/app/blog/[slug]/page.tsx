import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { site, type PostEntry } from "@/data/site";
import { SiteFooter } from "@/components/site-footer";
import { PostAudioReader, type WordTiming } from "@/components/post-audio-reader";
import { tokenizePost } from "@/lib/post-tokens";

function findPost(slug: string): PostEntry | undefined {
  for (const p of site.posts.items) {
    if (p.slug === slug) return p;
  }
  return undefined;
}

async function loadWordTimings(rel?: string): Promise<WordTiming[] | null> {
  if (!rel) return null;
  try {
    const filePath = path.join(process.cwd(), "public", rel.replace(/^\/+/, ""));
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as WordTiming[]) : null;
  } catch {
    return null;
  }
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

const SITE_URL = "https://izzyt.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Post not found" };

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags ? [...post.tags] : undefined,
    authors: [{ name: site.name, url: SITE_URL }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      siteName: site.name,
      locale: "en_GB",
      publishedTime: new Date(post.date).toISOString(),
      authors: [site.name],
      tags: post.tags ? [...post.tags] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
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

  const hasAudio = Boolean(post.audio?.src);
  const words = hasAudio ? await loadWordTimings(post.audio?.words) : null;
  const blocks = hasAudio ? tokenizePost(post.title, post.body).blocks : null;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const publishedIso = new Date(post.date).toISOString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedIso,
    dateModified: publishedIso,
    inLanguage: "en-GB",
    keywords: post.tags ? [...post.tags] : undefined,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Person",
      name: site.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          {post.audio?.src && blocks ? (
            <PostAudioReader
              src={post.audio.src}
              words={words}
              blocks={blocks}
            />
          ) : (
            <div className="prose prose-neutral max-w-none text-base leading-relaxed text-foreground [&_a]:text-foreground [&_a]:underline [&_a]:decoration-border [&_a]:underline-offset-4 hover:[&_a]:decoration-foreground [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-semibold [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1 [&_blockquote]:mt-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em]">
              <ReactMarkdown>{post.body}</ReactMarkdown>
            </div>
          )}

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
