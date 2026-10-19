import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Hero() {
  return (
    <header className="border-b border-border bg-accent text-accent-foreground">
      {/* Top Architectural Navigation Bar */}
      <div className="border-b border-white/15 px-5 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 bg-white" aria-hidden />
            <span className="font-[family-name:var(--font-fraunces)] text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
              {site.motto}
            </span>
          </div>

          <nav
            aria-label="Primary navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <a
              href="#enterprise-work"
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
            >
              Enterprise
            </a>
            <a
              href="#shipped-apps"
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
            >
              Apps
            </a>
            <Link
              href="/experiments"
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
            >
              Experiments
            </Link>
            <Link
              href="/testimonials"
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
            >
              Testimonials
            </Link>
            <Link
              href="/blog"
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
            >
              Blog
            </Link>
            <span className="hidden h-3.5 w-px bg-white/25 sm:inline-block" aria-hidden />
            <a
              href={site.links.x}
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="X profile"
            >
              X ↗
            </a>
            <a
              href={site.links.github}
              className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-white/80 transition hover:text-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              GitHub ↗
            </a>
            <a
              href={site.links.linkedin}
              className="inline-flex items-center justify-center border border-white bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-accent shadow-xs transition hover:bg-white/90"
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${site.contactCta} — LinkedIn profile`}
            >
              {site.contactCta} ↗
            </a>
          </nav>
        </div>
      </div>

      {/* Main Profile Identity & Track-Record Strip */}
      <div className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden border-2 border-white/90 bg-surface shadow-lg sm:h-28 sm:w-28">
              <Image
                src="/izzy-avatar.jpg"
                alt="Izzy Thomson"
                fill
                className="object-cover"
                sizes="112px"
                priority
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="border border-white/30 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  Head of AI · Issoria
                </span>
                <span className="border border-white/25 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                  AI Builder &amp; Advisor
                </span>
              </div>
              <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl font-extrabold uppercase leading-[0.98] tracking-tight text-white sm:text-6xl">
                {site.name}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/90 sm:text-xl sm:leading-snug">
                {site.role}
              </p>
            </div>
          </div>

          {/* 4-Column Architectural Track-Record Grid */}
          <div className="mt-10 grid grid-cols-2 gap-px border border-white/25 bg-white/25 lg:grid-cols-4">
            <a
              href="#enterprise-work"
              className="group flex flex-col justify-between bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  01 // Enterprise SaaS
                </span>
                <span
                  aria-hidden
                  className="font-mono text-xs text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                >
                  ↘
                </span>
              </div>
              <div className="mt-3">
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                  ChangeAble.ai
                </p>
                <p className="mt-0.5 text-xs text-white/75">
                  AI platform for enterprise change teams
                </p>
              </div>
            </a>

            <a
              href="#client-builds"
              className="group flex flex-col justify-between bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  02 // Client AI Tooling
                </span>
                <span
                  aria-hidden
                  className="font-mono text-xs text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                >
                  ↘
                </span>
              </div>
              <div className="mt-3">
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                  Copilot · Claude · Quick
                </p>
                <p className="mt-0.5 text-xs text-white/75">
                  Plus bespoke internal client AI platforms
                </p>
              </div>
            </a>

            <a
              href="#shipped-apps"
              className="group flex flex-col justify-between bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  03 // #1 GPT Builder
                </span>
                <span
                  aria-hidden
                  className="font-mono text-xs text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                >
                  ↘
                </span>
              </div>
              <div className="mt-3">
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                  100K+ Chats · 4.4★
                </p>
                <p className="mt-0.5 text-xs text-white/75">
                  1,000+ user ratings on the OpenAI Store
                </p>
              </div>
            </a>

            <a
              href="#independent-apps"
              className="group flex flex-col justify-between bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                  04 // Public Launches
                </span>
                <span
                  aria-hidden
                  className="font-mono text-xs text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                >
                  ↘
                </span>
              </div>
              <div className="mt-3">
                <p className="font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                  Skimless · Canimate · DeGPT
                </p>
                <p className="mt-0.5 text-xs text-white/75">
                  88K+ texts cleaned &amp; monthly public builds
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
