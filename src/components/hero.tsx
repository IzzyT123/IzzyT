import Image from "next/image";
import { site } from "@/data/site";

export function Hero() {
  return (
    <header className="border-b border-border bg-accent px-5 py-8 text-accent-foreground sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-5">
          <figure className="m-0 flex items-center">
            <blockquote className="m-0 border-r-[3px] border-white/35 pr-3 text-right font-[family-name:var(--font-fraunces)] text-2xl font-extrabold uppercase leading-none tracking-tight text-white sm:pr-5 sm:text-3xl">
              {site.motto}
            </blockquote>
          </figure>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <a
              href={site.links.x}
              className="text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="X profile"
            >
              X
            </a>
            <a
              href={site.links.github}
              className="text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
              rel="noopener noreferrer"
              target="_blank"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
            <a
              href={site.links.linkedin}
              className="inline-flex items-center justify-center border border-white bg-white px-4 py-2.5 text-sm font-semibold text-accent shadow-sm transition hover:-translate-y-0.5 hover:bg-white/90 sm:px-5"
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`${site.contactCta} — LinkedIn profile`}
            >
              {site.contactCta}
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:mt-7 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-white/90 bg-surface shadow-md sm:h-24 sm:w-24">
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
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-white sm:text-5xl">
              {site.name}
            </h1>
            <p className="mt-2.5 max-w-3xl text-lg leading-snug text-white/90 sm:text-xl">
              {site.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
