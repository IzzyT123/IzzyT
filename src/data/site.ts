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
        id: "adopting-intelligence",
        slug: "adopting-intelligence",
        title: "Adopting Intelligence",
        date: "2026-06-01",
        excerpt:
          "The productivity gain from AI is real and compounding. The decision that actually matters is whether leaders spend it on cost cutting, more output, or far better quality. I think the winners will reframe AI as intelligence, and adoption as a mindset rather than a tool.",
        body: `Last month I wrote that the cost of building is falling while the cost of knowing what to build is not. This month I want to pick up where that left off, because the more I use these tools the more I think the interesting decision is not whether AI makes us faster. It clearly does. The interesting decision is what we choose to do with the time it gives back.

## The 10x question

A developer can now do something like ten times the work. So what does that mean?

Does it mean you build ten times more websites? Does it mean you use a tenth of the developers? Or does it mean you build the same thing, ten times better?

I think the honest answer is a mixture of all three, and the mix is the whole game.

At Issoria, do we want to do ten times the work for ten times the customers? Yes, of course. But so does everyone else. If the gain is available to everyone, doing more of the same does not win. So we have to spend some of that new efficiency on a better product: communicating our value proposition more clearly, making video instead of slides, sharpening the thing itself rather than just shipping more of it. We are not trying to reduce headcount. We are trying to take market share with a better product and service, and that only works if the efficiency goes into quality, not just volume.

That is the part I think most leaders are getting wrong. The default framing is cost reduction. Output goes up ten times, so surely you need a tenth of the people. But that is only one lever. Any business advantage can be spent on quantity, quality, or speed, and the mix you choose dictates where you land in your sector. If you want to win, as an individual or an organisation, you have to start framing AI as improved quality and increased output, not as a way to do the same work with fewer people.

There is also a demand-side point that keeps getting skipped. Many sectors are going to see increased demand as well as increased supply. Cheaper, faster, better tends to grow markets, not shrink them. So I do not think this is simply less need for people. It is a redistribution of where people add value, plus a set of genuinely new roles, most of them clustered around AI itself.

## Cut out the middle

I called the first post's section demos, not memos, and I want to extend it.

The instinct we have all been trained on is to optimise the middle. We strategise, plan, debate, calculate, model, and produce a beautiful analysis so that a human can then work out what to do with it. That made sense when building and acting were expensive. It makes much less sense now.

So I keep asking a smaller set of questions. What do we actually have? Where does the context live? What is the absolute end goal? Then I try to delete everything in between.

Do not optimise to create the best analysis so that humans can figure out the implication. Tell the AI what the end goal is and ask it for the so what. Get it to suggest the action, then bring human judgment to the decision rather than to the production. The analysis is no longer the deliverable. The decision is.

## Compounding skills

The reason the gain feels larger than ten times for me is that the skills compound.

AI lets you work in a way that does not need perfect information. An instruction can contain useless detail, misspellings, half-formed thoughts, and the model still gets it. That means you can stop being precise on the way in. A catch-all intake beats a carefully formatted one, because the cost of being messy has dropped to almost nothing.

That unlocks a stack of efficiencies that each multiply the others:

- Dictate instead of type. Wispr Flow lets me speak my way through work, and I am roughly four times faster speaking than typing.
- Meet instead of email. Even a one-person recording or voice memo works, as long as there is a transcript and any files travel with it.
- Demo instead of memo. Turn up with a prototype instead of an abstract argument.
- Add context from as many sources as could possibly be useful, rather than the minimum.

Individually these are four, five, ten times improvements. Stacked together, they can compound into something closer to a hundred times. A workflow I actually use: build a rough prototype of a tool in Cursor that we could give a client for free, present it in a recorded meeting and ask for feedback there and then, push the transcript back into Cursor to finish the tool, then use a coding agent with the codebase and the transcript to produce the deck that goes out to clients.

Issoria records all of its meetings, and that has quietly become one of our biggest compounding advantages. Every transcript can be dropped straight into a chatbot, a coding agent, a co-working agent, whatever fits. The AI strips out what is irrelevant and understands the full context of the conversation, even the parts that were not said cleanly. Nobody has to comb through with a fine-tooth comb to pull out the important bits, and nobody even has to have fully understood the meeting in the moment. I have noticed the model is often better than my own ear at catching what someone actually meant, as opposed to what I assumed they meant. Maybe I am just a bad listener. Either way, the transfer of information becomes so fast that it speeds up everything downstream.

That is the real prize. Right now this advantage is not widely copied, and large organisations struggle to copy it at all because of governance, security, and structure. It will not last forever, but while it does it is worth exploiting to the maximum.

## The data security bottleneck

There is one obvious thing slowing this down, and it is data security.

People say all sorts of things in a meeting. Names, client details, sensitive specifics about change programmes and projects. You do not want any of that going into a model. And today the only safe way to remove it is to strip it out by hand, because you cannot ask an AI to clean the transcript without first handing the sensitive data to the AI, which is the exact thing you were trying to avoid.

What I think will be genuinely useful is a local model that never leaves the organisation's environment, protected the same way sensitive client data is protected today. Something inside Microsoft's stack, or similar, where you can throw in a transcript, an email, anything, and it does not delete the sensitive data so much as make it generic, so there is no way to trace it back to a specific client or person. Once it is genericised, the output is safe to use with everything else. Solve that, and the whole compounding workflow opens up for the kinds of organisations that currently cannot touch it.

## Small and fast against big and careful

A lot of the value we create is simply running this efficient workflow on behalf of organisations that structurally cannot.

I can feel myself working at something like a hundred times the effective speed of someone inside a large client. Not because I am better at the job. Because I have tools available to me that they cannot have, and those tools compound. Same accuracy, far more speed. I think this is going to push large organisations towards exporting tasks to smaller ones that can operate this way, at least until the big organisations catch up.

This is also why adoption is the differentiator. You cannot afford to be anything but an early adopter, because early adoption compounds into an advantage over everyone slower. To serve a client well, you have to adopt faster than that client does. The caveat is data security first, then adopt just after the initial bugs are found so you are not wasting time being the very first to hit every wall. Culture has to turn into early adoption with that one guardrail.

## This is not a normal technology rollout

Organisational change management has always been about getting people to adopt a new technology so the same job gets done better, faster, or cheaper. The easy move is to treat AI as exactly that: another system, another implementation, another adoption curve. Large organisations will do this, and their change managers will face the same adoption problems they always have.

I think that is a mistake, or at least a missed opportunity. This is not really the adoption of a tool. It is a shift from human to AI-augmented human. Where you sit on the adoption curve of a specific tool matters far less than where you sit on the adoption curve of being an AI-augmented person. That is the thing that makes you win or lose.

One small reframe that helps me: swap the word AI for intelligence. Instead of the implementation of AI, say the implementation of intelligence. It changes how people think about the problem and the benefit. Not every employee becomes a technologist, but everyone needs to know how to use intelligence to solve their own problems better, faster, or cheaper. Like Tesla being a technology company that happens to make cars, most large organisations are going to become technology businesses whether they intend to or not.

So adoption becomes more important, but it is not the adoption of tools. It is the adoption of a mindset: people learning, experimenting, redesigning their own work, and improving their outputs faster than the market around them. Adoption as a strategic capability. That also shifts change work away from training and towards self-teaching. There will be new forms of training, including AI systems and chatbots built for the purpose, but the core capability an organisation needs to build is the ability for anyone to teach themselves anything.

It helps to separate three different uses of AI when talking about change:

1. AI as a tool to get the change work itself done, the natural progression of previous change toolkits and platforms, needed just to keep pace with the rising number of projects.
2. Change management for teams introducing AI as a technology. This is classic change.
3. Change management for organisations adopting the new mindset, where AI-augmented humans with effectively unlimited knowledge produce better outputs. This is the one almost nobody is doing yet.

## A new social contract

I think AI forces a new social contract inside organisations, and stakeholders need to know where their organisation actually stands. Every organisation will have to decide its position on the quality, output, and cost mix, and then be honest about how that mix will flex over time, the same way companies have always swung between investment and cost cutting.

That contract has to answer the questions every employee is already asking quietly:

- Am I still needed?
- Will my expertise still matter?
- Will junior roles disappear?
- Will my work be judged against machine output?
- Who actually gets the productivity gain?

On employment, I think the disruption is real but not the one people describe. In the very short term, new graduates look most exposed, because the entry-level work is the easiest to absorb. But that is true of almost every technology shift, and it does not last. The harder decisions sit with employers. Do you retain the veterans who hold deep specialist knowledge and most of the organisation's context? Or do you hire young people who will adopt AI far faster? Are generalists better hires now that AI can teach anyone anything, or is the right move to upskill specialists so they can use AI on the hardest problems and have the confidence to oversee it?

My own view is that we are heading into a transition period defined by one task: moving organisational knowledge out of the most experienced people and into the organisation itself, by building the context layer. Context is siloed today, and people will hold onto it because it is the last moat they have. AI destroys most moats. With intelligence cheap, context becomes the final one. That suggests people may need to be paid, or given ownership, in exchange for transferring what they know. After that, most successful businesses look like tech businesses, which means a lower average age, because younger people are AI-native and do not carry the old ways of working. Most people end up closer to product owners, and may need to be incentivised on that basis.

This is where ownership gets interesting. People who understand a problem deeply will become builders, and they should want to own the asset, which is the solution. Companies that understand this will start to incentivise based on assets produced and equity in those solutions. You could imagine something like a DAO structure being optimal, where people are rewarded with sweat equity. We have also seen how badly those can go on incentive alignment and decision speed, so I suspect the real answer is a hybrid of a DAO and a traditional company. Maybe internal joint ventures, so builders solve hard problems inside the business instead of leaving to solve them outside it.

## On burnout, and the mindset that handles it

There is a cost to all this, and it is burnout. AI moves so fast that keeping up is exhausting, and there is real anxiety in constantly having to adapt. I think the next generation will be better at it, not because they are smarter, but because they will have grown up in a fast-moving environment and will be comfortable with chaos. That comfort with chaos may be the key difference between the people who pull ahead and the people who fall behind, and it is the thing the rest of us have to work on deliberately.

The trick is not to let it hurt when it is time to move to the next tool. The rapid iteration mindset pays off quickly now, because the long term has become very short. It is a bit like dopamine versus long-term benefit. The dopamine hit usually wins unless you can reach the long-term benefit without too much pain. With AI the long term is so compressed that the benefit arrives almost immediately. So the whole skill is just to start, and to keep starting. The rest tends to take care of itself.

There is a list going around of the skills people will need in an AI world: learning as a habit, adaptability, curiosity, organisations providing the tools and opportunities to learn, trusting your experts to decide closest to the action, taking pride in everyone's success, courage to move forward, and leaders giving people ownership. I agree with most of it. The ones I feel most strongly about are learning as a habit, adaptability, curiosity, and ownership. The shelf life of any specific piece of knowledge is heading towards zero, so resilience and a willingness to keep rebuilding your own workflow matter more than any individual skill. And organisations have to hold up their end: build that mindset, agree the social contract, provide the access and tools, and give people real ownership of what they create. If someone is effectively automating part of their own role, the honest questions are how they are rewarded for it, where they move next, and what the new role actually is.

## Speak, do not type

A smaller, practical thing I have become convinced of: people need to start speaking into their computers, especially for AI prompts.

We are lazy for good reason. We want the most output for the least effort. That instinct usually pushes people towards shorter prompts, but with AI the quality of your prompt is directly reflected in the quality of the output, so less is almost never more. Speaking for five minutes feels like the same effort as typing for five minutes, but it gives the model far more context. The result is not five times better, but it is meaningfully better, for the same time spent. I type at maybe a fifth of the speed I speak, even though I speak slowly, so this matters even more for me.

The problem is I cannot talk to my machine in a co-working space, so I have started working from home more, which is fine but not ideal long term. Wispr Flow helps because you can genuinely whisper, but you still cannot do that with confidence around other people. Someone needs to build a microphone that does not let sound escape, almost a noise-cancelling microphone in reverse. If I had the money, that is the hardware I would try to build.

## A note on robots

One last thought, on a completely different topic, because it has been bothering me.

The standard argument for humanoid robots is that nature already built a general-purpose body for using tools and getting survival tasks done, and people accept a human shape. So we build humanoids, embody the AI, and train it over and over on specific tasks.

But is that actually efficient? Instead of forcing the task to be solved by a human-shaped body, why not let the task dictate the body? Rather than building copies of humans, we could build evolution. Reward the AI for completing a set of tasks, or all human tasks, and then ask it to iterate on the body rather than just the skill. The form of the robot would fall out of that process.

I understand we build humanoids because people accept them, and that acceptance has real value. But in the long run, the company that builds the robots that get the tasks done with a hundred times less energy is the one that wins. And it is worth asking, as with so much of this, whether game theory even applies cleanly to AI, or whether the usual assumptions about competition and equilibrium start to break when one of the players can iterate this fast.

That is where my head has been this month. The gain is real. The decision is what we do with it. I think the people and organisations that frame it as quality and output, adopt the mindset before the tools, and share solutions instead of hoarding context, are going to pull away from everyone else.`,
        tags: ["ai", "work", "leadership"],
      },
      {
        id: "cost-of-building-is-falling",
        slug: "cost-of-building-is-falling",
        title:
          "The Cost of Building Is Falling. The Cost of Knowing What to Build Isn't.",
        date: "2026-05-04",
        excerpt:
          "AI is making software faster to build, but the scarce part is shifting to domain knowledge, feedback loops, organisational context, IP, and maintenance.",
        body: `This is my first post here, so I want to write it more like a marker in the ground than a polished argument.

Over the last month I have been circling around one idea from a few different directions:

The cost of building software is moving towards zero. The cost of knowing what to build is not.

That sounds like a big claim, and I mean it directionally rather than literally. Software is still hard. Production is still hard. Security, data, integrations, accessibility, reliability, procurement, support, training, and maintenance are all still real. The act of turning a fairly clear idea into a working prototype, and often into something much more than a prototype, has become dramatically cheaper.

That changes the shape of product development. It changes who gets to build. It changes the value of domain knowledge. It changes the old build vs buy calculation. It changes how teams should communicate. It changes what personal and organisational moats look like.

I am writing this partly because I want izzyt.com to become a public notebook for these ideas: a journal of things I am noticing while building products, working with AI, and trying to understand where work is going.

## Subject matter experts become builders

The most interesting AI builders I can see coming are subject matter experts who have lived with a problem for years.

They know the messy workflows. They know which shortcuts are dangerous. They know where people waste time, where handoffs break, what needs governance, what users will actually trust, and which edge cases matter.

Until recently, that knowledge had to be translated through several layers before it became software. A practitioner explained the problem to a manager, the manager explained it to a product person, the product person explained it to a designer or engineer, and then the result slowly made its way back to the practitioner for feedback.

Every translation step lost something. Sometimes the lost thing was small, like a phrase or a field name. Sometimes it was the real reason the tool needed to exist.

AI compresses that loop. The person with the problem can now build enough of the solution to make the conversation concrete. They can show the workflow. They can test the logic. They can feel where it is clunky. They can explain the missing bit by pointing at the thing, instead of writing another paragraph.

That is why I think MVPs set the bar too low. A minimum viable product is often enough to test whether an idea exists. Lovable uses the phrase minimum lovable product, and I understand why: love is a much better ambition than viability. For AI-built domain tools, the target should be more specific.

The aim should be a Minimum Solved Product.

The minimum product that solves the user's problem at that point. Something that already relieves the pain, does the job, and proves the workflow. The technical parts may still need help, but the shape of the solution can come directly from the person who understands the work.

The point of the MVP used to be: can we test whether this should exist?

The point of an MSP in this new world might be: can the person with the problem build something good enough that the technical work is mainly hardening, integration, deployment, and maintenance?

That is a very different distribution of effort.

It also changes who should be upskilled. Rather than asking IT to develop AI tools for every domain, organisations may get further by asking AI and IT teams to upskill one person inside each domain team until that person can solve their own problems with AI. IT will rarely understand every niche deeply enough, and they should not have to.

With the right support and guardrails, that person can become a serious builder.

The model I keep coming back to is two-in-a-box: a domain expert who owns the problem and a technical partner who helps with the parts that need engineering judgement, governance, deployment, security, and long-term maintainability.

The domain expert should be able to move before waiting months for a team to understand the problem. The technical team should get clearer prototypes instead of guessing what practitioners need. AI makes the middle smaller.

## The new build vs buy calculation

The economics of buying niche software inside large organisations have not changed as much as the AI conversation suggests.

The sticker price is rarely the whole problem. The real cost is approval: procurement, legal, security, architecture review, AI governance, budget ownership, implementation planning, change management, training, and support. For a small team with an urgent problem, buying software can still mean waiting nine to twelve months before anything useful happens.

That is why "SaaS is dead" feels too simplistic, but "the old SaaS buying motion is under pressure" feels right.

For a lot of large organisations, the first serious step into AI adoption has been something like Microsoft Copilot, CompanyGPT, ChatCompany, or an internal chat tool over approved data. That makes sense. It is easier to approve a broad enterprise capability than hundreds of small external AI tools.

But once that stack exists, the question changes.

If a team already has approved AI tooling, approved cloud infrastructure, approved identity, approved data controls, and approved governance, do they really need to buy another niche platform every time they find a specialist workflow? Or can they build enough of it internally on top of the stack they already have?

The perception of building is changing because AI makes it feel easy. The perception of buying is also changing because large organisations make it feel slow.

Building still has real costs. AI can make coding much faster, while maintenance, security, governance, integration, change management, training, and support remain. Years of domain knowledge are still needed to know what to build in the first place.

In specialist software, the hard part is often the IP: the tested workflows, best practices, decision logic, language, templates, pitfalls, and painful lessons that only come from working with practitioners for years.

So the useful question becomes bigger than "build or buy?"

I think a better model is external IP, built internally.

By that I mean taking proven specialist knowledge, workflows, decision logic, and product patterns, then instantiating them inside a client's existing approved stack. The value is the shortcut: years of tested thinking turned into working software quickly, using the tools and controls the organisation already has.

I have learned this through [ChangeAble.ai](https://changeable.ai). The valuable part goes beyond the interface or the code. It is the accumulated understanding of change management: the jobs to be done, the pains to relieve, the gains to create, the documents people need, the review points, the governance concerns, the language practitioners use, and the places work usually slows down.

AI makes that IP easier to turn into software and more valuable to express in different forms.

A specialist product might still exist as SaaS. It might also become a GPT. It might become a set of n8n flows. It might become a custom app on a client's existing stack. It might become a library of prompts, templates, workflows, schemas, evaluations, and agents. The underlying asset is the knowledge of how to solve the problem, expressed through whichever product shape fits the context.

That creates an awkward commercial question.

If a consultancy or specialist firm can convert its IP into a working internal tool in five days, charging time and materials devalues the years of research and practice behind it. But if the client hosts, owns, maintains, and updates the system on their own technology, they may not want to pay a traditional subscription either.

So what is the value?

Maybe the value is anchored to the internal alternative. If it would take a team three to six months and tens of thousands of pounds to build the capability themselves, but a specialist can instantiate a version in a week because they already understand the domain, the pricing should reflect the avoided time, risk, and discovery cost rather than the raw coding hours.

That might lead to a new kind of software IP: a proven solution architecture that can be rapidly deployed inside a client's environment.

The best target for this is probably the smallest valuable slice that can get through the fewest hoops, demonstrate value quickly, and create evidence.

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

Strategy and judgment still matter. They move closer to the work. Instead of spending weeks aligning around a memo, a team can build, test with AI, show the prototype to users, then iterate with real evidence.

That last part is important. Fast OODA loops, test-and-learn, and "do things that do not scale" have been good product wisdom for years. AI accelerates the early loops. A lot of what would previously have required a first round of human testing can now be explored by building, testing, and iterating with AI before putting the thing in front of busy people.

Human feedback is still the important feedback. It is also expensive, especially when the users are senior, scarce, or overloaded. So we should spend that feedback more carefully.

Demoing also changes buy-in. It is much easier to sell something that visibly saves time, saves money, or improves quality. It is much easier to explain a workflow by showing it than by describing it. It is much easier to make something feel relevant when the demo uses the client's language, their methodology, and even their brand colours.

There is less room for ambiguity when the product is on screen.

This is also where AI computer use and AI QA become interesting. If agents can help test early flows, click through prototypes, find rough edges, and compare behaviour against expected outcomes, then the first human review can start at a higher level. The practitioner can spend their scarce attention on the issues that actually need their judgment.

## Context becomes the organisation's advantage

For individuals, knowledge and critical thinking used to feel like a personal moat. AI weakens that moat because it gives more people access to good reasoning on demand.

That has been uncomfortable to realise personally.

Knowledge and critical thinking used to feel like things I could rely on. AI has made them less scarce. More people can now ask good questions, generate options, critique plans, learn quickly, and produce decent work.

For now, early adopter mindset is an advantage. So is applying what I learn quickly. So is working longer hours than others while a new technology curve is still steep. Those moats are temporary because people catch up along adoption curves.

The new advantage may be context.

Useful context: how the business works, what customers say, how products are built, which decisions were made, what has been tried before, what failed, what language the market uses, what the codebase does, and what good looks like.

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

The goal is to capture enough of how things really work that AI can speak to it, reason over it, and help people act on it.

## A self-improving loop

I saw another version of this while building [Skimless.com](https://skimless.com).

The product started as a simple idea: choose YouTube channels, RSS feeds, newsletters, and changelogs, then receive a daily or weekly audio brief with only the relevant updates.

After building the MVP, I realised the same pattern could apply to departments inside a company. Every team could have its own daily brief.

Product could track competitors, changelogs, customer feedback, technical releases, and market shifts.

Marketing could track positioning, campaigns, search trends, content formats, and what competitors are saying.

Sales could track customer signals, objections, industry news, account triggers, and buying language.

Leadership could track the few things that matter without manually scanning everything.

Then the more interesting thought arrived: those briefs can inform humans and become context for AI agents.

A coding agent could read the product brief and suggest product changes. It could read competitor updates and propose positioning changes. It could read customer feedback and improve onboarding. With analytics and human review added in, you get the outline of a self-improving business loop:

Collect relevant information. Tailor it to the team. Review it. Feed the useful context back into the system. Improve the product or business. Repeat.

The bottleneck is still human judgment. Hallucination still matters. Review still matters. But the direction feels clear: summarisation is only the start. The real value is tailoring large amounts of information for a specific purpose, then turning that context into action.

This distinction feels important.

Most people think of AI summaries as the end product. "Summarise this so I can read less." That is useful. The bigger unlock is turning reviewed context into action.

The more interesting flow is:

- Gather more information than a human could reasonably track.
- Tailor it for a specific purpose.
- Let a human review the high-signal version.
- Aggregate the reviewed context.
- Hand it to AI systems that can research further, propose changes, and apply the relevant parts.

That is closer to a learning loop than a summary tool.

In the case of Skimless itself, the idea becomes almost recursive. The product could monitor the market it operates in, track competitor changelogs, find content opportunities, adjust pricing ideas, improve onboarding, suggest product features, and create marketing experiments, with humans still reviewing the important decisions. That would be enough to make the business feel more self-improving.

The limiting factor is review, trust, and deciding which changes should actually happen. AI can process more information than we can.

That is why I think the combination of mass information, tailored briefs, human review, and AI action is more interesting than generic agents promising to run a business by themselves.

## Where I think this goes

The future I see is more specific than "everyone becomes a software engineer" in the traditional sense.

More people become solvers of their own problems.

That is the thread connecting all of this:

- Subject matter experts can build more of their own tools.
- AI makes demos cheaper than memos.
- Buying niche software remains slow because organisational approval is slow.
- Building remains hard because maintenance, governance, support, and domain knowledge still matter.
- External IP can become internal software faster than before.
- Context becomes a shared asset rather than a private moat.
- Businesses can start to create loops where information becomes action much faster.

IT and AI teams still matter, and their role changes. They become enablers, reviewers, deployment partners, maintainers, and teachers. They help teams build safely. They provide the paved roads. They make sure the things that start as prototypes can survive contact with real users, data, and governance.

Domain experts also have to change. "I am not technical" will become a weaker excuse. If you understand a valuable problem deeply, you can now do much more with that understanding. You may never need to become a traditional engineer, but you probably do need to become fluent enough with AI tools to build, test, explain, and iterate.

Maintenance remains the unsolved bit. Anyone can build now, or at least many more people can. Keeping software working, secure, useful, and aligned with a changing organisation is still hard. That will get easier too, but the cost is still above zero.

Feedback remains another constraint. Building may be fast. Fixing may be fast. Adding features may be fast. Getting time from the people whose feedback matters can still be slow and expensive. That makes it even more important to use AI to improve the thing before asking for human attention.

The scarce resources shift from code to context, feedback, maintenance, and IP.

Building gets cheaper. Knowing gets more important.

That is the prediction I want to start this blog with.

The next advantage will be less about producing software at all. More people will be able to do that. The advantage will come from knowing which problems are worth solving, having the context to solve them well, moving through feedback loops quickly, and turning real expertise into systems other people can use.`,
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
