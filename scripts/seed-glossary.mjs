/**
 * Seeds the glossary. Idempotent — upserts on slug, so re-running updates
 * rather than duplicating.
 *
 *   npm run seed:glossary
 *
 * Editorial rules these entries follow, from docs/PLAN.md and docs/COPY.md:
 *   - The definition is ONE sentence and must survive being quoted alone.
 *     That is the whole point: it is what an AI assistant lifts.
 *   - Written for the person paying for the system, not the person building it.
 *   - Outcome-first language, never channel language.
 *   - No invented metrics, client names or claims about what Artors has done.
 *     Capability statements only, per docs/PLAN.md §2.
 */
import mysql from "mysql2/promise";

const TERMS = [
  {
    slug: "ai-agent",
    term: "AI agent",
    relatedService: "ai-agents",
    relatedTerms: "large-language-model,workflow-automation,conversational-ai",
    definition:
      "An AI agent is a software worker that is given a goal, decides for itself which steps to take, and uses tools like your CRM, calendar or email to complete the task without a person driving each step.",
    body: `The word "agent" gets used loosely, so it helps to be precise about what separates one from the automation you may already have.

A traditional automation follows a fixed path: when this happens, do that, then that. It cannot handle anything its author did not anticipate. An agent is given an objective and a set of tools, and works out the sequence itself. Ask it to qualify an enquiry and it can read the message, look the company up, decide the enquiry is out of scope, and close it — without a branch having been written for that case.

## What an agent actually consists of

Four parts, in practice:

- **A goal**, written as an instruction. "Qualify inbound enquiries against these criteria and book the ones that fit."
- **Tools** it is allowed to use — read the CRM, send an email, create a calendar event, look something up.
- **A model** doing the reasoning, deciding which tool to reach for next.
- **Guardrails**: what it must never do, when it must stop and ask a human.

The fourth is the one buyers underestimate and the one that decides whether an agent is safe to put in front of customers.

## Where agents fit, and where they do not

Agents earn their cost on work that is high-volume, judgement-light and currently done by a person copying between systems. Qualifying enquiries, chasing documents, triaging support, preparing a summary before a call.

They are a poor fit where the rules are genuinely fixed — if the task never varies, a plain automation is cheaper, faster and easier to debug. Reaching for an agent because the word is fashionable is the most common and most expensive mistake in this category.

## The honest trade-off

An agent's flexibility is the same property as its unpredictability. A system that can handle a case you did not foresee can also handle it wrongly. That is why serious deployments log every decision, keep a human in the loop for anything irreversible, and start on a narrow task before widening.`,
    faq: [
      {
        q: "What is the difference between an AI agent and a chatbot?",
        a: "A chatbot holds a conversation. An agent does work — it takes actions in other systems to complete a task. Many agents have no conversational interface at all; they run in the background against a queue of work.",
      },
      {
        q: "Do AI agents replace staff?",
        a: "In practice they absorb the repetitive portion of a role rather than the role. The realistic outcome is that the same team handles more volume, and spends its time on the parts that need a person.",
      },
      {
        q: "How long does it take to build one?",
        a: "A narrow, well-defined agent is usually a matter of days rather than months. What takes the time is not the build — it is agreeing the criteria it should apply and the cases where it must stop and ask.",
      },
    ],
  },
  {
    slug: "business-process-automation",
    term: "business process automation",
    relatedService: "business-process-automation",
    relatedTerms: "workflow-automation,ai-agent,n8n",
    definition:
      "Business process automation is the practice of handing an end-to-end business process — not a single task — to software, so that it runs on its own from trigger to finished outcome.",
    body: `The distinction that matters is between a task and a process. Automating a task saves someone a few minutes. Automating a process removes an entire handoff chain.

An invoice arriving by email is a task. An invoice arriving, being read, matched against a purchase order, queued for approval, paid, and recorded in the ledger — that is a process, and it usually crosses three or four systems and two or three people.

## How to tell whether a process is worth automating

Four questions, in this order:

1. **How often does it run?** Once a quarter is rarely worth it. Fifty times a day almost always is.
2. **How many systems does it touch?** Every handoff between systems is where time and accuracy are lost.
3. **How much judgement does it need?** Little judgement means conventional automation. Some judgement means an AI step inside the process.
4. **What does it cost when it goes wrong?** This sets how much checking to build in, and it is the question people skip.

## Where the value actually comes from

Rarely from the labour saved on any one run. It comes from three second-order effects: the process runs at a consistent speed regardless of who is in the office, errors from manual re-entry disappear, and the work becomes visible — because a system that runs a process also records it.

That last one surprises people. Most businesses cannot say how long their own quote-to-invoice cycle takes. After automation they can, and that measurement often changes the next decision more than the time saved did.

## What it does not fix

Automation applied to a broken process gives you a broken process running faster. If approvals sit for four days because nobody is sure who owns them, software will not resolve that ambiguity — it will encode it. Map the process honestly first; the mapping frequently reveals steps that should simply be deleted.`,
    faq: [
      {
        q: "How is this different from workflow automation?",
        a: "Workflow automation usually describes the tooling — the triggers and steps. Business process automation describes the scope: an entire process from beginning to end, which may involve several workflows plus AI steps and human approvals.",
      },
      {
        q: "Do we need to replace our existing software?",
        a: "Almost never. Automation generally sits between the systems you already run, connecting them through their APIs. Replacing a working CRM to enable automation is usually the more expensive path.",
      },
    ],
  },
  {
    slug: "conversational-ai",
    term: "conversational AI",
    relatedService: "conversational-ai",
    relatedTerms: "voice-ai,intent-recognition,large-language-model",
    definition:
      "Conversational AI is software that holds a useful back-and-forth with a person in natural language — by voice or chat — and, in a business setting, is judged on whether it completes the task rather than whether it sounds human.",
    body: `The test that matters is not fluency. Modern models are all fluent. The test is task completion: did the customer get the answer, get booked, get routed to the right person.

## Voice and chat are not the same product

They share a brain and almost nothing else.

| | Chat | Voice |
|---|---|---|
| Latency tolerance | A pause of two seconds is fine | Anything over about a second feels broken |
| Input quality | Clean text | Accents, phone-line compression, background noise |
| Correction | The user can scroll up and rephrase | The user talks over the system |
| Failure mode | Awkward | The caller hangs up |

A chat assistant that works well will not simply become a voice agent by adding speech. Voice is a materially harder engineering problem, and the difficulty is concentrated in latency and speech recognition rather than in the language model.

## What separates a deployment that works

Three things, consistently:

- **A defined scope.** Systems that try to answer everything answer nothing well. The ones that work handle a narrow set of intents completely and hand off cleanly on everything else.
- **A real escape hatch.** Every conversation needs a route to a human that the customer can trigger, and the system should offer it before the customer gets frustrated rather than after.
- **Grounding in your actual data.** A model answering from general knowledge will confidently invent your opening hours. Answers need to come from your systems.

## The Indian context

Most conversational AI is benchmarked on clean American English. Indian deployments deal with code-switching between Hindi and English inside a single sentence, a wide range of accents, and mobile-network audio. Systems that score well on standard benchmarks routinely underperform here, which is why testing on real recordings from your own customers matters more than any vendor benchmark.`,
    faq: [
      {
        q: "Will customers know they are talking to AI?",
        a: "They should. Telling callers at the start is both the honest choice and the practical one — expectations set correctly reduce frustration, and disclosure is increasingly expected by regulators.",
      },
      {
        q: "What happens when it cannot answer?",
        a: "It should hand over to a person with the conversation so far attached, so the customer does not repeat themselves. A system without a clean handover creates more work than it removes.",
      },
    ],
  },
  {
    slug: "voice-ai",
    term: "voice AI",
    relatedService: "conversational-ai",
    relatedTerms: "conversational-ai,hinglish-voice-ai,intent-recognition",
    definition:
      "Voice AI is a system that answers or places phone calls, understands the caller in real time, and completes an action such as booking, qualifying or routing — with the whole exchange happening fast enough to feel like a conversation.",
    body: `A voice agent is a pipeline, and every stage adds delay:

1. **Speech to text** — turning audio into words as the caller speaks.
2. **Understanding** — working out what they want and what is missing.
3. **Action** — checking a calendar, writing to the CRM, looking up an order.
4. **Text to speech** — producing the reply as audio.

The budget for all four is roughly one second. Beyond that the caller starts talking over the system, and once people begin interrupting, the conversation degrades quickly.

## Why latency dominates every design decision

Almost every hard choice in a voice deployment is a latency trade-off. A larger model reasons better and answers slower. Checking live availability is more accurate than a cached copy and costs a network round trip. Confirming a detail back to the caller reduces errors and adds seconds.

Deployments that feel good are the ones where those trade-offs were made deliberately for a narrow task, not the ones with the most capable model.

## What voice is genuinely good at

Calls that follow a shape: appointment booking and rescheduling, order and delivery status, qualifying an enquiry, confirming attendance, first-line triage before a human takes over. Repetitive, bounded, and high enough in volume that the wait to reach a person is itself the problem.

## What it is not good at

Complaints, anything emotionally loaded, and anything where getting it wrong is expensive. A caller who is already annoyed does not want a machine, however capable. Those calls should reach a person as fast as possible — and a well-designed voice system helps by identifying them early and routing them, rather than by trying to handle them.`,
    faq: [
      {
        q: "Can a voice agent handle several calls at once?",
        a: "Yes, and that is usually the point. Concurrency is where voice pays back — the queue at 10am on a Monday stops existing rather than being processed faster.",
      },
      {
        q: "Does it work on ordinary phone lines?",
        a: "Yes. Phone audio is compressed and noisier than a laptop microphone, so recognition has to be tuned for it — which is exactly why testing on your own real call recordings matters more than a vendor demo.",
      },
    ],
  },
  {
    slug: "hinglish-voice-ai",
    term: "Hinglish voice AI",
    relatedService: "conversational-ai",
    relatedTerms: "voice-ai,conversational-ai,intent-recognition",
    definition:
      "Hinglish voice AI is a voice system built to handle the way Indians actually speak on the phone — switching between Hindi and English within a single sentence — rather than requiring the caller to pick one language and stay in it.",
    body: `Most speech systems assume a call has a language. Real Indian phone calls often do not. A caller says "haan, main kal aa sakta hoon, but morning slot chahiye" — and a system configured for Hindi or for English mishandles roughly half of it.

## Why the standard approach fails

Speech recognition models are trained per language. Configure the call as Hindi and the English words come back as noise or as wrong Hindi words. Configure it as English and the Hindi disappears. Language auto-detection helps only slightly, because it typically decides once per utterance while the switching happens mid-sentence.

The failure is rarely total, which makes it worse. The system catches enough to seem like it is working and then books the wrong slot.

## What actually helps

- **Multilingual recognition** that can transcribe both languages in one pass rather than choosing between them.
- **Testing on real recordings** from your own customers, not on clean studio audio. Accent range across India is enormous, and a system tuned on one region can degrade noticeably in another.
- **Confirmation of anything that matters.** Reading the booked slot back to the caller catches errors before they become a missed appointment.
- **Vocabulary that matches your business.** Indian names, place names, product names and numbers spoken in the local way are where generic systems lose accuracy fastest.

## Why this matters commercially

For most Indian businesses, forcing callers into English narrows the audience the system can serve, and the customers it excludes are frequently the ones a competitor will reach by phone. A voice system that cannot handle code-switching is not a smaller version of one that can — for a large share of callers it simply does not work.`,
    faq: [
      {
        q: "Do callers have to choose a language at the start?",
        a: "They should not have to. A menu asking for 1 or 2 is a workaround for a system that cannot handle mixed speech, and it adds friction to every call to compensate for a limitation.",
      },
      {
        q: "How do you know it works before going live?",
        a: "By testing against your own recorded calls rather than a vendor's sample audio. That is the only way to see how it behaves with your customers' accents, your product names and your phone lines.",
      },
    ],
  },
  {
    slug: "large-language-model",
    term: "large language model",
    relatedTerms: "ai-agent,rag,conversational-ai",
    definition:
      "A large language model is a system trained on very large amounts of text to predict what words should come next, which lets it write, summarise, classify and reason over language — but it knows nothing specific about your business unless you give it that information.",
    body: `The single most useful thing to understand about an LLM is that it produces plausible language, and plausibility is not the same as accuracy. Everything about deploying one safely follows from that.

## What it is genuinely good at

- **Understanding messy input.** Turning a rambling enquiry into structured fields is something rules-based software has always been poor at.
- **Summarising.** Long call, long thread, long document, short summary.
- **Classifying.** Routing, prioritising, tagging — often better than keyword rules, and far easier to change.
- **Drafting.** A first version a person edits.

## What it is not good at

- **Knowing facts about you.** It has never seen your price list. Asked for it, a poorly configured system will produce something that looks like a price list.
- **Arithmetic and precise counting.** Improving, still not the tool for a ledger.
- **Being deterministic.** The same input can produce different output. For anything requiring an identical answer every time, use ordinary code.

## The practical consequence

Serious business deployments do not ask a model to recall anything. They retrieve the relevant facts from a real source and give them to the model to work with, and they constrain the output to a shape that can be validated. The model handles language; the systems around it handle truth.

Judge a proposal on how it handles that boundary. A vendor who cannot explain where the facts come from is proposing something that will eventually invent one.`,
    faq: [
      {
        q: "Which model should we use?",
        a: "It matters far less than people expect, and it changes every few months. Design so the model can be swapped. The parts that determine whether a deployment works — grounding, guardrails, evaluation — are the same regardless.",
      },
      {
        q: "Will our data be used to train the model?",
        a: "It depends entirely on the provider and plan, and it is a question to settle in writing before anything is connected. Business tiers of the major providers generally do not train on submitted data, but that should be verified, not assumed.",
      },
    ],
  },
  {
    slug: "rag",
    term: "retrieval-augmented generation (RAG)",
    relatedTerms: "large-language-model,ai-agent,conversational-ai",
    definition:
      "Retrieval-augmented generation is the technique of looking up relevant information from your own documents or systems and handing it to an AI model as it answers, so the reply is grounded in your data rather than in the model's memory.",
    body: `RAG exists to solve one problem: a language model does not know your business, and when asked about it will produce something plausible instead of admitting that.

The mechanism is simple. Before answering, search a store of your own content for the passages most relevant to the question. Put those passages in front of the model along with the question. Ask it to answer using only what it has been given.

## Why it beats the alternatives

The other options are worse for most businesses. Fine-tuning a model on your documents is slower, more expensive, has to be redone whenever the documents change, and still does not reliably prevent invention. Putting every document into each request is impossible past a certain size and costly well before that.

RAG updates instantly — change the document, the next answer changes — and it can cite what it used, which turns an unverifiable answer into a checkable one.

## Where it goes wrong

Almost always in retrieval, not generation. If the search returns the wrong three passages, a perfect model gives a wrong answer confidently.

The common causes are unglamorous: documents chopped into chunks that split a table from its heading, outdated files nobody removed, and near-duplicate documents where the stale copy ranks higher. Most of the work in a RAG deployment is document hygiene, which is why an honest proposal spends more time on your content than on model choice.

## The question to ask

"When the system does not know, what does it say?" A good deployment says it does not know and offers a person. A bad one guesses, and you find out from a customer.`,
    faq: [
      {
        q: "How current can the answers be?",
        a: "As current as the source. Because retrieval happens at question time, updating the underlying document is enough — there is no retraining step and no waiting.",
      },
      {
        q: "Does our data leave our systems?",
        a: "The retrieved passages are sent to whichever model is generating the answer, so where that model runs, and what it retains, are the questions that matter. Both should be named in the proposal.",
      },
    ],
  },
  {
    slug: "intent-recognition",
    term: "intent recognition",
    relatedService: "conversational-ai",
    relatedTerms: "conversational-ai,voice-ai,large-language-model",
    definition:
      "Intent recognition is working out what a person actually wants from what they said, so that a wandering sentence like \"yeah I wanted to check about the thing tomorrow\" is correctly understood as a request to confirm an appointment.",
    body: `People do not state their business in a clean sentence. They begin mid-thought, change direction, bundle two requests together and leave the important detail until last. Intent recognition is the step that turns that into something a system can act on.

## Why the old approach struggled

Traditional systems matched keywords and phrases. Every new way of expressing the same request needed a new rule, and the rules multiplied until nobody could safely change them. Anything unanticipated fell through to a default that helped nobody.

Language models changed this substantially, because they generalise. "Cancel my booking", "I can't make it tomorrow" and "something's come up, need to move Thursday" all resolve to the same intent without three separate rules.

## Where it still gets hard

- **Multiple intents in one breath.** "Move my appointment and also do you deliver to Noida" is two requests. Systems that handle only the first quietly drop the second.
- **Missing detail.** The intent is clear, a required field is not. The system has to know what to ask for next, and ask once rather than interrogating.
- **Code-switching.** Mixed Hindi and English changes the input enough to affect accuracy, which is why it deserves testing in its own right.
- **Confidence.** Knowing that it does not know is more valuable than a marginal accuracy gain. A system that hands over when unsure beats one that guesses slightly more often.

## How to evaluate it

Not on a vendor's accuracy percentage. On a sample of your own real conversations, scored on whether the outcome was right — the booking made, the query routed correctly. Outcome accuracy is the only number that translates into anything commercial.`,
    faq: [
      {
        q: "How many intents does a system need?",
        a: "Fewer than most people expect. A small set covering the majority of contacts, handled completely, outperforms a long list handled shallowly. Start with what actually fills your inbox and phone line.",
      },
    ],
  },
  {
    slug: "workflow-automation",
    term: "workflow automation",
    relatedService: "business-process-automation",
    relatedTerms: "business-process-automation,n8n,ai-agent",
    definition:
      "Workflow automation is connecting your existing tools so that an event in one automatically causes the right actions in the others, replacing the copying and pasting a person currently does between them.",
    body: `A workflow is a trigger followed by steps. A form is submitted, so: create the CRM record, notify the owner, send the acknowledgement, add the follow-up task. No person in the middle.

It is the most immediately useful automation for most businesses because it needs no new software and no change to how anyone works — it removes the transfers between systems, which is where time and accuracy leak.

## What makes a workflow reliable

The difference between one that survives and one that quietly breaks is entirely in the unglamorous parts:

- **It knows when it failed.** An automation that fails silently is worse than no automation, because you stop checking.
- **It can be re-run.** Something will be down at some point. Recovery should be re-running the failed item, not reconstructing what happened.
- **It does not duplicate.** Retries happen; the same lead should not be created twice.
- **Someone can read it.** In six months, a person needs to be able to open it and see what it does.

## Where AI belongs inside one

Most steps should not use AI. Creating a record, sending an email and updating a field are deterministic and should stay that way — cheaper, faster and predictable.

AI belongs in the steps that were previously impossible to automate: reading an unstructured message, classifying and routing it, extracting fields from a document, drafting a reply for approval. The mistake is putting a model where an "if" would do — it costs more, runs slower and introduces variability into a step that had none.`,
    faq: [
      {
        q: "What happens when one of our tools changes its API?",
        a: "The workflow breaks, which is why failure alerting is not optional. Integrations do change. The question is whether you hear about it from a monitor or from a customer.",
      },
      {
        q: "Can we build these ourselves?",
        a: "Often yes, for simple ones — the tools are genuinely accessible. Where it gets harder is error handling, retries and change over time, which is where most self-built automations gradually stop being trusted.",
      },
    ],
  },
  {
    slug: "n8n",
    term: "n8n",
    relatedService: "business-process-automation",
    relatedTerms: "workflow-automation,business-process-automation,ai-agent",
    definition:
      "n8n is an open-source workflow automation tool that connects applications through a visual node editor, and which can be self-hosted on your own infrastructure — meaning the workflows and the data passing through them stay under your control.",
    body: `n8n sits alongside Zapier and Make in the workflow automation category. The characteristic that matters commercially is that it can be self-hosted.

## Why self-hosting is the deciding factor

With a hosted-only tool, every record moving through a workflow passes through the vendor's infrastructure. For a business handling patient information, financial detail or anything with a residency requirement, that is a question to answer before anything is built.

Self-hosted n8n runs on infrastructure you choose, in a region you choose. The workflow definitions are files you hold. That answers both the residency question and the exit question in one decision.

## What it is good at

- **Connecting things that were not designed to connect.** Standard integrations where they exist, HTTP requests where they do not.
- **Being inspected.** Each execution is visible step by step, with the data at each stage. When something breaks you can see exactly where.
- **Being handed over.** The workflow is a file. It can be exported, versioned and given to someone else to run.

## The honest limitations

It is a workflow engine, not an application platform. Complex logic becomes awkward to express and awkward to read, and past a certain point purpose-built code is clearer and cheaper to maintain. Self-hosting also means someone owns updates, backups and uptime — real work, not zero.

## Why it comes up in AI projects

Most useful AI systems are mostly not AI. They are a chain of ordinary steps with one or two model calls inside. A workflow tool gives that chain somewhere sensible to live, with the AI as a node rather than as the architecture.`,
    faq: [
      {
        q: "Do we own the workflows built in n8n?",
        a: "You should — that is much of the point of choosing it. Workflow definitions can be exported and handed over, so the work is portable to another team or brought in-house without a rebuild.",
      },
      {
        q: "Is self-hosting difficult?",
        a: "The initial setup is straightforward. The ongoing part — updates, backups, monitoring — is real but modest work, and it is the trade for keeping data and control in-house.",
      },
    ],
  },
  {
    slug: "dpdp-act",
    term: "the DPDP Act",
    relatedTerms: "rag,conversational-ai,voice-ai",
    definition:
      "The Digital Personal Data Protection Act, 2023 is India's data protection law, under which the business collecting customer data is the Data Fiduciary responsible for it, and any vendor processing that data on its behalf is a Data Processor acting only on its instructions.",
    body: `If you are deploying AI systems that touch customer data in India, the Act determines several things about how the project should be structured. This is a plain summary, not legal advice — take advice on your specific situation.

## The two roles

**You are the Data Fiduciary.** You decide why customer data is collected and what happens to it, and the responsibility sits with you.

**Your vendor is a Data Processor.** They act on your instructions, for your stated purpose, and for nothing else. That relationship should be in the contract rather than assumed.

The distinction matters because responsibility does not transfer. If a vendor mishandles data collected by you, it remains your obligation to the customer.

## What it means for an AI project

- **Purpose has to be specific.** Data collected to book an appointment is for booking appointments. Reusing it for marketing is a separate purpose needing its own basis.
- **Retention has to end.** "Indefinitely" is not a retention period. Call recordings in particular should have a stated window and actual deletion at the end of it.
- **Consent has to be informed.** Callers should be told they are speaking to an automated system and that the call is recorded.
- **Rights have to be serviceable.** A customer can ask what you hold and ask for it to be corrected or erased. If your data is scattered across a vendor's systems with no way to retrieve it, that request becomes very difficult.
- **Cross-border transfer is permitted but not unconditional.** Where a model or platform runs outside India, that should be a decision you made knowingly, not one discovered later.

## A note on certification

There is no DPDP certification. Any vendor claiming to be "DPDP certified" is describing something that does not exist. What a vendor can genuinely do is contract to the obligations, name the sub-processors involved, state where data sits, and support you when a customer exercises a right.`,
    faq: [
      {
        q: "Can we use AI models hosted outside India?",
        a: "Generally yes, subject to the restrictions in force, but it should be a deliberate decision recorded in the proposal. The point is that you know where data goes before it goes there.",
      },
      {
        q: "How long can we keep call recordings?",
        a: "As long as your stated purpose requires, and no longer. What matters is that a period is decided, written down, disclosed, and actually enforced by deletion rather than left to accumulate.",
      },
    ],
  },
  {
    slug: "lead-qualification",
    term: "lead qualification",
    relatedService: "ai-agents",
    relatedTerms: "ai-agent,conversational-ai,intent-recognition",
    definition:
      "Lead qualification is deciding which enquiries are worth your sales team's time and which are not, using criteria agreed in advance rather than whoever happens to pick up the phone.",
    body: `Every business qualifies leads. Most do it inconsistently, late, and without recording why — which is why it is one of the first processes worth systematising.

## What qualification actually requires

Criteria you can state. If nobody can write down what makes an enquiry worth pursuing, no system can apply it — and the inconsistency you have today is a symptom of that, not of the tooling.

Useful criteria are specific and checkable: budget range, timeline, geography, the problem they described, whether they can decide. Vague ones — "seems serious" — cannot be applied consistently by people either.

## Where automation genuinely helps

- **Speed.** Enquiries answered in minutes convert better than the same enquiries answered the next day. This is the least controversial finding in the field and the one most businesses still lose on.
- **Consistency.** The same criteria at 9am Monday and 7pm Saturday.
- **Coverage.** Every enquiry gets a response, including the ones arriving at 2am.
- **A record.** Why a lead was set aside becomes visible, which means the criteria themselves can be improved.

## The mistake to avoid

Optimising qualification to reject more. The purpose is to get the right enquiries to a person faster, not to filter aggressively. A system tuned to disqualify will discard good leads that described themselves badly — and you will never know, because disqualified leads do not complain.

Keep a human review of what was rejected, at least at the start. It is the only way to find out whether the criteria are right.`,
    faq: [
      {
        q: "Should AI qualify or should a person?",
        a: "A useful split is that the system gathers and the person decides. Collecting the facts, checking them and preparing a summary is well suited to automation; the judgement call to pursue is often better with a person, at least until the criteria have been proven.",
      },
      {
        q: "What about leads that do not fit the criteria?",
        a: "They should get a genuine answer, not silence. A clear, quick no is a better outcome for both sides than an enquiry that is never acknowledged, and it protects a reputation that referrals depend on.",
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

for (const [i, t] of TERMS.entries()) {
  const [rows] = await conn.query("SELECT id FROM glossary_terms WHERE slug = ?", [t.slug]);
  const values = [
    t.term,
    t.definition,
    t.body,
    JSON.stringify(t.faq ?? []),
    t.relatedTerms ?? null,
    t.relatedService ?? null,
    i,
    1,
  ];
  if (rows.length) {
    await conn.query(
      `UPDATE glossary_terms SET term=?, definition=?, body=?, faq=?, related_terms=?,
       related_service=?, sort_order=?, published=? WHERE slug=?`,
      [...values, t.slug],
    );
    updated++;
  } else {
    await conn.query(
      `INSERT INTO glossary_terms
       (slug, term, definition, body, faq, related_terms, related_service, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [t.slug, ...values],
    );
    inserted++;
  }
}

const [[n]] = await conn.query("SELECT COUNT(*) AS n FROM glossary_terms WHERE published = 1");
console.log(`glossary: ${inserted} inserted, ${updated} updated — ${n.n} published`);
await conn.end();
