"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function FadeIn({
  children,
  className,
  delay = 0,
  /** Expands the intersection root so long sections (e.g. timeline) don’t sit at ~0 opacity mid-scroll */
  viewportMargin = "-48px",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  viewportMargin?: string;
}) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
