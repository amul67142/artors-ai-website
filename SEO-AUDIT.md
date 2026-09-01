# SEO / GEO audit — artors.in

**Phase 0 completed:** 2026-08-27
**Auditor:** Claude Code, against the brief at `artors-claude-code-prompt.md`

This file is the gate the brief requires before Phase 1. It records what the repo
actually is, where that differs from the brief's assumptions, and what was done in
each phase.

---

## 1. What the repo actually is

| | |
|---|---|
| Framework | Next.js **16.3.0**, **App Router** |
| React | 19.2.8 |
| Styling | Tailwind v4 + CSS Modules, custom token system in `app/globals.css` |
| Motion | GSAP + `@gsap/react`, mounted once via `components/fx/PageFx.tsx` |
| Data | **Drizzle ORM + mysql2** against Hostinger **MariaDB 11.8.8** |
| Deployment | **Hostinger Node.js hosting** (Passenger), not Vercel. `artors.in` → `/home/u839308886/domains/artors.in/public_html` |
| Build | Passes. `npm run build` → compiled successfully, 30 routes |

### Route inventory

Two **separate root layouts** via route groups — this matters for anything global:

- `app/(site)/` — the public marketing site, wrapped in header/footer/lead-modal/GSAP
- `app/(admin)/` — the admin, deliberately inheriting none of that chrome

Public routes: `/`, `/about`, `/contact`, `/pricing`, `/security`, `/services`,
`/services/[slug]` (×7, SSG), `/industries`, `/industries/[slug]` (×6, SSG),
`/work`, `/work/[slug]` (SSG from the database).

---

## 2. Contradictions with the brief

**These are the reason Phase 2 has not started.** The brief asks to stop and raise
them before proceeding.

### 2.1 There is no Payload CMS — this is the big one

The brief infers Payload from `/api/media/...`. That inference is wrong. There is
no `payload` dependency and no Payload config. What exists is a **custom admin**
built into this app on 2026-08-26 (`docs/ADMIN.md`):

- Content lives in MySQL tables defined in `lib/db/schema.ts`
- Collections are described **once** in `lib/admin/collections.ts` (client-safe
  field specs) and mapped to tables + zod validation in `lib/admin/registry.ts`
- One generic editor, `components/admin/CollectionManager.tsx`, renders all of them
- Existing collections: **clients, caseStudies, testimonials, teamMembers**, plus
  `media`, `leads`, `login_attempts`

**Consequence for the brief:** every instruction of the form *"pull from CMS
fields"*, *"add a CMS field if absent"*, *"create CMS collections"* translates to a
different, heavier job here — a Drizzle schema change, a generated SQL migration
applied to the live database, a spec entry, and zod validation. That is very
doable, and the registry pattern was built for exactly this, but it is not a
Payload config edit and should not be estimated like one.

`/api/media/[key]` is our own file-serving route (`lib/storage/index.ts`), which
exists because Hostinger scans `public/` at build time so uploads written there
after a build are invisible.

### 2.2 Work already delivered that the brief asks for

Done on 2026-08-26/27, before this brief arrived:

- **1.9 Footer trust signals** — done. `lib/content/company.ts` holds legal entity,
  address, phone, WhatsApp, LinkedIn, GSTIN, CIN; footer and `/contact` render each
  line **only when non-empty**, exactly as the brief requires. Most values are still
  blank pending Vedansh.
- **2.9 Team collection** — done. `teamMembers` exists and `/about` renders from it.
  **Ashutosh Tiwari (Director, founder) is live in it**, so the brief's claim that
  his bio is on `/about` is correct, and no migration is needed.
- **Security page** — a page already exists at **`/security`**, not
  `/security-and-data`, and it is **written**, not placeholdered. See §2.4.

### 2.3 Pricing: `offers` schema cannot be populated

The brief's structured-data table says *`Service` … `offers` where a "from ₹" price
exists*. On **2026-08-27, at Vedansh's explicit instruction, all published prices
were removed** from `/pricing`; every practice now routes to a consultation call.
`lib/content/pricing.ts` and `docs/PLAN.md` §2.4 both record this as a deliberate
reversal.

So `Service` schema will be emitted **without `offers`**. Adding one would mean
inventing a price, which §5 of the brief forbids.

