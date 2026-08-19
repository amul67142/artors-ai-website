# Artors — Website Implementation Plan

**Status:** approved, not yet built
**Last updated:** 2026-08-19

---

## 1. What Artors is

A full-service **AI agency** in Gurugram. It builds AI systems that improve a client's business
results — revenue added, cost removed, hours returned, decisions sharpened.

It is **not** a lead-qualification shop, not a chatbot vendor, and not tied to one sector. Real
estate is one industry among many, not the identity of the business.

**The through-line for the whole site:** we drive results for clients. Leads are one lever.
Cost, speed, capacity, content and decision-making are the others.

**Positioning (decided):** broad and outcome-led. Industry-agnostic. Industries appear on the
site as *illustrations of the work*, never as the definition of the business.

**Source of truth for copy:** `docs/COPY.md`.
**Source of truth for what we sell and for what price:** `docs/SERVICES.md` — internal.
**Source of truth for how it looks and moves:** `docs/DESIGN.md`.

### How the source documents were resolved

| | `artors-website-copy.pdf` | `AI_Agency_Services_Catalog.docx` |
|---|---|---|
| Frame | Missed calls and lead capture | 25 services across 8 categories |
| Scope | 5 verticals | Real-estate specialist |

Neither document is the site as written. The PDF has the right *voice* and the right structure
but too narrow a promise — it sells "never miss a lead" when Artors sells business results. The
DOCX has the right *breadth* but the wrong focus.

**Resolution:** keep the PDF's section architecture and tone, widen its promise from leads to
business outcomes, and publish six service pillars drawn from the DOCX's full range — including
the content/video and consulting/training work that an earlier draft of this plan wrongly held
back.

### The one strategic risk, stated plainly

"Any industry, every service, no case studies yet" is the hardest combination to make credible.
Breadth and newness push in the same direction — a visitor has nothing to anchor on.

The site compensates in three structural ways, not cosmetic ones:

1. **Outcomes are the spine, not services.** A visitor lands on a business result they recognise
   before they meet a single tool name.
2. **Proof is demonstrable rather than claimed** (§2) — the product can be shown working, which
   is a luxury most new agencies don't have.
3. **Depth is shown in one place, not claimed everywhere.** One worked example carried all the
   way through beats six shallow ones.

---

## 2. The core constraint: no case studies, no clients

Artors is new. There is no portfolio, no logo wall, no metrics. The site must build trust
without them, and must not fake them. **The placeholder testimonials in the copy PDF must never
ship.**

The advantage Artors has is that **its product is demonstrable**. A branding agency can't prove
itself without a portfolio; an AI agency can show the thing running.

### Trust layer (replaces the case-studies section)

1. **One worked example, carried end to end.** A complete build for a realistic scenario,
   published in full: the recording, the transcript, the qualification rubric, a screenshot of
   the actual n8n flow, and the result it produces. Specificity is what reads as competence.
   This is the `/work` page.
   *Designed so a live callable number — and later, real case studies — drop into the same slots
   without a redesign. `/work` becomes the case-studies page the day there are any.*
2. **The site runs on its own systems.** The chat, the call-back and the booking on this site
   are the systems Artors sells. Case study zero.
3. **Named humans, real place.** Founder photo and name, Gurugram address, direct WhatsApp,
   company registration in the footer. An anonymous agency in this category reads as a scam.
4. **Risk reversal, made structural.** A scoped paid pilot — fixed price, one defined outcome,
   clean exit. No hidden pricing.
5. **Process depth as proof.** The four-step "How it works" names real tools and real timelines.
   Vagueness reads as inexperience.
6. **Integration marks, not client logos.** WhatsApp Business, Google Calendar, HubSpot, Zoho,
   Meta, n8n, OpenAI. Honest, and it fills the "trusted by" slot without lying.
7. **Own being new.** One short line beating the objection to the punch, paired with a
   response-time promise.

### Explicitly forbidden on this site

- Fabricated testimonials, client names, or logos
- Invented metrics ("500+ clients", "10,000 calls handled") — capability statements only until
  real numbers exist
- Stock-photo "teams"

---

## 3. Stack

