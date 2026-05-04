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
    skimless: "https://skimless.com",
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
        id: "skimless",
        slug: "skimless",
        name: "Skimless",
        period: "May 2026",
        sortDate: "2026-05-01",
        summary:
          "Tailored audio updates from the sources you already follow: YouTube channels, newsletters, RSS feeds, docs, and changelogs filtered around what you care about.",
        body: `Skimless is my May 2026 experiment: a way to turn high-signal sources into short audio updates instead of another queue of tabs to skim.

The product asks what topic to track, who the update is for, and what to prioritize or ignore. From there it watches YouTube channels, newsletters, RSS feeds, docs, and changelogs for updates that are worth your attention.

The initial shape is a free weekday audio brief, with paid tiers for more sources, longer daily and weekly updates, shared team briefs, and MCP access so agents can use the same context.`,
        urlKey: "skimless" as const,
        demoId: "skimless",
        tags: ["audio", "agents", "rss", "youtube"],
        monthly: true,
      },
      {
        id: "canimate",
        slug: "canimate",
        name: "Canimate",
        period: "March 2026",
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
        id: "cost-of-building-is-falling",
        slug: "cost-of-building-is-falling",
        title: "The Cost of Building Is Falling. The Cost of Knowing Isn't.",
        date: "2026-05-04",
        excerpt:
          "AI is making software faster to build, but the scarce part is shifting to domain knowledge, feedback loops, organisational context, IP, and maintenance.",
        body: `This is my first post here, so I want to write it more like a marker in the ground than a polished argument.

Over the last month I have been circling around one idea from a few different directions:

The cost of building software is moving towards zero. The cost of knowing what to build is not.

That sounds like a big claim, and I do not mean it literally yet. Software is still hard. Production is still hard. Security, data, integrations, accessibility, reliability, procurement, support, training, and maintenance are all still real. But the act of turning a fairly clear idea into a working prototype, and often into something much more than a prototype, has become dramatically cheaper.

That changes the shape of product development. It changes who gets to build. It changes the value of domain knowledge. It changes the old build vs buy calculation. It changes how teams should communicate. It changes what personal and organisational moats look like.

I am writing this partly because I want izzyt.com to become a public notebook for these ideas: a journal of things I am noticing while building products, working with AI, and trying to understand where work is going.

## Subject matter experts become builders

The most interesting AI builders I can see coming are not traditional software teams. They are subject matter experts who have lived with a problem for years.

They know the messy workflows. They know which shortcuts are dangerous. They know where people waste time, where handoffs break, what needs governance, what users will actually trust, and which edge cases matter.

Until recently, that knowledge had to be translated through several layers before it became software. A practitioner explained the problem to a manager, the manager explained it to a product person, the product person explained it to a designer or engineer, and then the result slowly made its way back to the practitioner for feedback.

Every translation step lost something. Sometimes the lost thing was small, like a phrase or a field name. Sometimes it was the real reason the tool needed to exist.

AI compresses that loop. The person with the problem can now build enough of the solution to make the conversation concrete. They can show the workflow. They can test the logic. They can feel where it is clunky. They can explain the missing bit by pointing at the thing, instead of writing another paragraph.

That is why I think the target is not just MVPs. A minimum viable product is often enough to test whether an idea exists. Lovable uses the phrase minimum lovable product, and I understand why: love is a much better ambition than viability. But I do not think it quite says what these AI-built domain tools should be aiming for.

The aim should be a Minimum Solved Product.

Not the minimum product someone might like. The minimum product that solves the user's problem at that point. Something that already relieves the pain, does the job, and proves the workflow. The technical parts may still need help, but the shape of the solution can come directly from the person who understands the work.

The point of the MVP used to be: can we test whether this should exist?

The point of an MSP in this new world might be: can the person with the problem build something good enough that the technical work is mainly hardening, integration, deployment, and maintenance?

That is a very different distribution of effort.

It also changes who should be upskilled. I do not think organisations should only task IT with developing AI tools for every domain. IT does not usually understand every niche deeply enough, and they should not have to. A better pattern may be to task AI and IT teams with upskilling one person inside each domain team until that person can solve their own problems with AI.

Not alone. Not irresponsibly. But enough to become a serious builder.

The model I keep coming back to is two-in-a-box: a domain expert who owns the problem and a technical partner who helps with the parts that need engineering judgement, governance, deployment, security, and long-term maintainability.

The domain expert should not have to wait months for a team that does not understand the problem. The technical team should not have to guess what practitioners need. AI makes the middle smaller.

## The new build vs buy calculation

The economics of buying niche software inside large organisations have not changed as much as the AI conversation suggests.

The sticker price is rarely the whole problem. The real cost is approval: procurement, legal, security, architecture review, AI governance, budget ownership, implementation planning, change management, training, and support. For a small team with an urgent problem, buying software can still mean waiting nine to twelve months before anything useful happens.

That is why "SaaS is dead" feels too simplistic, but "the old SaaS buying motion is under pressure" feels right.

For a lot of large organisations, the first serious step into AI adoption has been something like Microsoft Copilot, CompanyGPT, ChatCompany, or an internal chat tool over approved data. That makes sense. It is easier to approve a broad enterprise capability than hundreds of small external AI tools.

But once that stack exists, the question changes.

If a team already has approved AI tooling, approved cloud infrastructure, approved identity, approved data controls, and approved governance, do they really need to buy another niche platform every time they find a specialist workflow? Or can they build enough of it internally on top of the stack they already have?

The perception of building is changing because AI makes it feel easy. The perception of buying is also changing because large organisations make it feel slow.

But building is not free. AI can make coding much faster, but it does not remove maintenance, security, governance, integration, change management, training, or support. More importantly, it does not magically create the years of domain knowledge needed to know what to build in the first place.

The hard part of specialist software is often not the code. It is the IP: the tested workflows, best practices, decision logic, language, templates, pitfalls, and painful lessons that only come from working with practitioners for years.

So the useful question is not simply "build or buy?"

I think a better model is external IP, built internally.

By that I mean taking proven specialist knowledge, workflows, decision logic, and product patterns, then instantiating them inside a client's existing approved stack. The value is not a generic SaaS subscription and it is not time-and-materials development. The value is the shortcut: years of tested thinking turned into working software quickly, using the tools and controls the organisation already has.

I have learned this through [ChangeAble.ai](https://changeable.ai). The valuable part is not just the interface or the code. It is the accumulated understanding of change management: the jobs to be done, the pains to relieve, the gains to create, the documents people need, the review points, the governance concerns, the language practitioners use, and the places work usually slows down.

AI makes that IP easier to turn into software. It does not make the IP less valuable.

In some ways, it makes the IP more valuable because it can now be expressed in more forms.

A specialist product might still exist as SaaS. It might also become a GPT. It might become a set of n8n flows. It might become a custom app on a client's existing stack. It might become a library of prompts, templates, workflows, schemas, evaluations, and agents. The underlying asset is not one fixed product shape. It is the knowledge of how to solve the problem.

That creates an awkward commercial question.

If a consultancy or specialist firm can convert its IP into a working internal tool in five days, charging time and materials devalues the years of research and practice behind it. But if the client hosts, owns, maintains, and updates the system on their own technology, they may not want to pay a traditional subscription either.

So what is the value?

Maybe the value is anchored to the internal alternative. If it would take a team three to six months and tens of thousands of pounds to build the capability themselves, but a specialist can instantiate a version in a week because they already understand the domain, the pricing should reflect the avoided time, risk, and discovery cost. Not the raw coding hours.

That might lead to a new kind of software IP: not a fixed product sold off the shelf, but a proven solution architecture that can be rapidly deployed inside a client's environment.

The best target for this is probably not the largest, most bureaucratic transformation programme first. It is the smallest valuable slice that can get through the fewest hoops, demonstrate value quickly, and create evidence.

Every custom internal version can still link back to the original IP. For example, a change management tool built from ChangeAble thinking should still be attributable to ChangeAble. That creates proof, testimonials, and learning around the IP even when the final implementation sits inside a client's stack.

I think an organisation's future IP may look less like a list of products and more like a library of solutions that become base context for AI.

## Demos, not memos

The other phrase I keep coming back to is: demos, not memos.

Matt Waite popularised that line after building PolitiFact in 2009. It feels even more relevant now. If software is cheap enough to build quickly, a demo is no longer just a communication tool. It is often the fastest way to think.

A one-hour meeting with ten senior people can easily be more expensive than building a rough prototype. That sounds absurd until the cost of a first build collapses.

In the past, thinking in the abstract made sense because building was expensive. "Failing to prepare is preparing to fail" was good advice because the penalty for building the wrong thing was high.

Now the calculation is changing.

For many software ideas, building the first version may be cheaper than debating the theory. You may be able to create five rough versions in the time it takes a group to decide whether one version is worth exploring. Even if four are wrong, the learning may be better because the feedback is grounded in something real.

A demo removes ambiguity in a way a document cannot. People can see what the thing does. They can react to it. They can say, "that part is wrong", "this would save me time", "we would never use that", or "can it work with our process?"

The feedback is sharper because the object is real.

This does not remove the need for strategy or judgment. It changes where they happen. Instead of spending weeks aligning around a memo, a team can build, test with AI, show the prototype to users, then iterate with real evidence.

That last part is important. Fast OODA loops, test-and-learn, and "do things that do not scale" have been good product wisdom for years. AI accelerates the early loops. A lot of what would previously have required a first round of human testing can now be explored by building, testing, and iterating with AI before putting the thing in front of busy people.

Human feedback is still the important feedback. It is also expensive, especially when the users are senior, scarce, or overloaded. So we should spend that feedback more carefully.

Demoing also changes buy-in. It is much easier to sell something that visibly saves time, saves money, or improves quality. It is much easier to explain a workflow by showing it than by describing it. It is much easier to make something feel relevant when the demo uses the client's language, their methodology, and even their brand colours.

There is less room for ambiguity when the product is on screen.

This is also where AI computer use and AI QA become interesting. If agents can help test early flows, click through prototypes, find rough edges, and compare behaviour against expected outcomes, then the first human review can start at a higher level. The practitioner does not need to waste their scarce attention on the first obvious issues.

## Context becomes the organisation's advantage

For individuals, knowledge and critical thinking used to feel like a personal moat. AI weakens that moat because it gives more people access to good reasoning on demand.

That has been uncomfortable to realise personally.

Knowledge and critical thinking used to feel like things I could rely on. AI has not made them irrelevant, but it has made them less scarce. More people can now ask good questions, generate options, critique plans, learn quickly, and produce decent work.

For now, early adopter mindset is an advantage. So is applying what I learn quickly. So is working longer hours than others while a new technology curve is still steep. But those are not permanent moats. People catch up along adoption curves.

The new advantage may be context.

Not vague context, but usable context: how the business works, what customers say, how products are built, which decisions were made, what has been tried before, what failed, what language the market uses, what the codebase does, and what good looks like.

The organisations that grow fastest will be the ones that share context fastest. Siloed knowledge used to protect teams. Now it slows them down.

I have noticed the same thing at a personal level. I find myself protecting useful context because it feels like one of the few remaining advantages. Notes, prompts, codebase understanding, product decisions, customer language, implementation details, examples, and lessons learned all become fuel for better AI work.

That instinct makes sense individually, but it is dangerous organisationally.

If every team protects its context, the organisation becomes slower exactly when speed matters more. If context is shared, structured, and made available to AI systems, more people can do higher quality work.

I want every person I work with to have three things:

- The context of the thing they are trying to improve.
- The tools to talk to that context with AI.
- The skill to turn a problem, plus AI, plus context, into a working solution.

That feels like a big part of the future of work: people explaining how things really work, capturing that as context, and making it available so others can build on top of it.

For a product team, that might mean the complete codebase context, product strategy, customer feedback, support issues, analytics, design decisions, and roadmap trade-offs.

For a consulting team, it might mean the methodology, previous deliverables, best practice, client examples, common risks, and delivery playbooks.

For an operations team, it might mean process maps, exceptions, policies, system constraints, recurring failures, and the unwritten knowledge that usually lives in people's heads.

The work becomes partly about codifying reality.

Not making a perfect knowledge base that nobody reads. Capturing enough of how things really work that AI can speak to it, reason over it, and help people act on it.

## A self-improving loop

I saw another version of this while building [Skimless.com](https://skimless.com).

The product started as a simple idea: choose YouTube channels, RSS feeds, newsletters, and changelogs, then receive a daily or weekly audio brief with only the relevant updates.

After building the MVP, I realised the same pattern could apply to departments inside a company. Every team could have its own daily brief.

Product could track competitors, changelogs, customer feedback, technical releases, and market shifts.

Marketing could track positioning, campaigns, search trends, content formats, and what competitors are saying.

Sales could track customer signals, objections, industry news, account triggers, and buying language.

Leadership could track the few things that matter without manually scanning everything.

Then the more interesting thought arrived: those briefs do not only have to inform humans. They can become context for AI agents.

A coding agent could read the product brief and suggest product changes. It could read competitor updates and propose positioning changes. It could read customer feedback and improve onboarding. With analytics and human review added in, you get the outline of a self-improving business loop:

Collect relevant information. Tailor it to the team. Review it. Feed the useful context back into the system. Improve the product or business. Repeat.

The bottleneck is still human judgment. Hallucination still matters. Review still matters. But the direction feels clear: summarisation is only the start. The real value is tailoring large amounts of information for a specific purpose, then turning that context into action.

This distinction feels important.

Most people think of AI summaries as the end product. "Summarise this so I can read less." That is useful, but it is not the real unlock.

The more interesting flow is:

- Gather more information than a human could reasonably track.
- Tailor it for a specific purpose.
- Let a human review the high-signal version.
- Aggregate the reviewed context.
- Hand it to AI systems that can research further, propose changes, and apply the relevant parts.

That is closer to a learning loop than a summary tool.

In the case of Skimless itself, the idea becomes almost recursive. The product could monitor the market it operates in, track competitor changelogs, find content opportunities, adjust pricing ideas, improve onboarding, suggest product features, and create marketing experiments. Not autonomously end-to-end, at least not yet. But enough to make the business feel more self-improving.

The limiting factor is not access to information. AI can process more than we can. The limiting factor is review, trust, and deciding which changes should actually happen.

That is why I think the combination of mass information, tailored briefs, human review, and AI action is more interesting than generic agents promising to run a business by themselves.

## Where I think this goes

I do not think the future is "everyone becomes a software engineer" in the traditional sense.

I think more people become solvers of their own problems.

That is the thread connecting all of this:

- Subject matter experts can build more of their own tools.
- AI makes demos cheaper than memos.
- Buying niche software remains slow because organisational approval is slow.
- Building remains hard because maintenance, governance, support, and domain knowledge still matter.
- External IP can become internal software faster than before.
- Context becomes a shared asset rather than a private moat.
- Businesses can start to create loops where information becomes action much faster.

IT and AI teams still matter, but their role changes. Instead of being the only builders, they become enablers, reviewers, deployment partners, maintainers, and teachers. They help teams build safely. They provide the paved roads. They make sure the things that start as prototypes can survive contact with real users, data, and governance.

Domain experts also have to change. It will not be enough to say "I am not technical." If you understand a valuable problem deeply, you can now do much more with that understanding. You may not need to become a traditional engineer, but you probably do need to become fluent enough with AI tools to build, test, explain, and iterate.

Maintenance is still the unsolved bit. Anyone can build now, or at least many more people can. But keeping software working, secure, useful, and aligned with a changing organisation is still hard. That will get easier too, but it is not zero yet.

Feedback is another constraint that has not gone to zero. Building may be fast. Fixing may be fast. Adding features may be fast. But getting time from the people whose feedback matters can still be slow and expensive. That makes it even more important to use AI to improve the thing before asking for human attention.

The scarce resources shift from code to context, feedback, maintenance, and IP.

Building gets cheaper. Knowing gets more important.

That is the prediction I want to start this blog with.

The next advantage will not come from being able to produce software at all. More people will be able to do that. The advantage will come from knowing which problems are worth solving, having the context to solve them well, moving through feedback loops quickly, and turning real expertise into systems other people can use.`,
        tags: ["ai", "software", "work"],
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
      shelf: false,
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
      id: "skimless",
      eyebrow: "Monthly experiment",
      title: "Skimless",
      proofLine:
        "Tailored audio updates from YouTube channels, newsletters, RSS feeds, docs, and changelogs.",
      hrefKey: "skimless",
      ctaLabel: "skimless.com",
      media: {
        kind: "image",
        src: "/demos/skimless-poster.png",
        alt: "Skimless landing page showing tailored audio updates from sources you follow.",
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
