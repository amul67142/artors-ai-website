/**
 * Seeds the AI-consulting content cluster — three glossary terms and one
 * article, all pointing at the existing /services/consulting pillar.
 *
 *   npm run seed:consulting
 *
 * Kept as its own file rather than folded into seed-glossary/seed-insights
 * because it is one topic cluster: the terms and the article cross-link to
 * each other and to the consulting pillar, and they are easier to review and
 * revise together. All three seeds upsert on slug, so running any of them is
 * safe in any order.
 *
 * Deliberately NOT a new page. /services/consulting already exists and already
 * sells audits, roadmaps, training and the fractional AI officer. A second
 * page on the same subject would compete with it for the same searches and
 * both would rank worse. These are the long-tail entries that feed it.
 *
 * Editorial rules, from docs/PLAN.md and docs/COPY.md:
 *   - No claim about a result Artors has produced. No client names, no
 *     metrics. Capability statements only.
 *   - Say when you do NOT need the thing being sold. It is the most credible
 *     sentence available to an agency with no case studies yet.
 */
import mysql from "mysql2/promise";

const TERMS = [
  {
    slug: "ai-consultant",
    term: "AI consultant",
    relatedService: "consulting",
    relatedTerms: "ai-audit,fractional-ai-officer,business-process-automation",
    definition:
      "An AI consultant is someone you pay for judgement rather than delivery — to work out where AI would actually pay in your business, in what order, and what to leave alone — so the output is a decision you can act on rather than a system you now have to maintain.",
    body: `The title is unregulated, which means it covers people doing genuinely different jobs. Knowing which one you are hiring is most of the value of the decision.

## The three things sold as "AI consulting"

**Advisory.** Someone reviews how the business actually works, finds where hours and errors go, and tells you what to do about it. The deliverable is a prioritised list and the reasoning behind it. No software is built.

**Enablement.** Training your team on tools they will use, with prompts and playbooks they keep. The deliverable is capability inside your business.

**Delivery dressed as advice.** A discovery phase whose real function is to justify a build. Not automatically wrong, but you should know that is what it is, because the recommendation is rarely going to be "do nothing".

## What a good one actually does

Spends most of the engagement on your business rather than on AI. The hard part is never the technology — it is working out which of your processes are stable enough to be worth encoding, which are about to change anyway, and which are broken in a way software would only entrench.

They should also be able to tell you what not to automate, and to say when a problem is a management problem wearing a technology costume. A consultant for whom everything is an AI opportunity is selling capacity rather than judgement.

## When you do not need one

If you already know which process is costing you and roughly what a fix looks like, you need a build partner, not an advisor. Paying for a discovery phase to confirm what you already know is a common and avoidable expense.

You also do not need one if the honest answer is that nothing is stable enough to automate yet. A business mid-restructure is better served fixing the process than encoding it.

## How to judge one before you commit

Ask what they would tell you not to do, and ask what would make them recommend walking away. Specific answers come from people who have run the engagement before. Uniformly positive answers usually mean the recommendation was decided before the review began.`,
    faq: [
      {
        q: "What is the difference between an AI consultant and an AI agency?",
        a: "A consultant sells judgement and hands you a decision; an agency sells delivery and hands you a working system. Many firms do both, which is fine as long as the advisory stage can honestly end in \"do not build this\".",
      },
      {
        q: "How long should an engagement be?",
        a: "An initial audit is usually a matter of weeks, not months — long enough to see how the work really happens, short enough that the findings are still current when they land. Ongoing advisory works better as a small standing commitment than a large one-off.",
      },
      {
        q: "Should the consultant also build the system?",
        a: "It can be efficient, because the context does not have to be rebuilt by a second team. The thing to watch is whether the advice can still be honest when the same firm profits from a yes. Ask that question out loud; the answer is revealing.",
      },
    ],
  },

  {
    slug: "fractional-ai-officer",
    term: "fractional AI officer",
    relatedService: "consulting",
    relatedTerms: "ai-consultant,ai-audit,ai-agent",
    definition:
      "A fractional AI officer is a senior AI lead retained for a few days a month, giving a business the direction, vendor judgement and guardrails of a full-time head of AI without the cost or the commitment of that hire.",
    body: `Most mid-sized businesses have the same problem: enough AI activity to need someone senior deciding things, nowhere near enough to justify a full-time executive at that level.

The result is usually that the decisions get made by whoever is enthusiastic, or by whichever vendor presented most recently.

## What the role covers

- **Direction.** What gets built next, and in what order.
- **Vendor judgement.** Reading proposals for what they omit, which is a skill that comes from having been burnt.
- **Guardrails.** What the systems are not allowed to do, and where a human has to stay in the loop.
- **Internal capability.** Making sure the team can run what exists, rather than the knowledge sitting with one contractor.

## Why it works part-time

Because the work is bursty. Setting direction takes concentrated thought a few times a year; the rest is review, unblocking and the occasional firm no. That is a poor fit for a full-time hire and a good fit for a standing arrangement.

## When it is the wrong shape

If you have no AI work running at all, this is premature — start with an audit and one pilot. If you have a large programme with several teams, the work has outgrown a few days a month and you should hire.

## The thing that makes or breaks it

Access. A fractional lead who only sees a monthly summary is a reviewer, not a decision-maker. The arrangement works when they can talk to the people doing the work and see what is actually happening, which means it is as much a decision about how you operate as about who you retain.`,
    faq: [
      {
        q: "How much time does it usually involve?",
        a: "Commonly a small number of days a month, scaled to how much is actually running. The useful test is whether decisions are waiting on the arrangement — if they are, it is too little.",
      },
      {
        q: "Is this just consulting on a retainer?",
        a: "The difference is accountability. A consultant advises and leaves; a fractional officer owns the direction and lives with the consequences of it, which changes what they recommend.",
      },
    ],
  },

  {
    slug: "ai-audit",
    term: "AI audit",
    relatedService: "consulting",
    relatedTerms: "ai-consultant,business-process-automation,workflow-automation",
    definition:
      "An AI audit is a structured review of how a business actually works — where hours, errors and delays accumulate — that ends in a prioritised list of what to automate first, what to fix manually, and what to leave alone.",
    body: `The word suggests an assessment of your AI. For most businesses it is the opposite: an assessment of your processes, from which the AI question follows.

## What it examines

Not your technology stack. Your work. Where a request enters the business, every hand it passes through, where it waits, where it gets re-typed, and where it goes wrong often enough that someone has built a habit around checking.

The most valuable findings are usually unglamorous. A step that exists because of a system retired three years ago. An approval nobody can explain. A report produced weekly that nobody opens.

## Why it has to be observed, not described

Ask how a process works and you get the official version. Watch it and you get the real one, which is reliably different — the documented path plus three workarounds people invented and never mentioned because they no longer notice them.

Those workarounds are the audit's best material. They mark exactly where the process fails, and they were discovered by the people who do the work.

## What a good audit produces

- A shortlist, ranked by volume against effort, not by how interesting each item is
- An explicit "not this" list, with the reasoning — usually more useful than the shortlist
- The measure each item should move, chosen from numbers you already track
- Steps that should be deleted rather than automated, which is the cheapest improvement available

## The failure mode to avoid

An audit that recommends everything. A list of forty opportunities is not a plan; it is a way of avoiding the responsibility of choosing. The value is in the ranking and the exclusions, because those are the parts that required judgement.`,
    faq: [
      {
        q: "How long does an audit take?",
        a: "Usually weeks rather than months. Long enough to observe the work through a normal cycle including a bad week, short enough that the findings are still true when they are delivered.",
      },
      {
        q: "What do we get at the end?",
        a: "A ranked shortlist with the reasoning, an explicit list of what not to automate, and the measure each item should move. If the deliverable is a slide deck of AI trends, that was not an audit.",
      },
      {
        q: "Can we do this ourselves?",
        a: "Partly, and it is worth trying — mapping one process honestly with the person who runs it will teach you a lot. What outside help adds is having seen which of those patterns turn out to be worth automating and which look promising and are not.",
      },
    ],
  },
];

