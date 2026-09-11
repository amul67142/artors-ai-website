# Eldeco presales agent — implementation plan

**Client:** Eldeco · **Delivered by:** Artors
**Stack:** n8n · Ringg AI · Cal.com · WhatsApp · Google Sheets
**Status:** planning · **Written:** 2026-09-11

---

## 1. What this is

A presales agent that answers Eldeco's inbound property enquiries within seconds,
qualifies them against Eldeco's own criteria, books site visits, and hands the
qualified ones to the right sales manager with the conversation attached.

The metric it is judged on is **site visits booked**, not calls made or messages
sent. Everything below is arranged around that.

## 2. The stack, and why it is the right call for a first engagement

Assembled tools rather than a custom build. That is the correct trade here:

- **Speed.** Days, not the three to four weeks a bespoke build needs.
- **Eldeco can see it.** An n8n canvas is a diagram their operations lead can read
  and point at. A repository is not.
- **Ringg AI carries the telephony compliance.** Outbound automated calling in
  India sits under TRAI's TCCCPR framework — DLT registration, DND scrubbing,
  consent records. A vendor that already operates there is worth more than any
  code, and it removes the single largest risk from Artors' side of the line.
- **Cal.com solves booking properly.** Real availability, real calendar invites,
  reschedules and reminders — rather than capturing "Thursday afternoon" as text
  and having a human chase it.
- **Nothing to host, nothing to keep up at 2am** beyond n8n itself.

| Piece | Job |
|---|---|
| **n8n** | The spine. Every lead, every routing decision, every handoff |
| **Ringg AI** | Voice: answers and places calls, in Hindi, English and Hinglish |
| **WhatsApp** | Follow-ups, confirmations, reminders |
| **Cal.com** | Site-visit slots, invites, reminders, reschedules |
| **Google Sheets** | Lead log and the sales team's working view |

## 3. The flow

```
Portal / Meta ad / website
          │
          ▼
      ┌────────┐   new lead
      │  n8n   │───────────────► Google Sheets   (logged immediately, before anything else)
      └───┬────┘
          │ within 60 seconds
          ▼
   ┌─────────────┐   no answer   ┌──────────────────┐
   │  Ringg AI   │──────────────►│ WhatsApp follow- │
   │  calls      │               │ up (template)    │
   └──────┬──────┘               └──────────────────┘
          │ qualified
          ▼
   ┌─────────────┐
   │  Cal.com    │  site visit booked → invite to buyer + sales manager
   └──────┬──────┘
          │
          ▼
   Sheet row updated · sales manager notified on WhatsApp
```

**Speed-to-lead is the entire value proposition.** Under a minute beats an hour by
a margin that is not close, and it is the number to put in front of Eldeco.

## 4. The two things that will actually bite

### Google Sheets will not survive success

It is right for the pilot: Eldeco's team already lives in spreadsheets, it needs no
training, and it makes the agent's work visible from day one. That visibility is
worth a lot in the first month.

It breaks on: concurrent writes from parallel n8n runs, no real querying once there
are thousands of rows, no audit trail, and API quotas under burst.

**Plan the exit now rather than discovering it.** Past roughly 2,000 leads or the
moment two people edit at once, move the store to Airtable or Postgres and keep a
Sheet as a *view*. Cheap if designed for; painful if retrofitted. Say this to
Eldeco up front — it reads as competence, not as a caveat.

### WhatsApp rules do not change with the stack

Whatever sends the messages, Meta's rules apply:

- A **WhatsApp Business API** number is required — and it **cannot be a number
  already on the consumer WhatsApp app.** This is the detail that ambushes clients
  late; raise it in the first call.
- **24-hour window:** free-form only within 24 hours of the lead's last message.
  Outside it, **pre-approved templates only.**
- Templates need Meta approval — days, not hours.

So the follow-up templates get written at the start, alongside the agent, not after
it. Check whether Ringg AI resells WhatsApp; if so that is one vendor instead of two
and one approval path instead of two.

## 5. The compliance guardrail — RERA

The rule the Artors site already runs on, in its Eldeco shape: **never let the
model invent the thing that carries liability.**

In Indian real estate that is **price, possession date, inventory and approvals**.
An agent improvising a handover date creates exposure for Eldeco, under their name,
on a recorded channel.

- **Never state a price, payment plan or discount** that is not verbatim from
  Eldeco's approved list. No ranges, no "starting around".