Next.js 16.3 (App Router) · React 19 · TypeScript · Tailwind v4 · `next/font` (Inter,
self-hosted, weights 600/700 only).

**Deliberately excluded:** three.js, react-three-fiber, ogl, framer-motion, GSAP.

The entire motion system in `docs/DESIGN.md` is CSS transitions plus one IntersectionObserver —
roughly 1 KB of JavaScript rather than ~120 KB of animation library. Performance is a hard
requirement, and the cheapest way to honour it is to not ship the weight at all. GSAP is
reconsidered only if a specific pinned-scroll section earns it, never for fade-ins.

**Rules that follow:**

- No always-on `requestAnimationFrame` loops. Continuous motion is CSS, paused off-screen.
- Every motion rule has a `prefers-reduced-motion: reduce` counterpart.
- Images through `next/image`, explicit dimensions, no layout shift.
- Server Components by default; `"use client"` only for the reveal observer, nav, accordion,
  counter and form.

---

## 4. Site map

```
/                        Home
/services                The six pillars
/services/[slug]         x6   ai-automation · voice-agents · chatbots ·
                              marketing-growth · content-video · consulting-training
/industries              Grid + the industry-agnostic statement
/industries/[slug]       x6   real-estate · healthcare · retail-d2c ·
                              education · hospitality-local · professional-services
/work                    Proof. Worked examples now, case studies later — same URL.
/pricing                 Pilot-first framing, indicative bands
/about                   Founder, location, why — the trust page
/contact                 Form + WhatsApp + booking
/privacy  /terms
```

Twelve service and industry pages exist from launch. They are the long-tail SEO surface, and
they cost almost nothing once the page template exists — all twelve are generated from a single
typed content file so every word stays editable in one place.

Industry pages are framed as *"here's what this looks like in your sector"*, never as *"we only
serve these sectors"*. The `/industries` index carries an explicit line for everyone else.

---

## 5. Phases

### Phase 0 — Foundation

- Design tokens as CSS custom properties: ink, paper, accent, accent gradient, the full type
  scale at three breakpoints, motion easings and durations
- `<Button>` — the exact 0.4 s label roll and diagonal arrow swap from `docs/DESIGN.md`
- `<Reveal>` — IntersectionObserver wrapper, 90 ms stagger, unobserves after firing
- Header (sticky, hides on scroll down) and footer
- `prefers-reduced-motion` honoured globally

### Phase 1 — Home

All sections from `docs/COPY.md`, with the trust layer of §2 in place of the placeholder proof.

### Phase 2 — Depth

Six service pages and six industry pages from the shared content file and page template.

### Phase 3 — Conversion

- Lead form → serverless route → **email + WhatsApp notification**, behind a small adapter
  (`lib/leads/`) so MySQL or a CRM can be added later without touching the form
- Booking embed, WhatsApp deep link
- `/work` — recording, transcript, workflow screenshot
- Honeypot + rate limiting

### Phase 4 — Launch

- Metadata and JSON-LD: `Organization`, `Service`, `FAQPage`. The FAQ schema matters for AI
  search visibility, which the copy document flags as a goal.
- `sitemap.ts`, `robots.ts`, OG images
- Lighthouse pass, real-device check
- Deploy

---

## 6. Motion inventory

Small, deliberate, all CSS-driven. Full specifications in `docs/DESIGN.md`.

| | Where |
|---|---|
| Button label roll + diagonal arrow swap | Every CTA |
| Scroll reveal, 90 ms stagger | Section entrances |
| Marquee, 34 s, pauses on hover | Integrations strip |
| Gradient sweep | H1 only |
| Count-up, fires once | Results bar |
| Sticky nav, hides on scroll down | Header |
| Accordion via `grid-template-rows` | FAQ |
| Border to blue, 2 px lift | Card hover |
| Line draws down on scroll | Process steps |

**No glow effects. No pointer parallax. No particles.**

---

## 7. Open items

- [ ] Real phone number for a live voice demo (upgrades `/work` from recorded to live)
- [ ] Founder photo, name, and bio for `/about`
- [ ] Gurugram office address and company registration for the footer
- [ ] WhatsApp business number
- [ ] Booking tool — Cal.com or Calendly
- [ ] Notification email address for form submissions
- [ ] Domain and hosting