### 2.4 The security page conflicts with the brief

The brief (2.8) wants `/security-and-data` with content marked `[Artors to supply]`
and says *"do not write legal claims"*.

But on 2026-08-27 Vedansh explicitly asked for this page and it was **written and
shipped** at `/security`, with substantive content: data residency (Mumbai —
verified from the host, not assumed), DPDP Act posture as Data Processor, recording
retention, access, exit terms. It deliberately claims **no certification**, because
no DPDP certification scheme exists.

**Unresolved — needs a decision.** Options: keep `/security` as written; rename to
`/security-and-data` with a 301; or strip it back to placeholders. Nothing was
changed either way.

### 2.5 Case studies already have a home

The brief (2.6) asks for `/case-studies/[slug]`. A `caseStudies` collection and
`/work/[slug]` template already exist, and `docs/PLAN.md` §2.1 deliberately put them
under `/work` so that *"real case studies drop into the same URL without a
redesign"*. Building `/case-studies/*` as well would create two URLs for one thing —
bad for exactly the SEO this brief is trying to improve.

**Unresolved.** Recommend keeping `/work/[slug]` and dropping 2.6, or moving to
`/case-studies/[slug]` with a redirect from `/work/[slug]`.

### 2.6 Things the brief assumes exist that do not

- No `robots.txt`, no `sitemap.xml`, no JSON-LD anywhere, no `metadataBase`, **no
  canonical URLs on any route**.
- **No global `not-found.tsx`.** Unknown slugs *do* return a correct 404 status
  (verified), but render Next's default page with no navigation and no CTA.
- No GA4, no analytics of any kind, and no third-party trackers at all.

### 2.7 Deployment reality the brief should know

Hostinger's CDN honours Next's `s-maxage=31536000` on prerendered pages and has no
purge-on-deploy hook. On 2026-08-27 this served a three-day-old homepage referencing
deleted asset hashes and the site rendered unstyled. Fixed in `next.config.ts`
(HTML capped at 60s). **Relevant here:** `/sitemap.xml` and `/robots.txt` are
subject to the same caching, and the cache must be cleared after each deploy.

---

## 3. Baseline measurements

| Check | Result |
|---|---|
| `npm run build` | passes, 30 routes |
| SSR content — `/services/ai-agents` | **server-rendered.** `<h1>Custom AI Agents</h1>` and 17 `<p>` present in raw HTML. Not a Phase 1 blocker |
| SSR content — `/industries/healthcare` | **server-rendered.** `<h1>` and 16 `<p>` present in raw HTML |
| Unknown slug `/services/does-not-exist` | HTTP **404** ✓ |
| Unknown path `/nonsense-page` | HTTP **404** ✓ |
| Metadata coverage | present on every route except the homepage, which inherits from `app/(site)/layout.tsx` |
| Homepage `<title>` | **65 chars** — over the ≤60 target |
| Canonical / `metadataBase` | **absent everywhere** |
| Published content | clients 1, teamMembers 1, caseStudies 0, testimonials 0 |

### Lighthouse

**Not run.** No headless Chrome is available in this environment and the browser
pane here cannot composite frames, so any number produced would be fabricated. The
brief's ≥85 mobile target therefore cannot be verified from here — it needs a run
against `https://artors.in` from a real browser. Flagged rather than guessed.

---

## 4. Phase log

### Phase 0 — discovery (2026-08-27)

Done: repo mapped, build baseline recorded, SSR and 404 behaviour verified, this
file written. Contradictions in §2 raised for decision.

Skipped: Lighthouse (§3, no capable browser here).

### Phase 1 — technical foundation

*In progress. Items depending on the unresolved contradictions in §2 are not
started.*

---

## 5. Manual QA checklist for the client

To be completed as phases land.

- [ ] `https://artors.in/robots.txt` loads and names the sitemap
- [ ] `https://artors.in/sitemap.xml` loads and lists only published URLs
- [ ] Rich Results Test on `/`, one service page, one industry page — no errors
- [ ] Lighthouse mobile ≥ 85 on `/`, `/services/ai-agents`, `/industries/healthcare`
- [ ] Hostinger cache cleared after the deploy that carries these changes
