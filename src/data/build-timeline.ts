import { site } from "@/data/site";
import changeableTestimonials from "@/data/changeable-testimonials.json";
import gptData from "@/data/gpt-reviews.json";

export type TimelineLane =
  | "role"
  | "changeable"
  | "gpt"
  | "degpt"
  | "canimate"
  | "experiment"
  | "post";

export type TimelineKind =
  | "milestone"
  | "review"
  | "testimonial"
  | "article"
  | "launch"
  | "series"
  | "post";

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
  /** When set, the milestone card renders a compact inline phase list (used for ChangeAble). */
  changeablePhases?: ReadonlyArray<{
    readonly sortDate: string;
    readonly date: string;
    readonly label: string;
    readonly detail: string;
  }>;
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
  experiment: "personal",
  post: "personal",
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

  const latestChangeablePhase = [...site.changeable.phases].sort((a, b) =>
    b.sortDate.localeCompare(a.sortDate),
  )[0];
  if (latestChangeablePhase) {
    out.push({
      id: "changeable-consolidated",
      sortDate: latestChangeablePhase.sortDate,
      lane: "changeable",
      kind: "milestone",
      title: site.changeable.heading,
      body: site.changeable.summary,
      demoId: "changeable",
      href: site.links.changeable,
      hrefLabel: "ChangeAble.ai",
      changeablePhases: site.changeable.phases,
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

  for (const item of site.experiments.items) {
    const slugLane: Partial<Record<string, TimelineLane>> = {
      degpt: "degpt",
      canimate: "canimate",
    };
    const lane: TimelineLane = slugLane[item.slug] ?? "experiment";
    const href =
      item.urlKey && item.urlKey in site.links
        ? site.links[item.urlKey as keyof typeof site.links]
        : undefined;
    out.push({
      id: `experiment-${item.slug}`,
      sortDate: item.sortDate,
      lane,
      kind: item.monthly ? "series" : "launch",
      title: item.name,
      body: item.summary,
      demoId: item.demoId,
      href,
      hrefLabel: `Visit ${item.name}`,
    });
  }

  for (const post of site.posts.items) {
    out.push({
      id: `post-${post.slug}`,
      sortDate: post.date,
      lane: "post",
      kind: "post",
      title: post.title,
      body: post.excerpt,
      href: `/blog/${post.slug}`,
      hrefLabel: "Read post",
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

export function yearKeyFromSortDate(sortDate: string): string {
  return sortDate.slice(0, 4);
}

export function formatYearLabel(yearKey: string): string {
  return yearKey;
}

export type TimelineYearGroup = {
  yearKey: string;
  yearLabel: string;
  events: TimelineEvent[];
};

export function groupTimelineByYear(events: TimelineEvent[]): TimelineYearGroup[] {
  const map = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const key = yearKeyFromSortDate(e.sortDate);
    const list = map.get(key) ?? [];
    list.push(e);
    map.set(key, list);
  }
  const keys = [...map.keys()].sort((a, b) => b.localeCompare(a));
  return keys.map((yearKey) => ({
    yearKey,
    yearLabel: formatYearLabel(yearKey),
    events: (map.get(yearKey) ?? []).sort(compareEventsDesc),
  }));
}