- **Never state a possession date** except verbatim.
- **Never confirm unit availability.** Inventory moves hourly; the agent cannot see it.
- **Carry the RERA registration number** for any project discussed, as Eldeco's own
  advertising must.
- Anything outside the approved facts → **hand to a human**, never a guess.

This is harder on a no-code stack, not easier: the prompt lives in a vendor's text
box with no review and no tests. Two mitigations, both cheap:

1. Keep the approved facts in a **version-controlled document Artors owns**, and
   paste from it. Never edit the prompt freehand in the vendor UI.
2. Have Eldeco **sign the facts off in writing.** That sign-off protects Artors as
   much as it protects them.

## 6. Qualification rubric

The six fields Indian residential presales turns on:

| Field | Why |
|---|---|
| Budget band | The strongest disqualifier |
| Configuration | 2BHK / 3BHK / villa / commercial |
| Location or project | Routes to the right sales team |
| Timeline | Buying in 30 days vs just looking |
| Purpose | End-use vs investment — changes the whole pitch |
| Home loan needed | Triggers the finance desk |

**Qualified** = enough of these to be worth a salesperson's hour, at Eldeco's own
threshold. Let Eldeco set it; do not invent it.

## 7. Phases

### Phase 0 — Accounts and discovery (2–3 days, in parallel)
Start the WhatsApp Business API application on **day one** — it is the long pole.
Meanwhile collect from Eldeco: project list, approved facts per project (RERA
number, configurations, location, approved price positions, possession, amenities),
sales-team routing map, working hours, and their qualification threshold. **Ask for
their existing presales script** — it is the best input available and it already
reflects what works on their buyers.

### Phase 1 — Build the flow (3–4 days)
n8n workflow end to end. Ringg agent scripted and grounded in the approved facts.
Cal.com event types per project, mapped to the right sales managers. Sheet schema.
WhatsApp templates drafted and submitted.

### Phase 2 — Lead sources (2 days)
Portals (99acres, MagicBricks, Housing), Meta and Google lead forms, and Eldeco's
website into n8n. The Meta/Google → Pabbly → CRM patterns in
`D:\space trans\integrations` already solve most of this — reuse rather than rebuild.

### Phase 3 — Supervised pilot (5–7 days) — do not skip
**One project, calls recorded, every transcript read.** Eldeco's presales team
listens and marks each call good or bad.

Run it on **warm leads first, not the whole inbound firehose** — a mistake in front
of a live buyer is expensive and it is Eldeco's brand that pays. Go wide only when
their team says the calls sound like their own people.

### Phase 4 — Scale (ongoing)
Add projects one at a time. Weekly review of the misses — every fumbled question
becomes a new approved fact.

**Realistic total: 2–3 weeks**, gated by WhatsApp approval and Eldeco's content
sign-off, not by build time.

## 8. What Artors needs from Eldeco

In the order they block:

1. **WhatsApp Business API access** + a clean number not on consumer WhatsApp
2. **Approved facts per project, signed off** — price positions, possession, RERA
   numbers, amenities
3. **Sales-team routing map** — who gets which project's leads
4. **Qualification threshold** — what counts as worth a callback
5. Access to lead sources (portal accounts, ad accounts)
6. Their existing presales script and FAQ
7. Calendar access for the sales managers, for Cal.com

## 9. Open decisions

- **Voice-first or WhatsApp-first?** Ringg calling within 60 seconds converts
  hardest, but a call from an unknown number gets declined often. A WhatsApp message
  first, then a call, is gentler and usually lands better in this market. Worth
  testing both in the pilot rather than guessing.
- **Does Ringg AI cover WhatsApp too?** If yes, one vendor and one approval path.
- **Where does n8n run?** n8n Cloud is one less thing to operate; self-hosted is
  cheaper and keeps the data in Artors' control. For a client build, Cloud.
- **Language.** Hindi and Hinglish are realistic for this buyer and Ringg handles
  them — but it doubles the review effort in the pilot.

## 10. What this is worth to Artors beyond the fee

The Artors site has no case study, no testimonial and no client logo it can honestly
display. This engagement retires all three:

- The Eldeco logo moves from `integration` to `client` in the admin — the
  distinction that exists precisely so the claim is never made before it is true.
- Site visits booked is a measurable outcome, which is the only kind of case study
  worth publishing.
- A named testimonial from a developer of Eldeco's standing outweighs any copy on
  the site.

Ask for all three **when the numbers look good**, not at the end of the engagement.
