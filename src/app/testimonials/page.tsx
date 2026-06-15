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
      <header className="border-b border-border bg-surface px-5 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-foreground"
          >
            <span aria-hidden>←</span>
            Home
          </Link>
          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            Testimonials
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-snug text-muted sm:text-lg">
            What users say about the products I ship.
          </p>
        </div>
      </header>
      <TestimonialDeck items={items} />
      <SiteFooter />
    </>
  );
}