const POSTS = [
  {
    slug: "do-you-need-an-ai-consultant",
    title: "Do you need an AI consultant, or someone to build it?",
    publishedAt: "2026-09-01",
    tags: "consulting, buying, AI strategy",
    excerpt:
      "The two are sold interchangeably and solve different problems. Buying the wrong one wastes either a discovery phase or a build.",
    directAnswer:
      "Hire a consultant when you do not yet know which problem to solve, and a build partner when you already do. Paying for discovery to confirm something you could already state is the most common avoidable cost in an AI project — and building before the problem is clear is the most expensive one.",
    body: `Both are sold as "AI consulting". They answer different questions, and the cost of choosing wrongly falls in different places.

## The distinction in one line

A consultant tells you **what to do**. A build partner **does it**. If you cannot yet write down which process is costing you and roughly what fixing it looks like, you are not ready to buy a build.

## Which you need

| | You need advisory | You need delivery |
|---|---|---|
| The problem is | vague, or contested internally | named, and agreed |
| You can state the measure to move | not yet | yes |
| The risk you are carrying | spending on the wrong thing | spending on the right thing badly |
| What you buy | a ranked plan and a "not this" list | a working system |
| Ends with | a decision | something running in production |

Most businesses can place themselves in one column within a minute of looking at that table honestly. The trouble is that the columns feel embarrassing in different ways — the left one feels like not knowing your own business, and the right one feels like committing before you are sure.

## Signs you are buying discovery you do not need

- You already know which process is the problem, and so does everyone else in the room
- You can name the number you want moved
- The proposal's discovery phase is priced at a meaningful share of the build
- You have had a similar review done in the last year

If three of those are true, ask for a proposal without the discovery phase and see what happens to the price and the confidence.

## Signs you are about to build too early

- Two people in the business would describe the problem differently
- Nobody can say what "better" would look like as a number
- The process is being restructured anyway
- The enthusiasm is for a technology rather than for an outcome

The last one is the most common and the hardest to say out loud. Wanting to use AI agents is not the same as having a problem an AI agent solves.

## The honest case for doing neither yet

Sometimes the answer is that nothing is stable enough to encode. A business mid-restructure, or one where the process genuinely differs by person because nobody has decided which way is right, is better served settling that first.

Software applied to an undecided process does not resolve the ambiguity. It picks one interpretation and makes it permanent, and you will discover which one months later.

## What to ask before you sign either

Ask a consultant what would make them recommend doing nothing. Ask a build partner what they would refuse to build.

Both questions are looking for the same thing: whether the answer was decided before the conversation began. A firm that can describe, specifically, the engagement it turned down is telling you something a portfolio cannot.`,
    faq: [
      {
        q: "Can the same firm do both?",
        a: "Often, and it saves rebuilding context with a second team. The question to put to them directly is whether the advisory stage can honestly conclude \"do not build this\" — and what has happened when it did.",
      },
      {
        q: "How much of the budget should advisory take?",
        a: "There is no correct ratio, but a discovery phase priced near the build deserves an explanation. If the review is that substantial, ask what it produces that changes the build, and whether you could buy the review alone and take it elsewhere.",
      },
      {
        q: "What if we get advisory and the answer is uncomfortable?",
        a: "That is the outcome you were paying for. An audit that finds the real constraint is a management problem rather than a technology one has saved you a build that would not have worked, which is worth considerably more than it cost.",
      },
    ],
  },
];

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — check .env.local");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: url });

