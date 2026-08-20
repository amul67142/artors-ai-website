# Artors — Backend Design

**Status:** designed, awaiting three decisions (§8), then built in phases.
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
        │ 3. fan out, best-effort:
        │      ├─► WhatsApp notify   (Pabbly webhook → WhatsApp)
        │      └─► Email notify      (transactional email API)
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
  emailedAt:   timestamp(),                  // null = channel not yet delivered
  whatsappAt:  timestamp(),
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

- **WhatsApp (primary)** — `POST` the lead as JSON to a **Pabbly Connect webhook**. Pabbly
  routes it to WhatsApp (and can additionally drop it into a sheet or CRM later without any
  code change here). This reuses the exact stack the agency already operates for its own
  clients' lead delivery — the tooling is known, and Artors eating its own integration
  cooking is on-brand.
- **Email (second channel + paper trail)** — one transactional email to the notification
  address with every field, reply-to set to the lead's email when present.

Each success stamps its timestamp column. A lead with both columns null after five minutes
is visible in admin as "unnotified" — the safety net.

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
PABBLY_LEAD_WEBHOOK=     https://connect.pabbly.com/…   (blocks WhatsApp channel)
EMAIL_API_KEY=           provider key         (blocks email channel)
LEAD_NOTIFY_EMAIL=       where notifications land
ADMIN_PASSWORD=          admin login
SESSION_SECRET=          jose signing key
```

Secrets live in `.env.local` (gitignored) and the host's env store. Nothing in the repo.

---

## 7. Build phases

- **Phase A — never lose a lead:** schema + migration, persist in `/api/lead`, zod
  validation, time-to-submit check, rate limit. *Blocks on: DATABASE_URL.*
- **Phase B — hear about it:** Pabbly webhook + email delivery, delivery-status columns.
  *Blocks on: webhook URL, email provider key, notify address.*
- **Phase C — manage it:** `/admin` with auth and the leads table.
- **Phase D — polish:** unnotified-lead flag, CSV export, daily digest if wanted.

Each phase ships independently; the site works (console transport) at every stage.

---

## 8. The three decisions this blocks on

1. **Database** — recommended: a new `artors` database on the same Hostinger MySQL server
   the Spacetrans backend will use (one bill, one backup story). Alternative: any managed
   MySQL. Needed: a connection string.
2. **Email provider** — recommended: Resend (cleanest API on Vercel-style hosting; needs
   DNS records on the artors domain once it exists). Alternative: Hostinger SMTP via
   nodemailer — no new vendor, clunkier deliverability.
3. **WhatsApp route** — recommended: Pabbly webhook (already operated in-house, zero new
   API approvals). Alternative: Meta WhatsApp Cloud API direct — first-party but needs
   Business verification and template approval before day one.
