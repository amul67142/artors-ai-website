# Eldeco presales agent — implementation plan

**Client:** Eldeco · **Delivered by:** Artors · **Runs on:** BigLead CRM
**Status:** planning · **Written:** 2026-09-11

---

## 1. What this is

A WhatsApp presales agent that answers Eldeco's inbound property enquiries within
seconds, qualifies them against Eldeco's own criteria, books site visits, and hands
the qualified ones to the right sales manager with the conversation attached.

The metric it is judged on is **site visits booked**, not messages sent. Everything
below is arranged around that.

## 2. The most important fact: this is assembly, not construction

BigLead already contains the agent. Verified in the repo:

| Already built | Where |
|---|---|
| Agent runtime, prompt, context, humanizer | `lib/ai/{agent,prompt,context,humanize,respond}.ts` |
| **`book_site_visit`** tool | `lib/ai/tools.ts` |
| `save_qualification`, `mark_qualified` | `lib/ai/tools.ts` |
| `request_callback`, `escalate_to_human`, `stop_messaging` | `lib/ai/tools.ts` |
| SHADOW / LIVE modes | `lib/ai/context.ts`, `respond.ts` |
| WhatsApp Cloud API send + template handling | `lib/integrations/whatsapp.ts`, `lib/automation/lead-whatsapp.ts` |
| Per-company connected number, `message_log` | same |
| Per-project messaging gates | `lib/automation/project-messaging.ts` |
| Admin UI: setup, knowledge, facts, qualification | `app/(app)/ai-agent/**` |

So the work is: **Eldeco's content, Eldeco's rules, Eldeco's WhatsApp number, and a
supervised go-live.** Not a new system.

## 3. The critical path — start this on day one

**Meta WhatsApp Business API approval is the long pole.** Nothing else matters if
this is not moving, because the agent cannot send a single message without it.

1. Eldeco's Meta Business Manager verified (needs their GST/CIN documents)
2. A phone number dedicated to the WABA — **it cannot be a number already on the
   WhatsApp consumer app**, and that surprises clients late if nobody says it early
3. Display name approval
4. Message templates submitted and approved

Realistically **3–10 working days**, mostly waiting on Meta and on Eldeco's
paperwork. Every other task below can run in parallel — so raise this in the first
call, not the second.

### The 24-hour window rule shapes the whole design

- A lead messages first → 24 hours of free-form conversation. This is where the
  agent does its actual work.
- Outside that window → **only pre-approved templates**. No improvised follow-ups.

So follow-ups must be template-based and written up front. Design the templates
with the agent, not after it.

## 4. The compliance guardrail — RERA

This is the Eldeco-specific version of the rule the Artors site already runs on:
*never let the model invent the thing that carries liability.*

In Indian real estate that thing is **price, possession date, inventory and
approvals**. An agent that improvises a price or a handover date creates exposure
for Eldeco, under their name, in writing, on a channel that keeps a permanent log.

Hard rules for the prompt:

- **Never state a price, a payment plan, or a discount** that is not a verbatim fact
  from Eldeco's approved list. No ranges, no "starting around", no inference.
- **Never state a possession date** except verbatim from the approved facts.
- **Never confirm unit availability.** Inventory moves hourly; the agent cannot see it.
- **Carry the RERA registration number** for any project it discusses, as Eldeco's
  own advertising must.
- Anything outside the approved facts → `escalate_to_human`, not a guess.

BigLead's `facts` module is the right home for these, because facts are quoted
rather than paraphrased. Whatever goes in there must be **signed off by Eldeco in
writing** — that sign-off is Artors' protection as much as theirs.

## 5. Qualification rubric

The six fields Indian residential presales actually turns on. These go into the
`qualification` module:

| Field | Why it matters |
|---|---|
| Budget band | The single strongest disqualifier |
| Configuration | 2BHK / 3BHK / villa / commercial |
| Preferred location or project | Routes to the right sales team |
| Timeline | Buying in 30 days vs "just looking" |
| Purpose | End-use vs investment — changes the entire pitch |
| Home loan needed | Triggers the finance desk |

**Qualified** = enough of the above to be worth a salesperson's hour, per Eldeco's
own threshold. Let Eldeco set that threshold; do not invent it.

## 6. Phases

### Phase 0 — Discovery (2–3 days, parallel with Meta)
Get from Eldeco: the project list, approved facts per project (RERA number, config,
location, approved price positions, possession, amenities), the sales-team routing
map, working hours, and their qualification threshold. Their existing presales
script is the best input available — ask for it.

### Phase 1 — Configure (3–4 days)
Eldeco as a company in BigLead. Projects loaded. Knowledge base + facts populated
from Phase 0. Qualification rubric set. Routing rules mapped to real sales managers.
Templates drafted and submitted to Meta.

### Phase 2 — Lead sources (2–3 days)
Wire the inbound: portals (99acres, MagicBricks, Housing), Meta and Google lead
forms, and Eldeco's website → BigLead. The Meta/Google → Pabbly → CRM pattern in
`D:\space trans\integrations` already covers most of this — reuse it rather than
rebuild.

**Speed-to-lead is the entire value proposition here.** Under a minute beats an
hour by a margin that is not close, and it is the number to put in front of Eldeco.

### Phase 3 — SHADOW run (5–7 days) — do not skip
SHADOW mode is already the default in the code, and it exists for exactly this.
The agent drafts replies against real incoming leads; **nothing is sent.** Eldeco's
presales team reads every draft and marks it good or bad.

What this buys: the misses get fixed on paper instead of in front of a buyer, and
Eldeco develops trust in the thing before it speaks for them. Go LIVE only when
Eldeco says the drafts read like their own team.

### Phase 4 — LIVE, supervised (ongoing)
Switch to LIVE on one project first, not the whole portfolio. Daily transcript
review for the first fortnight. Every question the agent fumbled becomes a new fact
or knowledge entry — the same loop `/admin/conversations` runs for Jessica.

**Realistic total: 3–4 weeks**, gated by Meta approval and Eldeco's content sign-off,
not by engineering.

## 7. What Artors needs from Eldeco

Blockers, in the order they block:

1. **Meta Business Manager access** + a clean phone number for the WABA
2. **Approved facts per project**, signed off — price positions, possession, RERA
   numbers, amenities
3. **Sales-team routing map** — who receives which project's leads
4. **Qualification threshold** — what Eldeco considers worth a callback
5. Access to their current lead sources (portal accounts, ad accounts)
6. Their existing presales script and FAQ, if one exists

## 8. Open decisions

Answer these before Phase 1; each changes the build.

- **Channel scope.** WhatsApp only, or WhatsApp + the website widget? The web
  engine is already productised (Jessica / Ask Astronaut) and would be a small
  addition.
- **Whose CRM is the destination?** Qualified leads into BigLead, or pushed onward
  into a system Eldeco already runs?
- **One project or the whole portfolio** at go-live? Recommend one.
- **Language.** English only, or Hindi and Hinglish? The latter is realistic for
  this buyer and the engine already handles it — but it doubles the review effort
  in SHADOW.

## 9. What this is worth to Artors beyond the fee

The Artors site currently has no case study, no testimonial and no client logo it
can honestly display. This engagement retires all three at once:

- The Eldeco logo moves from `integration` to `client` in the admin — the
  distinction that exists precisely so the claim is never made before it is true.
- Site-visits-booked is a measurable outcome, which is the only kind of case study
  worth publishing.
- A named testimonial from a developer of Eldeco's standing is worth more than any
  copy on the site.

Ask for all three **at the point the numbers look good**, not at the end of the
engagement.
