import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Hero() {
  return (
    <header className="border-b border-border bg-accent text-accent-foreground">
      {/* Minimal Top Navigation */}
      <div className="border-b border-white/12 px-5 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/"
            className="font-[family-name:var(--font-fraunces)] text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl"
          >
            {site.motto}
          </Link>

          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-white/80"
          >
            <a href="#work" className="transition hover:text-white">
              Work
            </a>
            <a href="#client-ai" className="transition hover:text-white">
              Client AI
            </a>
            <Link href="/testimonials" className="transition hover:text-white">
              Testimonials
            </Link>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            <span
              className="hidden h-3.5 w-px bg-white/20 sm:inline-block"
              aria-hidden
            />
            <a
              href={site.links.x}
              className="hidden transition hover:text-white sm:inline"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="X profile"
            >
              X
            </a>
            <a
              href={site.links.github}
              className="hidden transition hover:text-white sm:inline"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>

      {/* Compact, Uncluttered Hero — Keeps Portfolio Videos Above the Fold */}
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-white bg-surface shadow-md sm:h-24 sm:w-24">
              <Image
                src="/izzy-avatar.jpg"
                alt="Izzy Thomson"
                fill
                className="object-cover"
                sizes="96px"
                priority
              />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl">
                {site.name}
              </h1>
              <p className="mt-2.5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                {site.role}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 bg-white px-6 py-3.5 text-sm font-semibold text-accent shadow-[0_4px_14px_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-white hover:shadow-[0_10px_28px_rgba(255,255,255,0.32),0_0_0_2px_#ffffff] active:translate-y-0"
            >
              <span>{site.contactCta}</span>
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