// Glossary terms continue the sort order after the existing set.
const [[maxTerm]] = await conn.query("SELECT COALESCE(MAX(sort_order), 0) AS n FROM glossary_terms");
let g = { inserted: 0, updated: 0 };

for (const [i, t] of TERMS.entries()) {
  const [rows] = await conn.query("SELECT id FROM glossary_terms WHERE slug = ?", [t.slug]);
  const values = [
    t.term,
    t.definition,
    t.body,
    JSON.stringify(t.faq ?? []),
    t.relatedTerms ?? null,
    t.relatedService ?? null,
    Number(maxTerm.n) + i + 1,
    1,
  ];
  if (rows.length) {
    await conn.query(
      `UPDATE glossary_terms SET term=?, definition=?, body=?, faq=?, related_terms=?,
       related_service=?, sort_order=?, published=? WHERE slug=?`,
      [...values, t.slug],
    );
    g.updated++;
  } else {
    await conn.query(
      `INSERT INTO glossary_terms
       (slug, term, definition, body, faq, related_terms, related_service, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.slug, ...values],
    );
    g.inserted++;
  }
}

const [[maxPost]] = await conn.query("SELECT COALESCE(MAX(sort_order), 0) AS n FROM insights");
let p = { inserted: 0, updated: 0 };

for (const [i, post] of POSTS.entries()) {
  const [rows] = await conn.query("SELECT id FROM insights WHERE slug = ?", [post.slug]);
  const values = [
    post.title,
    post.excerpt,
    post.directAnswer,
    post.body,
    JSON.stringify(post.faq ?? []),
    post.tags ?? null,
    "Ashutosh Tiwari",
    new Date(post.publishedAt),
    Number(maxPost.n) + i + 1,
    1,
  ];
  if (rows.length) {
    await conn.query(
      `UPDATE insights SET title=?, excerpt=?, direct_answer=?, body=?, faq=?, tags=?,
       author_name=?, published_at=?, sort_order=?, published=? WHERE slug=?`,
      [...values, post.slug],
    );
    p.updated++;
  } else {
    await conn.query(
      `INSERT INTO insights
       (slug, title, excerpt, direct_answer, body, faq, tags, author_name, published_at, sort_order, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      // updated_at = published_at, so a new article does not claim it was
      // updated the day it was created.
      [post.slug, ...values, new Date(post.publishedAt)],
    );
    p.inserted++;
  }
}

const [[terms]] = await conn.query("SELECT COUNT(*) AS n FROM glossary_terms WHERE published = 1");
const [[posts]] = await conn.query("SELECT COUNT(*) AS n FROM insights WHERE published = 1");
console.log(
  `consulting cluster — glossary: ${g.inserted} new, ${g.updated} updated; ` +
    `insights: ${p.inserted} new, ${p.updated} updated`,
);
console.log(`totals now — ${terms.n} terms, ${posts.n} articles published`);
await conn.end();
