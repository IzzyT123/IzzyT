import { DemoShelf } from "@/components/demo-shelf";
import { ExperimentsTeaser } from "@/components/experiments-teaser";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { UnifiedTimeline } from "@/components/unified-timeline";
import { WritingTeaser } from "@/components/writing-teaser";

export default function Home() {
  return (
    <>
      <Hero />
      <DemoShelf />
      <UnifiedTimeline limitYears={2} />
      <ExperimentsTeaser />
      <WritingTeaser />
      <SiteFooter />
    </>
  );
}
