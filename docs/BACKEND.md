# Artors — Backend Design

**Status:** LIVE as of 2026-08-26 — Hostinger MariaDB + Hostinger SMTP (`ai@artors.in`);
WhatsApp channel skipped. Phases A and B are verified end to end: a POST to `/api/lead`
persists the row and stamps both `emailed_at` and `confirmed_at`. Phase C (`/admin`) is done — see `docs/ADMIN.md`.
Code for Phases A+B ships dark and activates via env vars.
**Scope:** everything the marketing site needs server-side. This is not a product backend;
it is a lead pipeline with an admin view.

---

## 1. Goals and non-goals

**Goals**

1. No lead is ever lost. A submission survives even if every notification channel is down.
2. Vedansh hears about a lead within seconds, on the channels he actually watches
   (WhatsApp first, email second).
3. Leads are visible and manageable in one place without asking a developer.
4. Spam never reaches the notification channels.

**Non-goals (deliberately)**

- No user accounts, no client login.
- No custom queue infrastructure — the volume is tens of leads a week, not thousands a minute.
- No separate backend service. Next.js route handlers on the same deployment are the backend.

---

## 2. Architecture

```
Browser (LeadForm / popup)
        │  POST JSON
        ▼
/api/lead  (route handler)
        │ 1. validate + anti-spam
        │ 2. PERSIST FIRST  ──────────►  MySQL `artors` DB  (leads table)
        │ 3. notify, best-effort:
        │      ├─► Email notify      (SMTP → team)
        │      └─► Email confirm     (SMTP → the visitor)
        │ 4. record per-channel delivery status on the row
        ▼
   { ok: true }   (the visitor sees success as soon as persistence succeeds)
```

**The ordering is the design.** Persistence is the source of truth and happens before any
notification. Notification failures mark the row (`notified_at IS NULL`) but never fail the
request — the admin list is the safety net for anything that slips.

Everything lives behind the existing `lib/leads/` adapter, so the form and API surface never
change as transports evolve.

---

## 3. Data model (Drizzle + MySQL)

Same stack as the Spacetrans site (mysql2 + drizzle-orm), separate database.

**Hostinger runs MariaDB, not MySQL** (11.8.8 as of 2026-08-26). Two consequences:

- `id` is a declared `bigint(unsigned).autoincrement()`, never drizzle's `serial()`. MariaDB
  already defines SERIAL as an alias for BIGINT UNSIGNED AUTO_INCREMENT UNIQUE, so the
  `serial AUTO_INCREMENT` drizzle's mysql dialect emits is a parse error.
