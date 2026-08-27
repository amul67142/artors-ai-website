# Artors — Admin

**Status:** built 2026-08-26. Phase C of `docs/BACKEND.md` §7.
**Scope:** the operator surface at `/admin` — leads, and every piece of site content that
should be editable without a deploy.

---

## 1. What it is

One password-protected area for one operator. It does two jobs:

1. **Work the leads.** See them, filter them, change status, keep a note, export CSV.
2. **Own the trust layer.** Logos, case studies, testimonials and team are database rows,
   not hardcoded arrays, so they change without a developer or a redeploy.

It is deliberately not a CMS. There are no roles, no drafts-with-workflow, no revision
history — one operator, one password, publish or don't.

### The rule the schema enforces

`docs/PLAN.md` §2 is the constraint the whole site is built around: Artors has no clients yet,
and the site must build trust **without fabricating any**. The admin encodes that structurally
rather than trusting anyone to remember it:

- Every content row defaults to `published = false`.
- The public site queries `published = true` only.
- **A section with zero published rows renders nothing at all** — no placeholder, no skeleton,
  no "coming soon". See `lib/content/db.ts`.
- `clients.kind` separates a **client** (a real engagement) from an **integration** (a tool we
  build with). `docs/PLAN.md` §2.6 allows integration marks in the logo strip and forbids
  presenting a company as a client without an engagement — a legal liability, not a style
  preference. The strip labels the two groups differently and never mixes them.

This closed the open item in `docs/PLAN.md` §7: the dummy Emaar / Godrej / Eldeco / Advitya
marks are gone from the code. Nothing appears in that strip now unless it was deliberately
added and published.

---

## 2. Authentication

Stateless session, one operator, no user table.

```
POST login (server action)
   │ 1. zod-validate the fields
   │ 2. per-IP failure count from the login_attempts table   → lock at 8 per 15 min
   │ 3. compare email, and ALWAYS run the password compare
   │ 4. jose HS256 JWT  →  httpOnly cookie "artors_admin", 8 hours
   ▼
/admin
```

| Concern | Decision |
|---|---|
| Password storage | **`ADMIN_PASSWORD`, plain, by default.** Optionally `ADMIN_PASSWORD_HASH` (scrypt, `node:crypto`, no dependency) instead — the hash wins when both are set, so hardening never needs a code change. Cost parameters are stored inline in the hash, so they can be raised later without invalidating existing ones. |
| Why plain is the default | One paste into the host's env editor, and the hash's `$` separators are mangled by some of those editors. The security gap is narrower than it looks: the same env store already holds `DATABASE_URL` and `SMTP_PASS` in the clear, so anything able to read `ADMIN_PASSWORD` already has the database and the mailbox. The hash only helps when that one value leaks alone — a screenshot, a pasted config. |
| Comparison | Constant time on both paths. The plain path compares fixed-width SHA-256 digests, because `timingSafeEqual` throws on a length mismatch and the length itself would leak. The comparison runs **even when the email is wrong**, so response time does not disclose which half failed. |
| Failure message | One string for every failure. Never reveals whether the account exists or the password was close. |
| Brute force | Failures counted per IP in `login_attempts` — a table, not an in-memory map, so a restart does not reset an attacker's budget and the count survives multiple Node processes. |
| Session | `jose` HS256 signed with `SESSION_SECRET`, `httpOnly` + `sameSite=lax` + `secure` in production, 8-hour expiry. Client JavaScript cannot read it; the server cannot be handed a session it did not mint. |
| Payload | Email only. Next's guidance: the minimum needed, never PII or secrets. |

### Rotating the password

Change `ADMIN_PASSWORD` in `.env.local` and in hPanel's environment store, then restart the app.

To harden instead, generate a hash and set `ADMIN_PASSWORD_HASH` (it takes precedence, so you
can leave or remove `ADMIN_PASSWORD`):

```bash
npm run admin:hash -- 'the new password'
```

Refuses anything under 10 characters.

### Two layers, on purpose

