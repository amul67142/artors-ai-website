/**
 * Seeds the insights articles. Idempotent — upserts on slug.
 *
 *   npm run seed:insights
 *
 * Editorial rules, from docs/PLAN.md and docs/COPY.md:
 *   - The direct answer is 40-60 words and answers the title outright. It is
 *     the passage AI search extracts, so it must stand alone.
 *   - Outcome-first, professional solution terms, never channel terms.
 *   - NOTHING here claims a result Artors has produced. No client names, no
 *     metrics, no "we increased X by Y". docs/PLAN.md §2 forbids fabricated
 *     proof, and these articles earn trust by being useful instead.
 *   - Where a claim is general industry knowledge it is stated as such, not
 *     dressed up as proprietary research.
 */
import mysql from "mysql2/promise";

const POSTS = [
  {
    slug: "ai-agent-chatbot-or-automation",
    title: "AI agent, chatbot or automation: which do you actually need?",
    publishedAt: "2026-08-12",
    tags: "AI agents, automation, buying",
    excerpt:
      "Three different things get sold under the same word. Picking the wrong one is the most common and most expensive mistake in an AI project.",
    directAnswer:
      "Use an automation when the steps never change, a chatbot when people need answers in conversation, and an AI agent only when the task needs judgement about what to do next. Most businesses are sold an agent when a plain automation would have been cheaper, faster and more reliable.",
    body: `Three products are routinely sold under one word, and the difference between them decides your cost, your reliability and how long the thing survives contact with reality.

## The actual distinction

| | Automation | Chatbot | AI agent |
|---|---|---|---|
| Decides its own steps | No | No | Yes |
| Handles unforeseen cases | No | Poorly | Sometimes |
| Same input, same output | Always | Usually | Not guaranteed |
| Cost to run | Lowest | Low | Highest |
| Debugging when wrong | Straightforward | Straightforward | Hard |

Read that table in one direction and the guidance falls out: prefer the leftmost option that can do the job.

## When an automation is the right answer

If you can write the process as a flowchart and the flowchart is finished, you want an automation. A form arrives, so create the record, notify the owner, send the acknowledgement. There is no judgement in that. Adding a language model to it makes it slower, more expensive and less predictable in exchange for nothing.

This covers far more real business processes than the current conversation suggests.

## When a chatbot is the right answer

When people need answers, in their own words, about things you already know. Opening hours, order status, what is included, whether you cover their area.

The critical design decision is grounding: answers must come from your systems rather than from the model's memory. A chatbot answering from general knowledge will state your delivery radius confidently and incorrectly.

## When an agent earns its cost

When the next step depends on what was found in the last one. Qualifying an enquiry is a genuine example — read the message, look the company up, decide it is out of scope, close it politely. Writing branches for every combination is not practical; deciding case by case is what an agent is for.

The cost is that flexibility and unpredictability are the same property. A system that can handle a case you did not anticipate can also handle it wrongly, which is why agents need logging, guardrails, and a human in the loop for anything irreversible.

## A test that works

Ask: **can I write down every rule?**

If yes, automation. If yes but people will ask in a hundred different ways, chatbot. If no, because the right action depends on what turns up, agent.

Then ask a second question: **what does it cost when this is wrong?** The higher that number, the further left you should sit, and the more checking you should build in.

## Why this goes wrong so often

Because "agent" sells. It is the current word, and a proposal built around it sounds more ambitious than one built around a workflow tool and four API calls — even when the second describes what will actually be delivered.

The practical defence is to ask any vendor which of the three they are proposing and why the simpler option was ruled out. A good answer is specific about the judgement the task requires. A vague one usually means nobody asked.`,
    faq: [
      {
        q: "Can one system be more than one of these?",
        a: "Most real systems are. A typical deployment is mostly ordinary automation with one or two AI steps inside it where judgement is genuinely needed. That is a sign of good design, not a compromise.",
      },
      {
        q: "Is an agent always more expensive to run?",
        a: "Per task, generally yes — it reasons before acting, and reasoning costs. Whether it is more expensive overall depends on what it replaces. The comparison to make is against the labour it removes, not against a simpler automation that could not do the job.",
      },
      {
        q: "How do we start without over-committing?",
        a: "Pick one process, define the outcome you want moved, and build the simplest thing that could move it. A narrow system that works is a better foundation than a broad one that mostly works.",
      },
    ],
  },

  {
    slug: "why-hindi-and-hinglish-break-voice-ai",
    title: "Why Hindi and Hinglish break most voice AI",
    publishedAt: "2026-08-18",
    tags: "voice AI, Hinglish, India",
    excerpt:
      "Systems that score well on English benchmarks routinely fail on Indian phone calls, and the reason is structural rather than a matter of tuning.",
    directAnswer:
      "Most speech systems assume a call has one language and decide which at the start. Indian callers switch between Hindi and English inside a single sentence, so the system mis-hears roughly half of it — and because it catches enough to appear functional, the failure shows up as wrong bookings rather than obvious errors.",
    body: `A caller says: "haan haan, main kal aa sakta hoon, but morning slot chahiye."

That sentence is entirely ordinary on an Indian phone line. It is also the sentence that breaks most voice deployments, and understanding why is the difference between a system that works here and one that demos well.

## The structural problem

Speech recognition models are trained per language. A call is configured as Hindi or as English, and the model transcribes accordingly.

Configure it as English and the Hindi arrives as noise or as nearest-sounding English. Configure it as Hindi and the English words degrade. Automatic language detection helps less than it sounds, because it typically decides once per utterance — and the switching here happens mid-sentence, sometimes mid-clause.

## Why partial failure is worse than total failure

If the system caught nothing, everyone would know immediately. Instead it catches "kal", "morning" and "slot" — enough to act. It books tomorrow morning. The caller wanted tomorrow, morning slot, which happens to be right this time.

Next call, it catches "nahi" as "haan". Now it has confirmed an appointment the caller was cancelling.

The errors are individually small, plausible, and invisible until a customer complains. That is the expensive failure mode: not a system that obviously does not work, but one that appears to work and is quietly wrong often enough to cost you.

## What actually helps

**Multilingual recognition in one pass.** Models that transcribe mixed speech without choosing a language first. This is the single highest-impact decision and it is made at the architecture stage, not tuned in later.

**Testing on your own recordings.** Accent range across India is enormous, and a system tuned on one region can degrade noticeably in another. Vendor sample audio is clean, studio-recorded, and tells you almost nothing about how the system behaves on your customers over a mobile network.

**Confirmation of anything consequential.** Reading the booked slot back — "so that's tomorrow, 11am, correct?" — costs three seconds and catches the errors that would otherwise become missed appointments. On a bounded task this matters more than a marginal accuracy improvement.

**Your actual vocabulary.** Indian names, place names, your product names, and numbers spoken the local way ("do hazaar paanch sau") are where generic systems lose accuracy fastest.

## The commercial argument

It is tempting to treat this as an edge case and default to English. For most Indian businesses that reverses the logic — the callers excluded by an English-only system are frequently the ones a competitor will happily take a call from.

A voice system that cannot handle code-switching is not a slightly worse version of one that can. For a large share of your callers it simply does not work, and they will not tell you why they hung up.

## What to ask a vendor

- Which recognition model, and is it multilingual in a single pass?
- Can we hear it run against ten of our own recorded calls before we commit?
- What does it do when confidence is low — guess, or confirm?
- What is the measured outcome accuracy on mixed-language calls, not the word error rate on clean English?

The fourth question is the one that separates people who have deployed this in India from people who have read about it.`,
    faq: [
      {
        q: "Should we just ask callers to press 1 for English?",
        a: "It works, but it adds friction to every call to compensate for a limitation, and it does not help the caller who switches languages regardless of what they pressed. It is a workaround, not a solution.",
      },
      {
        q: "Is this a solved problem now that models are better?",
        a: "It is much better than it was and it is not solved. General multilingual capability has improved considerably; performance on compressed phone audio, in a specific regional accent, with your product names in it, still has to be tested rather than assumed.",
      },
      {
        q: "How many recordings do we need to test properly?",
        a: "Ten to twenty real calls will expose most problems, particularly if you deliberately include the accents and the noisy lines you would rather not think about. Testing on your easiest calls tells you nothing useful.",
      },
    ],
  },

  {
    slug: "dpdp-act-ai-systems-what-to-check",
    title: "The DPDP Act and AI systems: what to check before you sign",
    publishedAt: "2026-08-22",
    tags: "DPDP, compliance, India",
    excerpt:
      "India's data protection law changes how an AI project should be structured. Here is the short list of things to settle before anything is connected.",
    directAnswer:
      "Under the DPDP Act you remain the Data Fiduciary for your customers' data and your vendor is a Data Processor acting on your instructions. Responsibility does not transfer with the work, so purpose, retention, data location and sub-processors need to be written into the contract before a system is built, not after.",
    body: `This is a practical checklist, not legal advice. Take advice on your own situation — but take it with these questions already answered, because they are the ones that change how a system is built.

## The one thing to understand

Responsibility does not transfer. You decide why customer data is collected, which makes you the Data Fiduciary. Your vendor processes it on your instructions, which makes them a Data Processor. If they mishandle it, your obligation to your customer is unchanged.

That single fact is why the questions below belong in a contract rather than in a conversation.

## Before anything is connected

**What is the stated purpose?** Data collected to book an appointment is for booking appointments. Reusing it for marketing later is a different purpose needing its own basis. Write the purpose down; it constrains the build.

**What is the retention period?** "Indefinitely" is not an answer. Call recordings in particular accumulate quietly. Decide a window, disclose it, and make sure deletion actually happens rather than being a policy nobody implemented.

**Where does the data physically sit?** Not "the cloud". A region. If any component runs outside India, that should be a decision you made knowingly and recorded, not something discovered during an audit.

**Who are the sub-processors?** Every AI system has several — the model provider, the telephony provider, the hosting provider, possibly a transcription service. You are entitled to a list. A vendor who cannot produce one does not know where your data goes.

**How is a customer request serviced?** Someone will ask what you hold about them, or ask you to delete it. If their data is scattered across a vendor's systems with no retrieval path, that request becomes very hard and the deadline does not move.

**What does consent look like in practice?** Callers should be told they are speaking to an automated system and that the call is recorded. This is both the legal position and the practical one — expectations set correctly reduce complaints.

## The claim to be suspicious of

**There is no DPDP certification.** The Act provides no certification scheme. A vendor advertising themselves as "DPDP certified" is describing something that does not exist, and it is worth pausing on what else they may be describing loosely.

What a vendor can legitimately offer is concrete: contract to the obligations, name the sub-processors, state where data sits, support you when a customer exercises a right, and delete on exit with confirmation in writing.

## Why this is worth doing before the build

Every item above changes architecture. Data residency decides which model you can use. Retention decides how storage is designed. Deletion on request decides whether records are structured to be findable.

Retrofitting any of it is expensive, and retrofitting all of it usually means building again. An hour spent on this list before the proposal is signed is the cheapest hour in the project.`,
    faq: [
      {
        q: "Does this apply to a small business?",
        a: "The obligations scale with what you process rather than switching on at a headcount. A small business handling health or financial information has more to think about than a larger one handling very little personal data.",
      },
      {
        q: "Can we use AI models hosted outside India?",
        a: "Generally yes, subject to the restrictions in force. The point is not that offshore is prohibited — it is that it should be a decision you made deliberately and can explain, rather than a default nobody examined.",
      },
      {
        q: "What should the contract actually say?",
        a: "At minimum: that the vendor processes only on your instructions and for the stated purpose, the retention period, the sub-processor list and notice of changes to it, the data location, support for data principal requests, and deletion with written confirmation on exit.",
      },
    ],
  },

  {
    slug: "how-to-choose-the-first-process-to-automate",
    title: "How to choose the first process to automate",
    publishedAt: "2026-08-26",
    tags: "automation, pilots, process",
    excerpt:
      "The first automation decides whether there is a second one. Choosing it on enthusiasm rather than on volume is why most programmes stall.",
    directAnswer:
      "Pick the process with the highest frequency, the least judgement and the clearest owner — not the one that is most annoying. The first automation has to prove the approach to people who are sceptical, which means it needs to be visible, quick to build, and hard to argue with once it is running.",
    body: `Most automation programmes do not fail on technology. They stall after the first project, because the first project was chosen badly.

## The four questions, in order

**How often does it run?** Frequency is the whole economic argument. A process that runs fifty times a day repays a week of work almost immediately. One that runs quarterly will not repay it this year, however irritating it is.

**How much judgement does it need?** Little judgement means conventional automation — cheap, fast, predictable. Substantial judgement means an AI step, which is more capable and less certain. For a first project, prefer less judgement. You are proving the approach, not its ceiling.

**Who owns it?** A process with an owner has someone who can say what "correct" looks like and confirm it is working. A process owned by everyone has nobody to sign it off, and it will drift for weeks in review.

**What does it cost when it goes wrong?** Low is better for a first project. Not because errors are acceptable, but because a first project should not be the one where the organisation discovers its tolerance for failure.

## What people choose instead, and why it goes wrong

**The most annoying process.** Usually annoying precisely because it is complicated and full of exceptions — the worst possible first build.

**The most impressive-sounding one.** Long, visible, and by the time it ships everyone has stopped paying attention.

**The one the enthusiastic person wants.** Sometimes right. Worth checking against the four questions rather than against their enthusiasm.

## The shape of a good first project

- Runs many times a day
- Currently done by a person moving data between two systems
- Has an owner who can define "correct" in a sentence
- Is visible enough that people notice when it stops being done manually
- Can be built and proven in days

That last point matters more than it looks. A first project measured in months loses the attention it needs to be adopted.

## Map it before you build it

Sit with the person who does the process and watch them do it. Not a description of it — the actual thing.

This step reliably produces two findings. First, the process is not what the documentation says. Second, some steps exist because of a system that was replaced years ago and can simply be deleted.

Deleting a step is the cheapest automation available, and it is free. Do that before writing anything.

## How to tell whether it worked

Decide the measure before you start, and make it something you were already tracking. Time from enquiry to first response. Number of records re-keyed by hand. Hours a week on a specific task.

A pilot that ends in "it feels faster" has not proved anything, and the second project will be as hard to get agreed as the first one was.`,
    faq: [
      {
        q: "How long should a first automation take?",
        a: "Days, not months. If the shortest useful version of the first project is measured in months, the scope is wrong — find the narrower piece inside it that can stand alone.",
      },
      {
        q: "What if the process is done differently by different people?",
        a: "That is a finding, not an obstacle, and a common one. Automating forces the question of which way is correct — which is frequently worth more than the automation itself.",
      },
      {
        q: "Should we automate a broken process or fix it first?",
        a: "Fix it, or at least simplify it. Automation applied to a broken process gives you a broken process running faster, and it makes the underlying problem harder to see.",
      },
    ],
  },

  {
    slug: "what-an-ai-pilot-should-prove",
    title: "What an AI pilot should prove — and what it can't",
    publishedAt: "2026-08-29",
    tags: "pilots, buying, measurement",
    excerpt:
      "A pilot is not a small version of the real thing. It is an experiment with a question, and most pilots fail because nobody wrote the question down.",
    directAnswer:
      "A pilot should answer one question: does this move a number we already track, on our real data, within a fixed budget. It cannot prove that a system will scale, that staff will adopt it, or that the vendor is good to work with long-term — and treating it as though it did is how pilots turn into stalled projects.",
    body: `"We'll do a pilot" is often a way of deferring a decision rather than making one. A pilot that has not been designed to answer something specific will produce a demo, some enthusiasm, and no basis for the next decision.

## Write the question down first

One sentence, decided before anything is built. For example: *does automating first-response to inbound enquiries reduce our average response time from hours to minutes, on our real enquiry volume, within a fixed budget?*

That sentence sets the scope, the measure and the exit. Without it, a pilot ends with everyone describing a different outcome.

## Choose a measure you already track

This is the part most often skipped, and skipping it is fatal. If the measure is new, you have no baseline, and without a baseline the result is unfalsifiable — any number can be described as an improvement.

Good measures are boring and already in a system somewhere: time from enquiry to first response, number of records typed in by hand, hours a week on a named task, percentage of calls answered within thirty seconds.

## Agree the exit before you start

Both exits. What happens if it works, and what happens if it does not.

A pilot with no defined failure state does not fail — it lingers, gets extended, and quietly consumes the budget that should have funded the next attempt. Being able to stop cleanly is what makes a pilot low-risk, and it is worth more than any discount.

## What a pilot genuinely proves

- **Feasibility on your data.** Not on demo data. Yours, with its gaps and its inconsistencies.
- **Direction and rough size of the effect.** Whether the number moves, and whether it moves enough to matter.
- **What the work is actually like.** Whether the vendor asks good questions, whether they surface problems early or late.

## What it does not prove

- **That it scales.** Behaviour at ten times the volume is a different question, and a pilot deliberately avoids it.
- **That people will adopt it.** A pilot runs with attention on it. Adoption is tested when the attention moves elsewhere.
- **Long-term reliability.** Six weeks tells you nothing about what breaks in month eight when an upstream API changes.

Those are real risks. The answer is to name them as things the pilot does not cover, rather than to pretend it covered them.

## The failure mode nobody names

The pilot works, everyone is pleased, and nothing happens next — because no one agreed in advance who would own the system, whose budget would carry it, or what "in production" means here.

Decide that at the start, while it is an easy conversation. After a successful pilot it becomes a negotiation.`,
    faq: [
      {
        q: "How long should a pilot run?",
        a: "Long enough to see the measure move and to hit a normal bad week — often a few weeks rather than a few days. Running it only across a quiet period produces a flattering result you cannot rely on.",
      },
      {
        q: "Should a pilot be free?",
        a: "A free pilot tends to get the attention a free thing gets, on both sides. A small fixed price with a defined outcome and a clean exit is usually a better structure than free, for the buyer as much as the vendor.",
      },
      {
        q: "What if the pilot shows it does not work?",
        a: "That is a successful pilot. It answered the question for a fraction of the cost of finding out during a full build, and it usually reveals the adjacent problem that was worth solving instead.",
      },
    ],
  },

  {
    slug: "questions-to-ask-an-ai-agency",
    title: "Seven questions to ask an AI agency before you pay them",
    publishedAt: "2026-09-01",
    tags: "buying, vendors, due diligence",
    excerpt:
      "The AI services market is new enough that credentials are hard to read. These questions separate people who have shipped from people who have read.",
    directAnswer:
      "Ask what happens when the system is unsure, who owns the workflows, where the data sits, what it costs to run each month, and to see it working on your data rather than a demo. The answers separate vendors who have shipped systems from vendors who have read about them.",
    body: `This market is young, credentials are hard to interpret, and confident presentation is cheap. These are the questions that produce different answers from people who have actually deployed something.

## 1. What does the system do when it is not sure?

The single most revealing question.

A vendor who has shipped will answer immediately and in detail: confidence thresholds, what triggers a handover, what the customer experiences. A vendor who has not will describe how accurate it is — which is an answer to a different question.

Every system is uncertain sometimes. What it does then determines whether it is safe to put in front of customers.

## 2. Who owns what you build?

Ask specifically about the workflow definitions, the prompts and the integration configuration, and what you receive if the relationship ends.

If the answer involves a proprietary platform you cannot export from, you are renting rather than buying, and the price of leaving grows every month. Not automatically wrong, but it should be priced in knowingly.

## 3. Where does the data sit, and who else touches it?

Ask for the sub-processor list — the model provider, telephony, hosting, transcription. A vendor who cannot produce one does not know where your customers' data goes.

If any component sits outside India, that should be stated in the proposal rather than discovered later. See the DPDP checklist for why this belongs in the contract.

## 4. What does it cost to run each month?

Build cost is the number in the proposal. Running cost is the number you live with — model usage, telephony minutes, hosting, monitoring.

A vendor who has operated systems knows these figures and will give you a range. A vendor who has only built demos usually has not thought about it, and the answer arrives as a surprise in month two.

## 5. Can we see it working on our data?

Not a demo. Your enquiries, your recordings, your documents, with their gaps and inconsistencies.

Demos are built on clean data by definition. The gap between demo and production is almost entirely a data-quality gap, and the only way to size it is to try.

## 6. What will you tell us we should not automate?

A useful vendor has an answer. Sometimes the honest recommendation is that a process is too variable, too low-volume, or too consequential to hand over yet.

A vendor for whom everything is a fit is selling capacity, not judgement, and you will find the limit yourself later.

## 7. Who actually does the work?

Ask whether the person scoping the system is the person building it, and who you speak to in month six.

In small engagements the answer should be short. A long chain between you and the person doing the work is where context is lost, and context is most of the value in this kind of project.

## What good answers have in common

They are specific, they concede limitations, and they arrive quickly because the person has met the problem before. Vague, uniformly positive answers are the signal — not because the vendor is dishonest, but because they have not yet run into the parts that are hard.`,
    faq: [
      {
        q: "Should we expect case studies from a new agency?",
        a: "You should expect proof, which is not the same thing. A new agency can show you the system running on your own data, which is arguably stronger evidence than a case study about somebody else's business.",
      },
      {
        q: "How do we compare quotes that are structured differently?",
        a: "Reduce each to build cost, monthly running cost, and what you own at the end. Those three make otherwise incomparable proposals comparable, and the third is the one most often left vague.",
      },
      {
        q: "Is it a problem if a vendor uses off-the-shelf tools?",
        a: "Usually the opposite. Standard tooling means the work is portable, hiring for it is possible, and you are not dependent on one team's private framework. Custom code should be justified by a need, not by preference.",
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
let inserted = 0;
let updated = 0;

for (const [i, p] of POSTS.entries()) {
  const [rows] = await conn.query("SELECT id FROM insights WHERE slug = ?", [p.slug]);
  const values = [
    p.title,
    p.excerpt,
    p.directAnswer,
    p.body,
    JSON.stringify(p.faq ?? []),
    p.tags ?? null,
    "Ashutosh Tiwari",
    new Date(p.publishedAt),
    i,
    1,
  ];
  if (rows.length) {
    await conn.query(
      `UPDATE insights SET title=?, excerpt=?, direct_answer=?, body=?, faq=?, tags=?,
       author_name=?, published_at=?, sort_order=?, published=? WHERE slug=?`,
      [...values, p.slug],
    );
    updated++;
  } else {
    await conn.query(
      `INSERT INTO insights
       (slug, title, excerpt, direct_answer, body, faq, tags, author_name, published_at, sort_order, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      // updated_at = published_at on insert. Letting it default to now would
      // print "Updated today" on a post that was never updated, which is a
      // small lie the byline makes on every article.
      [p.slug, ...values, new Date(p.publishedAt)],
    );
    inserted++;
  }
}

const [[n]] = await conn.query("SELECT COUNT(*) AS n FROM insights WHERE published = 1");
const [[w]] = await conn.query("SELECT SUM(CHAR_LENGTH(body)) AS c FROM insights");
console.log(`insights: ${inserted} inserted, ${updated} updated — ${n.n} published, ~${Math.round(w.c / 6)} words`);
await conn.end();
