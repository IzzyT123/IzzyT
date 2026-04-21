/** Shared date for the “AI product engineer focus” timeline milestone. */
const ROLE_AI_PRODUCT_SORT_DATE = "2023-07-01";

/** Append to demo MP4 URLs when you replace a file under `public/demos/` so clients fetch the new clip (increment the number). */
const DEMO_MP4_CACHE = "?v=2";

/** Media shown in the demo shelf and optional timeline thumbnails. Replace poster/video files in `public/demos/` as you capture real footage. */
export type ProjectDemoMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string; poster: string };

export type ExperimentEntry = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly period: string;
  readonly sortDate: string;
  readonly summary: string;
  readonly body?: string;
  readonly urlKey?: string;
  readonly demoId?: string;
  readonly media?: ProjectDemoMedia;
  readonly tags?: readonly string[];
  readonly monthly?: boolean;
};

export type PostEntry = {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly date: string;
  readonly excerpt: string;
  readonly body: string;
  readonly tags?: readonly string[];
};

export const site = {
  name: "Izzy Thomson",
  role: "AI product engineer shipping tools, agents, and enterprise systems",
  motto: "Demo, don't memo.",

  /** Hero / footer button — opens LinkedIn profile. */
  contactCta: "Get in touch",

  links: {
    linkedin: "https://www.linkedin.com/in/izzy-thomson-0b286b23/",
    github: "https://github.com/IzzyT123/",
    changeable: "https://changeable.ai",
    issoria: "https://www.issoriachange.com",
    gptBuilderPro: "https://chatgpt.com/g/g-VJPtFG34T-gpt-builder-pro-4-0",
    degpt: "https://degpt.app",
    canimate: "https://canimate.com",
  },

  now: {
    heading: "What I do now",
    intro:
      "I own product delivery and architecture for enterprise AI change tooling—from discovery through deployment—while helping leaders adopt AI responsibly.",
    bullets: [
      "End-to-end delivery: problem discovery, UX, data models, workflows, and shipping features users rely on.",
      "LLM systems: retrieval, tool use and agents, structured outputs, guardrails, and production safety practices.",
      "Reliability: prompt versioning, offline and online evaluation, monitoring, red-teaming, and human-in-the-loop review where it matters.",
      "Partnership: working with senior stakeholders on adoption, governance, and how teams actually use AI day to day.",
      "Engineering velocity: AI-assisted development for prototyping, tests, and refactors—without skipping rigor.",
    ],
  },

  changeable: {
    heading: "ChangeAble.ai",
    summary:
      "Enterprise AI for change and transformation teams—turning documents and stakeholder context into draft deliverables and connected workflows, with governance appropriate to serious programs.",
    testimonialNote:
      "Customer stories and testimonials live on the product site; this page links out rather than repeating them.",
    phases: [
      {
        sortDate: "2024-02-01",
        date: "Feb 2024",
        label: "Custom GPTs",
        detail:
          "Structured outputs into Excel templates—early prototypes that proved the workflow.",
      },
      {
        sortDate: "2025-02-01",
        date: "Feb 2025",
        label: "Web app",
        detail:
          "Shipped ChangeAble.ai as a product experience—iteration, UX, and foundations for scale.",
      },
      {
        sortDate: "2026-04-01",
        date: "Apr 2026",
        label: "Client deployments",
        detail:
          "Internal builds for Issoria clients: ChangeAble IP plus consulting to deliver AI-powered internal tools.",
      },
    ],
    /** Change Management Institute article that mentions Issoria / ChangeAble among AI tools for change professionals. */
    cmiFeaturedArticle: {
      /** Approx. publication / promotion window (CMI blog; LinkedIn toolkit post ~Apr 2025, ~1y before Apr 2026). */
      sortDate: "2025-04-22",
      title: "5 AI Tools for Change Managers",
      excerpt:
        "Commissioned by the Change Management Institute—Declan Foster highlights tools change professionals can use today, including Issoria’s AI Change Impact Assessment and how AI can support (not replace) your work.",
      href: "https://change-management-institute.com/5-ai-tools-for-change-managers/",
      hrefLabel: "Read the article",
      attribution: "Declan Foster · Change Management Institute",
    },
  },

  /** Approximate public launch in the ChatGPT GPT era (for timeline anchor). */
  roleAiProduct: {
    sortDate: ROLE_AI_PRODUCT_SORT_DATE,
    title: "AI product engineer focus",
    detail:
      "Moved into owning ChangeAble.ai delivery: LLM systems, product architecture, and enterprise adoption.",
  },

  gptBuilderPro: {
    heading: "GPT Builder Pro 4.0",
    /** Custom GPTs / GPT Builder era launch window. */
    launchSortDate: "2023-11-10",
    summary:
      "A custom GPT for building better custom GPTs—shipped early in the ChatGPT GPT era and refined from real usage.",
    stats: [
      { label: "Conversations", value: "100K+" },
      { label: "Rating", value: "4.4★" },
      { label: "Ratings count", value: "1K+" },
    ],
  },

  experiments: {
    heading: "Experiments",
    intro:
      "Monthly public builds and side projects—ship, learn, write up. Each link goes to the live product or a short write-up.",
    items: [
      {
        id: "canimate",
        slug: "canimate",
        name: "Canimate",
        period: "Ongoing",
        sortDate: "2026-04-01",
        summary:
          "Branded content from a URL—part of a monthly public build series where I ship experiments, document what I learn, and tighten my craft.",
        urlKey: "canimate" as const,
        demoId: "canimate",
        monthly: true,
      },
      {
        id: "degpt",
        slug: "degpt",
        name: "DeGPT",
        period: "Dec 2025",
        sortDate: "2025-12-01",
        summary:
          "Fix ChatGPT copy-paste for real destinations—email, docs, slides, and more—with an optional Chrome extension. Built as a path to ship on the ChatGPT app platform; submitted when the store opened.",
        urlKey: "degpt" as const,
        demoId: "degpt",
        monthly: false,
      },
    ],
  },

  posts: {
    heading: "Writing",
    intro:
      "Occasional notes on shipping AI products, tooling, and what I learn from monthly builds.",
    items: [
      {
        id: "hello",
        slug: "hello",
        title: "Hello",
        date: "2026-04-21",
        excerpt:
          "A small note on why this blog exists and what I plan to write about.",
        body: `This is a placeholder first post so the blog route scaffolding has something to render. Replace or delete it in \`src/data/site.ts\` when you publish your first real post.

## What to expect here

- Short notes on shipping AI products and tooling.
- Write-ups alongside the monthly public builds on [/experiments](/experiments).
- Occasional longer pieces on things I've learned the hard way.

Subscribe via [RSS](/blog/feed.xml) and catch new posts as they land.`,
        tags: ["meta"],
      },
    ] as readonly PostEntry[],
  },

  /**
   * Featured demos (top of page): ChangeAble, GPT Builder Pro, Canimate. Same copy as the former “At a glance”.
   * `shelf: false` keeps media for the timeline only (e.g. DeGPT).
   */
  projectDemos: [
    {
      id: "changeable",
      eyebrow: "Day job",
      title: "ChangeAble.ai",
      proofLine:
        "Enterprise AI for change teams—draft deliverables, connected workflows, governance that fits real programs. Delivery and advisory with Issoria—ChangeAble deployments, bespoke internal tooling.",
      hrefKey: "changeable",
      ctaLabel: "ChangeAble.ai",
      secondaryLink: {
        hrefKey: "issoria",
        label: "issoriachange.com",
      },
      media: {
        kind: "video",
        src: `/demos/changeable-demo.mp4${DEMO_MP4_CACHE}`,
        poster: "/demos/changeable-poster.png",
        alt: "Short screen recording of the ChangeAble.ai product.",
      },
    },
    {
      id: "gptBuilderPro",
      eyebrow: "Shipped",
      title: "GPT Builder Pro 4.0",
      statsLine: "#1 GPT Builder · 100K+ chats · 4.4★ · 1K+ ratings",
      proofLine:
        "Better than OpenAI's native GPT Builder—shipped in the first week of GPTs and refined across 100K+ real conversations.",
      hrefKey: "gptBuilderPro",
      ctaLabel: "chatgpt.com",
      media: {
        kind: "video",
        src: `/demos/gpt-builder-pro.mp4${DEMO_MP4_CACHE}`,
        poster: "/demos/gpt-builder-pro-poster.png",
        alt: "Short screen recording of GPT Builder Pro in ChatGPT.",
      },
    },
    {
      id: "canimate",
      eyebrow: "Monthly experiment",
      title: "Canimate",
      proofLine:
        "Branded content from a URL—public monthly builds, notes on what I learn.",
      hrefKey: "canimate",
      ctaLabel: "Canimate.com",
      media: {
        kind: "video",
        src: `/demos/canimate-demo.mp4${DEMO_MP4_CACHE}`,
        poster: "/demos/canimate-poster.png",
        alt: "Short screen recording of Canimate.",
      },
    },
    {
      id: "degpt",
      shelf: false,
      eyebrow: "Side project",
      title: "DeGPT",
      proofLine:
        "Copy-paste from ChatGPT into real destinations—extension path to the GPT store.",
      hrefKey: "degpt",
      ctaLabel: "degpt.app",
      media: {
        kind: "image",
        src: "/demos/degpt-poster.png",
        alt: "DeGPT — add degpt-demo.mp4 in public/demos/ to enable video.",
      },
    },
  ],

  timeline: {
    snapshotColumns: {
      professional: "Professional",
      personal: "Personal projects",
    },
    linkedinLine:
      "For role detail and experience, see LinkedIn—the timeline below is project- and feedback-shaped.",
  },

  footer: {
    credit: "© Izzy Thomson",
  },
} as const;

export type SiteLinkKey = keyof typeof site.links;

export type ProjectDemo = {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly proofLine: string;
  readonly hrefKey: SiteLinkKey;
  readonly ctaLabel: string;
  readonly statsLine?: string;
  readonly secondaryLink?: {
    readonly hrefKey: SiteLinkKey;
    readonly label: string;
  };
  /** `false` = thumbnail data for timeline only; omit from the top demo grid. */
  readonly shelf?: boolean;
  readonly media: ProjectDemoMedia;
};

export function getProjectDemoById(id: string): ProjectDemo | undefined {
  for (const d of site.projectDemos) {
    if (d.id === id) return d as ProjectDemo;
  }
  return undefined;
}
