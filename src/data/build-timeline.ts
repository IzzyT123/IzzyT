import { site } from "@/data/site";
import changeableTestimonials from "@/data/changeable-testimonials.json";
import gptData from "@/data/gpt-reviews.json";

export type TimelineLane =
  | "role"
  | "changeable"
  | "gpt"
  | "degpt"
  | "canimate";

export type TimelineKind =
  | "milestone"
  | "review"
  | "testimonial"
  | "article"
  | "launch"
  | "series";

export type TimelineEvent = {
  id: string;
  sortDate: string;
  lane: TimelineLane;
  kind: TimelineKind;
  title: string;
  body: string;
  /** When set, milestone cards use `getProjectDemoById` for a thumbnail and short proof line. */
  demoId?: string;
  /** When set with `demoId`, overrides the thumbnail image (e.g. phase-specific poster). */
  demoThumbnailSrc?: string;
  href?: string;
  hrefLabel?: string;
  lang?: string;
  /** English gloss when `body` is not English (GPT reviews). */
  quoteEn?: string;
  /** e.g. article byline (CMI piece). */
  attribution?: string;
  /** Second line under name (role / organisation) for ChangeAble testimonials. */
  testimonialAttribution?: string;
};

/** Snapshot columns: professional (ChangeAble & client work) vs personal projects & GPT. */
export type SnapshotColumn = "professional" | "personal";

export const SNAPSHOT_COLUMNS: SnapshotColumn[] = ["professional", "personal"];

const LANE_TO_SNAPSHOT: Record<TimelineLane, SnapshotColumn> = {
  role: "professional",
  changeable: "professional",
  gpt: "personal",
  degpt: "personal",
  canimate: "personal",
};

export function partitionMonthEvents(
  events: TimelineEvent[],
): Record<SnapshotColumn, TimelineEvent[]> {
  const buckets: Record<SnapshotColumn, TimelineEvent[]> = {
    professional: [],
    personal: [],
  };
  for (const e of events) {
    buckets[LANE_TO_SNAPSHOT[e.lane]].push(e);
  }
  for (const col of SNAPSHOT_COLUMNS) {
    buckets[col].sort(compareEventsDesc);
  }
  return buckets;
}

export function compareEventsDesc(a: TimelineEvent, b: TimelineEvent): number {
  const d = b.sortDate.localeCompare(a.sortDate);
  if (d !== 0) return d;
  return a.id.localeCompare(b.id);
}

export function getTimelineEvents(): TimelineEvent[] {
  const out: TimelineEvent[] = [];

  out.push({
    id: "role-ai-2023",
    sortDate: site.roleAiProduct.sortDate,
    lane: "role",
    kind: "milestone",
    title: site.roleAiProduct.title,
    body: site.roleAiProduct.detail,
  });

  out.push({
    id: "gpt-launch",
    sortDate: site.gptBuilderPro.launchSortDate,
    lane: "gpt",
    kind: "launch",
    title: "GPT Builder Pro 4.0",
    body: site.gptBuilderPro.summary,
    demoId: "gptBuilderPro",
    href: site.links.gptBuilderPro,
    hrefLabel: "Open in ChatGPT",
  });

  for (const phase of site.changeable.phases) {
    out.push({
      id: `changeable-${phase.sortDate}`,
      sortDate: phase.sortDate,
      lane: "changeable",
      kind: "milestone",
      title: `${site.changeable.heading} · ${phase.label}`,
      body: phase.detail,
      demoId: "changeable",
      ...(phase.label === "Custom GPTs"
        ? { demoThumbnailSrc: "/demos/changeable-gpt-poster.png" }
        : {}),
      href: site.links.changeable,
      hrefLabel: "ChangeAble.ai",
    });
  }

  const cmi = site.changeable.cmiFeaturedArticle;
  out.push({
    id: "changeable-cmi-ai-tools-article",
    sortDate: cmi.sortDate,
    lane: "changeable",
    kind: "article",
    title: cmi.title,
    body: cmi.excerpt,
    href: cmi.href,
    hrefLabel: cmi.hrefLabel,
    attribution: cmi.attribution,
  });

  for (const item of site.sideProjects.items) {
    const demoId = item.name === "DeGPT" ? "degpt" : "canimate";
    out.push({
      id: `side-${item.name.toLowerCase()}`,
      sortDate: item.sortDate,
      lane: item.name === "DeGPT" ? "degpt" : "canimate",
      kind: item.name === "Canimate" ? "series" : "launch",
      title: item.name,
      body: item.description,
      demoId,
      href: site.links[item.urlKey],
      hrefLabel: `Visit ${item.name}`,
    });
  }

  for (const r of gptData.reviews) {
    out.push({
      id: `review-${r.id}`,
      sortDate: r.date,
      lane: "gpt",
      kind: "review",
      title: "User feedback",
      body: r.text,
      lang: r.lang,
      ...(r.textEn !== undefined && r.textEn !== ""
        ? { quoteEn: r.textEn }
        : {}),
    });
  }

  for (const t of changeableTestimonials.testimonials) {
    out.push({
      id: `changeable-testimonial-${t.id}`,
      sortDate: t.date,
      lane: "changeable",
      kind: "testimonial",
      title: t.name,
      body: t.quote,
      testimonialAttribution: t.attributionLine,
    });
  }

  out.sort(compareEventsDesc);
  return out;
}

export function monthKeyFromSortDate(sortDate: string): string {
  return sortDate.slice(0, 7);
}

export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export type TimelineMonthGroup = {
  monthKey: string;
  monthLabel: string;
  events: TimelineEvent[];
};

export function groupTimelineByMonth(events: TimelineEvent[]): TimelineMonthGroup[] {
  const map = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const key = monthKeyFromSortDate(e.sortDate);
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  const keys = [...map.keys()].sort((a, b) => b.localeCompare(a));
  return keys.map((monthKey) => ({
    monthKey,
    monthLabel: formatMonthLabel(monthKey),
    events: (map.get(monthKey) ?? []).sort(compareEventsDesc),
  }));
}
