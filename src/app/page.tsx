import { DemoShelf } from "@/components/demo-shelf";
import { Hero } from "@/components/hero";
import { UnifiedTimeline } from "@/components/unified-timeline";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <DemoShelf />
      <UnifiedTimeline />
      <SiteFooter />
    </>
  );
}