`proxy.ts` (Next 16's rename of `middleware.ts`) checks only that the cookie is **present** and
bounces anonymous traffic before it reaches a render. It deliberately does **not** verify the
signature — Next's own documentation is explicit that proxy must not be the authorisation
solution, and reading the secret there would run on every matched request.

The real check is `requireAdmin()` in `lib/auth/dal.ts`, called by every admin page, every
server action and every admin route handler. A forged cookie sails past the proxy and is
rejected there. A route that forgets the call fails closed, because it renders nothing without
data. `cache()` memoises it per render pass, so a page and its children verify once.

---

## 3. Layout isolation

The admin is a **separate root layout** (`app/(admin)/layout.tsx`), which is why the public
pages moved into `app/(site)/`. Admin therefore inherits none of the marketing chrome — no
header, footer, lead modal or GSAP scroll layer, all of which would be noise and load time here.

shadcn/ui components live in `components/admin/ui/`, **not** `components/ui/`. The public site
already has a `components/ui/Button.tsx`, and shadcn installs `button.tsx`; on a
case-insensitive filesystem — which is to say, on Windows — those are the same file.

`app/admin-theme.css` scopes every shadcn token under `.admin-root` rather than `:root`. Both
systems define `--accent` and mean different things by it. The `@theme inline` block is global
because it has to be (it generates the `bg-background`-style utility classes), but it only maps
names to variables that resolve to nothing outside the admin subtree.

---

## 4. Collections

Every content type is described **once**, in `lib/admin/collections.ts`: its fields, their
types, their help text, and which columns the table shows. Adding a field there adds it to the
form, the table and the validation together.

- `lib/admin/collections.ts` — client-safe specs. No drizzle, no zod, no server imports.
- `lib/admin/registry.ts` — server half. Maps the same keys to drizzle tables and zod schemas.
  A collection key arriving from the client is only ever used to *look up* an entry here, so an
  unknown or crafted key resolves to nothing rather than reaching the database.
- `lib/admin/actions.ts` — `saveItem` / `deleteItem` / `setPublished`, plus the lead mutations.
- `components/admin/CollectionManager.tsx` — one editor that renders all four from the spec.

**Every action calls `requireAdmin()` first.** Server Actions are public endpoints — reachable
by anyone who can POST to the app — so the check belongs in the action, never only in the page
that renders the button.

Publishing calls `revalidatePath()`, which drops the static cache so the marketing site picks
the change up without a redeploy. The client also calls `router.refresh()`: revalidation clears
the server cache, but an already-rendered route still has to be told to re-fetch.

---

## 5. Media

Uploads go to disk under `UPLOAD_DIR` (default `.uploads`), **not** `public/`. `public/` is
scanned at build time, so a file written there after a build is invisible until the next one.
Bytes are served back through `/api/media/[key]`, which works on any host.

- Allowed: PNG, JPEG, WebP, SVG, AVIF. Max 4 MB.
- Keys are 24 hex characters plus an extension, validated by regex, and the resolved path is
  checked to be inside the upload directory — so a crafted key cannot escape it.
- Deleting a row deletes its uploaded file, so removals do not leave bytes behind.
- The `media` table indexes what was uploaded.

`lib/storage/index.ts` is a seam in the same shape as `lib/leads/deliver.ts`: moving to
Cloudinary or S3 means reimplementing `put` / `get` / `remove` and touching nothing else.

---

## 6. What the public site now reads from the database

| Section | Page | Empty behaviour |
|---|---|---|
| Logo strip | `/` | Section omitted entirely |
| Testimonials | `/` | Section omitted entirely |
| Case studies | `/work` | Section omitted; the worked sample carries the page alone |
| Case study detail | `/work/[slug]` | Route 404s; no paths generated |
| Founders & team | `/about` | Falls back to the unattributed statement about how the work is staffed — a true claim about the operating model, not a fabricated person |

Reads live in `lib/content/db.ts`. Every one returns empty when the database is unreachable, so
a build without `DATABASE_URL` still succeeds and simply renders the empty states.

---

## 7. Environment

```
ADMIN_EMAIL=              ai@artors.in
ADMIN_PASSWORD=           the plain password
ADMIN_PASSWORD_HASH=      optional; scrypt$16384$8$1$… — wins over the above
SESSION_SECRET=           base64, 32 bytes     (openssl rand -base64 32)
UPLOAD_DIR=               .uploads
```

Plus `DATABASE_URL` and the SMTP block from `docs/BACKEND.md` §6.

---

## 8. Open items

- [ ] The admin password is stored plain in the env store (Vedansh's call, 2026-08-27 — see the
      table in §2 for why the trade-off is modest). `ADMIN_PASSWORD_HASH` is wired and takes
      precedence whenever it is worth switching.
- [ ] **The database and the ai@artors.in mailbox share one password.** If one leaks, both go.
- [ ] **MySQL remote access is `%`** — open to every IP on the internet. `artors.in` is a
      Node.js site on the same Hostinger account, so after deploy the app can use `localhost`
      and the rule can be deleted.
- [ ] `public/clients/*.png|svg` still holds the old placeholder logos. Nothing imports them
      any more, but they are still served at their URLs. Delete once confirmed unwanted.
- [ ] No `/admin` rate limit beyond login. Fine for one operator; revisit if the URL leaks.
- [ ] Phase D of `docs/BACKEND.md`: daily digest, if wanted.
