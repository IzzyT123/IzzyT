import { DemoShelf } from "@/components/demo-shelf";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { WritingTeaser } from "@/components/writing-teaser";

export default function Home() {
  return (
    <>
      <Hero />
      <DemoShelf />
      <WritingTeaser />
      <SiteFooter />
    </>
  );
}
