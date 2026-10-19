import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export function Hero() {
  return (
    <header className="border-b border-border bg-accent text-accent-foreground">
      {/* Clean, Minimal Top Navigation Bar */}
      <div className="border-b border-white/12 px-5 py-4 sm:px-8">
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
            <Link href="/experiments" className="transition hover:text-white">
              Experiments
            </Link>
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

      {/* Above-the-Fold Hero: Focal Identity + Clear CTA on Left, Proof Grid on Right */}
      <div className="px-5 py-9 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Left 7 Columns: Identity, Value Prop, Primary CTA */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border-2 border-white/90 bg-surface shadow-md sm:h-24 sm:w-24">
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
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Head of AI at Issoria
                </p>
                <h1 className="mt-1 font-[family-name:var(--font-fraunces)] text-4xl font-extrabold uppercase leading-[0.96] tracking-tight text-white sm:text-6xl">
                  {site.name}
                </h1>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl sm:leading-snug">
              {site.role}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <a
                href={site.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 border border-white bg-white px-6 py-3.5 text-sm font-bold tracking-wide text-accent shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition duration-150 hover:-translate-y-0.5 hover:bg-white/95"
              >
                <span>{site.contactCta} on LinkedIn</span>
                <span aria-hidden className="text-base leading-none">
                  ↗
                </span>
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 border border-white/35 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition hover:border-white/65 hover:bg-white/14"
              >
                <span>See what I&apos;ve built</span>
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>

          {/* Right 5 Columns: Compact 2x2 Track-Record Grid (Zero Wrapping) */}
          <div className="grid grid-cols-2 gap-px border border-white/20 bg-white/20 lg:col-span-5">
            <a
              href="#work"
              className="group bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                Enterprise Product
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                ChangeAble.ai
              </p>
              <p className="mt-1 text-xs leading-snug text-white/75">
                AI platform for change teams
              </p>
            </a>

            <a
              href="#client-builds"
              className="group bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                Enterprise Clients
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                Internal AI
              </p>
              <p className="mt-1 text-xs leading-snug text-white/75">
                Copilot, Claude &amp; Amazon Quick
              </p>
            </a>

            <a
              href="#shipped-apps"
              className="group bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                #1 GPT Builder
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                100K+ Chats
              </p>
              <p className="mt-1 text-xs leading-snug text-white/75">
                4.4★ across 1,000+ ratings
              </p>
            </a>

            <a
              href="#independent-apps"
              className="group bg-accent p-4 transition hover:bg-accent-hover sm:p-5"
            >
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                Shipped Apps
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl">
                88K+ Uses
              </p>
              <p className="mt-1 text-xs leading-snug text-white/75">
                Skimless, Canimate &amp; DeGPT
              </p>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