- `drizzle-kit migrate` fails on that with a silent exit 1 and no message. Migrations run
  through `scripts/migrate.mjs` (drizzle-orm's own migrator) instead, which prints the real
  error. `drizzle-kit generate` is still used to author them.

```ts
// lib/db/schema.ts
leads = mysqlTable("leads", {
  id:          serial().primaryKey(),
  createdAt:   timestamp().defaultNow().notNull(),

  name:        varchar({ length: 120 }).notNull(),
  company:     varchar({ length: 160 }),
  phone:       varchar({ length: 40 }).notNull(),
  email:       varchar({ length: 160 }),
  service:     varchar({ length: 80 }),      // pillar title or empty
  message:     text(),

  sourcePath:  varchar({ length: 200 }),     // page the form was on
  ip:          varchar({ length: 64 }),      // for rate limiting / audit
  userAgent:   varchar({ length: 256 }),

  status:      mysqlEnum(["new", "contacted", "qualified", "closed", "spam"])
                 .default("new").notNull(),
  emailedAt:   timestamp(),                  // null = team notification undelivered
  confirmedAt: timestamp(),                  // null = visitor confirmation unsent
  note:        text(),                       // admin's working note
});
```

Migrations via `drizzle-kit`. One table now; an `events` audit table only if it ever earns
its keep.

---

## 4. The pipeline in detail

### 4.1 Validation & anti-spam (in the route, before anything else)

Layered, cheap first:

1. **Honeypot** (already live) — filled `website` field → respond `{ok:true}`, write nothing.
2. **Time-to-submit** — the form mounts with a signed timestamp (`jose`, same lib as
   Spacetrans); submissions under 3 seconds old are bots → accept-and-drop.
3. **Rate limit** — 5 submissions per IP per 10 minutes, in-memory per instance. Serverless
   instances don't share memory, which is acceptable at this volume; if abuse appears, the
   same check moves to a `rate` table in MySQL (no new vendor).
4. **Field validation** — zod schema shared between form and API (zod is already in the
   family's dependency set on Spacetrans; added here when the backend lands).

Nothing here ever shows a bot an error — bots get a happy `{ok:true}` and silence.

### 4.2 Persistence

Single insert. If MySQL is down, the route returns 500 and the form shows its error state
with the WhatsApp fallback line — the one case where the visitor should try another channel.

### 4.3 Notification fan-out

Both channels fire after persist, in parallel, each wrapped so one failing never blocks
the other:

- **Team notification (Hostinger SMTP)** — one transactional email to `LEAD_NOTIFY_EMAIL`
  with every field, Reply-To set to the lead's email when present, so hitting reply in the
  inbox answers the visitor directly. Stamps `emailed_at`.
- **Visitor confirmation (Hostinger SMTP)** — a short acknowledgement from `ai@artors.in`
  repeating the form's promise ("we reply within a day"). Skipped when the visitor left no
  email address, since email is optional on the form. Stamps `confirmed_at`.

Both go out through `lib/mail.ts`, one pooled SMTP transport. Each success stamps its
timestamp column. A lead with `emailed_at` null after five minutes is visible in admin as
"unnotified" — the safety net. `confirmed_at` null is normal (no email given) and is not an
alarm condition.

### 4.4 Failure posture

| Failure | Visitor sees | System does |
|---|---|---|
| Notification channel down | Success | Row saved, channel column stays null, admin shows it |
| MySQL down | Error + WhatsApp fallback | Nothing written; error logged |
| Bot detected | Success | Nothing written |

---

## 5. Admin — `/admin`

Per the standing rule: **plain shadcn/ui, zero effects.** This is where shadcn finally
enters the project, scoped to the admin route group only — the marketing site keeps its
hand-built system.

- `/admin` — leads table: date, name, phone (tap-to-call / wa.me link), service, source
  page, status. Newest first, "new" rows emphasised, unnotified rows flagged.
- Row actions: set status, edit note. No delete — status `spam` instead (nothing is ever
  destroyed).
- **Auth:** single admin password in env → `jose`-signed httpOnly session cookie (the
  Spacetrans pattern). Proxy file (`proxy.ts`) guards the `/admin` and `/api/admin` route
  groups. No user table, no roles — one operator.

---

## 6. Environment

```
DATABASE_URL=            mysql://…            (blocks Phase A)
SMTP_HOST=               smtp.hostinger.com   (blocks email channel)
SMTP_PORT=               465                  (implicit TLS; 587 for STARTTLS)
SMTP_USER=               ai@artors.in         (the mailbox)
SMTP_PASS=               …                    (mailbox password)
LEAD_FROM_EMAIL=         ai@artors.in         (must equal SMTP_USER — DMARC)
LEAD_FROM_NAME=          Artors
LEAD_NOTIFY_EMAIL=       where notifications land
ADMIN_PASSWORD=          admin login
SESSION_SECRET=          jose signing key
```

Secrets live in `.env.local` (gitignored) and the host's env store. Nothing in the repo.

---

## 7. Build phases

- **Phase A — never lose a lead:** schema + migration, persist in `/api/lead`, zod
  validation, time-to-submit check, rate limit. **Done 2026-08-26.**
- **Phase B — hear about it:** SMTP delivery (team notification + visitor confirmation),
  delivery-status columns. **Done 2026-08-26**, verified against a real send.
- **Phase C — manage it:** `/admin` with auth and the leads table. **Done 2026-08-26** —
  and extended past the original scope to cover logos, case studies, testimonials and team.
  See `docs/ADMIN.md`.
- **Phase D — polish:** unnotified-lead flag, CSV export, daily digest if wanted.

Each phase ships independently; the site works (console transport) at every stage.

---

## 8. Decisions (taken 2026-08-21)

1. **Database:** `u839308886_artors` on `srv1742.hstgr.io:3306`, user
   `u839308886_artorsAmul`. **Live since 2026-08-26** — schema applied, insert/update/read
   verified end to end. Credentials in `.env.local` only.
   *Open risk:* the remote-access rule is `%` (any IP on the internet). Fine while developing
   from a changing address; narrow it to the deploy host — or drop it entirely and use
   `localhost`, since artors.in is a Node.js site on the same Hostinger account
   (`/home/u839308886/domains/artors.in/public_html`) — before launch.
2. **Email (revised 2026-08-26):** the Hostinger mailbox `ai@artors.in`, relayed over
   `smtp.hostinger.com:465` with nodemailer — not Resend. The mailbox is already paid for, and
   `artors.in` already publishes the records Hostinger mail needs: SPF
   (`include:_spf.mail.hostinger.com`), three `hostingermail-a/b/c._domainkey` DKIM CNAMEs, and
   DMARC at `p=none`. Sending through the same provider that owns those records means mail
   authenticates with no new DNS and no second vendor, and replies land in a real inbox someone
   reads rather than a no-reply void.
   *Trade-off accepted:* SMTP has no delivery dashboard and Hostinger applies an hourly send cap.
   At tens of leads a week that is invisible; if the site ever sends in bulk, revisit. The
   `lib/mail.ts` seam means swapping to an API provider is one file.
   **Two messages leave per lead:** the internal notification (Reply-To set to the visitor) and a
   confirmation to the visitor, skipped when they left no email address.
3. **WhatsApp:** skipped for now. The adapter keeps a slot for it; a Pabbly webhook can be added later without touching the form or route.
