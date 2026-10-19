import type { Metadata } from "next";
import Link from "next/link";
import { getTestimonialDeckEvents } from "@/data/build-timeline";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialDeck } from "@/components/testimonial-deck";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What users say about the products I ship — ChangeAble customer testimonials, GPT Builder Pro user feedback, and press.",
};

export default function TestimonialsPage() {
  const items = getTestimonialDeckEvents();

  return (
    <>
      <header className="border-b border-border bg-accent px-5 py-6 text-accent-foreground sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white sm:text-5xl">
            Testimonials
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-snug text-white/90 sm:text-lg">
            What users say about the products I ship.
          </p>
        </div>
      </header>
      <TestimonialDeck items={items} />
      <SiteFooter />
    </>
  );
}
