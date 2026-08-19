# Artors — Website Implementation Plan

**Status:** approved, not yet built
**Last updated:** 2026-08-19

---

## 1. What Artors is

An AI automation agency based in Gurugram, serving businesses across India. It sells
**outcomes** — booked appointments, qualified leads, calls answered, hours saved — not
software, not "AI".

**Positioning (decided):** general AI automation for local business, with five industry
landing pages doing the long-tail SEO work. Not a real-estate-only specialist.

**Source of truth for copy:** `docs/COPY.md` (from `artors-website-copy.pdf`).
**Source of truth for what we sell and for what price:** `docs/SERVICES.md` (from
`AI_Agency_Services_Catalog.docx`) — internal reference, most of it never appears on the site.
**Source of truth for how it looks and moves:** `docs/DESIGN.md`.

### The two source documents disagree — how it was resolved

| | `artors-website-copy.pdf` | `AI_Agency_Services_Catalog.docx` |
|---|---|---|
| Positioning | General local business, Gurugram | Real-estate specialist |
| Services | 5 groups, outcome-framed | 25 services, 8 categories, with ₹ pricing |
| Verticals | Clinics, real estate, salons, coaching, D2C | Real estate only |

The PDF is the website. The DOCX is the sales menu behind it. We publish **five** service
pages, not twenty-five — the catalog's own closing line says the same thing: better five
done well than twenty-five done badly.

---

## 2. The core constraint: no case studies, no clients

Artors is new. There is no portfolio, no logo wall, no metrics. The site has to build trust
without them, and it must not fake them. **The placeholder testimonials in the copy PDF must
never ship as written.**

The advantage Artors has over most new agencies is that **its product is demonstrable**. A
branding agency can't prove itself without a portfolio; an AI automation agency can just show
the thing running. The trust architecture is built on that.

### Trust layer (replaces the case-studies section)

1. **Sample call — recording, full transcript, and the workflow behind it.** One complete
   worked example (a fictional clinic), published end to end: the audio, the transcript, the
   qualification rubric, a screenshot of the actual n8n flow. Specificity is what reads as
   competence. This is the `/demo` page, and it is the single most important page after home.
   *Designed so a live callable number drops into the same slot later without a redesign.*
2. **The site runs on its own systems.** Say it plainly: the chat, the call-back and the
   booking on this site are the systems we sell. Case study zero.
3. **Named humans, real place.** Founder photo and name, Gurugram address, direct WhatsApp,
   company registration in the footer. An anonymous agency in this category reads as a scam.
4. **Risk reversal, made structural.** Section 9 of the copy already argues it; turn it into a
   visible, formal block — scoped paid pilot, fixed price, one defined outcome, clean exit. No
   hidden pricing.
5. **Process depth as proof.** The four-step "How it works" names real tools and real
   timelines. Vagueness reads as inexperience.
6. **Integration marks, not client logos.** WhatsApp Business, Google Calendar, HubSpot, Zoho,
   Meta, n8n. Honest, and it fills the "trusted by" slot without lying.
7. **Own being new.** One short line that beats the objection to the punch, paired with a
   response-time promise. Converts better than pretending otherwise.

### Explicitly forbidden on this site

- Fabricated testimonials, client names, or logos
- Invented metrics ("500+ clients", "10,000 calls handled") — the results bar uses only
  capability statements until real numbers exist
- Stock-photo "teams"

---

## 3. Stack

Next.js 16.3 (App Router) · React 19 · TypeScript · Tailwind v4 · `next/font` (Inter,
self-hosted, weights 600/700 only).

**Deliberately excluded:** three.js, react-three-fiber, ogl, framer-motion, GSAP.

The entire motion system specified in `docs/DESIGN.md` is CSS transitions plus one
IntersectionObserver — roughly 1 KB of JavaScript rather than ~120 KB of animation library.
Performance is a hard requirement, and the cheapest way to honour it is to not ship the weight
in the first place. GSAP gets reconsidered only if a specific pinned-scroll section earns it,
and never for fade-ins.

**Rules that follow from this:**
- No always-on `requestAnimationFrame` loops. Anything continuous is a CSS animation, and it
  is paused or unmounted when off-screen.
- Every motion rule has a `prefers-reduced-motion: reduce` counterpart.
- Images through `next/image`, explicit dimensions, no layout shift.
- Server Components by default; `"use client"` only for the reveal observer, the nav, the
  accordion, the counter, and the form.

---

## 4. Site map

```
/                        Home — the ten sections of docs/COPY.md + the trust layer
/services                Overview of the five service groups
/services/[slug]         ×5   voice-agents · chatbots · lead-generation ·
                              workflow-automation · crm-sales
/industries/[slug]       ×5   clinics · real-estate · salons · coaching · d2c
/demo                    Sample call: audio, transcript, workflow. The proof page.
/pricing                 Pilot-first framing, indicative bands
/about                   Founder, location, why — the trust page
/contact                 Form + WhatsApp + booking
/privacy  /terms
```

The ten service/industry pages exist from launch. The copy document is explicit that these
long-tail pages ("AI Receptionist for Clinics in Gurugram") are where Artors outranks the big
generalist agencies, and they cost almost nothing once the page template exists.

All ten are generated from a single typed content file so every word stays editable in one
place rather than scattered across ten JSX files.

---

## 5. Phases

### Phase 0 — Foundation
- Next scaffold, TypeScript, Tailwind v4, ESLint
- Design tokens as CSS custom properties: ink, paper, accent, accent gradient, the full type
  scale at three breakpoints, motion easings and durations
- `<Button>` — the exact 0.4 s label roll and diagonal arrow swap from `docs/DESIGN.md`
- `<Reveal>` — IntersectionObserver wrapper, 90 ms stagger, unobserves after firing
- Header (sticky, hides on scroll down) and footer
- `prefers-reduced-motion` honoured globally

### Phase 1 — Home
All ten sections from `docs/COPY.md`, verbatim, with the trust layer of §2 replacing the
placeholder testimonials of Section 8.

### Phase 2 — Depth
Five service pages and five industry pages from the shared content file and page template.

### Phase 3 — Conversion
- Lead form → serverless route → **email + WhatsApp notification**, written behind a small
  adapter (`lib/leads/`) so MySQL or a CRM can be added later without touching the form
- Booking embed, WhatsApp deep link
- `/demo` — recording, transcript, workflow screenshot
- Honeypot + rate limiting on the form

### Phase 4 — Launch
- Metadata and JSON-LD: `LocalBusiness`, `FAQPage`, `Service`. The FAQ schema matters for AI
  search visibility, which the copy document specifically flags as a goal.
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
| Border → blue, 2 px lift | Card hover |
| Line draws down on scroll | Process steps |

**No glow effects. No pointer parallax. No particles.**

---

## 7. Open items

- [ ] Real phone number for the live voice demo (upgrades `/demo` from recorded to live)
- [ ] Founder photo, name, and bio for `/about`
- [ ] Gurugram office address and company registration for the footer
- [ ] WhatsApp business number
- [ ] Booking tool — Cal.com or Calendly
- [ ] Notification email address for form submissions
- [ ] Domain and hosting
