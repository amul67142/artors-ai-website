import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  boolean,
  int,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Schema — docs/BACKEND.md §3, docs/ADMIN.md.
 *
 * Every id is an explicit bigint(unsigned).autoincrement(), never drizzle's
 * serial(): Hostinger runs MariaDB, where SERIAL is already an alias for
 * BIGINT UNSIGNED AUTO_INCREMENT UNIQUE, so the "serial AUTO_INCREMENT" the
 * mysql dialect emits is a parse error.
 *
 * Every content table defaults `published` to FALSE. The public site renders
 * only published rows and hides the whole section when there are none — the
 * structural guarantee behind docs/PLAN.md §2, "no fabricated proof". A blank
 * section is correct; a placeholder one is not.
 */

const id = () => bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();

/** The leads table. Nothing is ever deleted; status "spam" is the bin. */
export const leads = mysqlTable(
  "leads",
  {
    id: id(),
    createdAt: timestamp("created_at").defaultNow().notNull(),

    name: varchar("name", { length: 120 }).notNull(),
    company: varchar("company", { length: 160 }),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 160 }),
    service: varchar("service", { length: 80 }),
    message: text("message"),

    sourcePath: varchar("source_path", { length: 200 }),
    ip: varchar("ip", { length: 64 }),
    userAgent: varchar("user_agent", { length: 256 }),

    status: mysqlEnum("status", ["new", "contacted", "qualified", "closed", "spam"])
      .default("new")
      .notNull(),
    emailedAt: timestamp("emailed_at"),
    confirmedAt: timestamp("confirmed_at"),
    note: text("note"),
  },
  (t) => [index("leads_status_idx").on(t.status), index("leads_created_idx").on(t.createdAt)],
);

/**
 * Logos for the strip under the hero.
 *
 * `kind` is the important column. docs/PLAN.md §2.6 permits integration marks
 * (WhatsApp, n8n, HubSpot) in that slot but forbids showing a company as a
 * client without an engagement — a legal liability, not a style preference.
 * Separating them in the data makes the mistake impossible to make by accident.
 */
export const clients = mysqlTable(
  "clients",
  {
    id: id(),
    name: varchar("name", { length: 120 }).notNull(),
    kind: mysqlEnum("kind", ["client", "integration"]).default("integration").notNull(),
    logoUrl: varchar("logo_url", { length: 400 }),
    websiteUrl: varchar("website_url", { length: 400 }),
    sortOrder: int("sort_order").default(0).notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("clients_pub_idx").on(t.published, t.kind, t.sortOrder)],
);

/**
 * Case studies. /work carries the worked sample until these exist; the page
 * shows real case studies the moment there is a published row, which is the
 * "same URL, no redesign" promise in docs/PLAN.md §2.1.
 */
export const caseStudies = mysqlTable(
  "case_studies",
  {
    id: id(),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    clientName: varchar("client_name", { length: 140 }),
    industry: varchar("industry", { length: 80 }),
    summary: varchar("summary", { length: 400 }),
    challenge: text("challenge"),
    solution: text("solution"),
    outcome: text("outcome"),
    /** [{ label: "Response time", value: "under 60s" }] — capability or measured, never invented. */
    metrics: json("metrics").$type<{ label: string; value: string }[]>(),
    coverUrl: varchar("cover_url", { length: 400 }),
    sortOrder: int("sort_order").default(0).notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [
    uniqueIndex("case_studies_slug_key").on(t.slug),
    index("case_studies_pub_idx").on(t.published, t.sortOrder),
  ],
);

/** Testimonials. Empty until a real client says something real. */
export const testimonials = mysqlTable(
  "testimonials",
  {
    id: id(),
    quote: text("quote").notNull(),
    authorName: varchar("author_name", { length: 120 }).notNull(),
    authorRole: varchar("author_role", { length: 140 }),
    company: varchar("company", { length: 140 }),
    avatarUrl: varchar("avatar_url", { length: 400 }),
    sortOrder: int("sort_order").default(0).notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("testimonials_pub_idx").on(t.published, t.sortOrder)],
);

/** Founders and team — the named-humans half of the trust layer. */
export const teamMembers = mysqlTable(
  "team_members",
  {
    id: id(),
    name: varchar("name", { length: 120 }).notNull(),
    role: varchar("role", { length: 140 }),
    bio: text("bio"),
    photoUrl: varchar("photo_url", { length: 400 }),
    linkedinUrl: varchar("linkedin_url", { length: 400 }),
    email: varchar("email", { length: 160 }),
    isFounder: boolean("is_founder").default(false).notNull(),
    sortOrder: int("sort_order").default(0).notNull(),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [index("team_pub_idx").on(t.published, t.sortOrder)],
);

/** Uploaded files. Rows are the index; bytes live under UPLOAD_DIR. */
export const media = mysqlTable("media", {
  id: id(),
  key: varchar("key", { length: 200 }).notNull(),
  filename: varchar("filename", { length: 240 }).notNull(),
  mimeType: varchar("mime_type", { length: 120 }).notNull(),
  bytes: int("bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/** Failed admin logins, for lockout. Survives restarts, unlike an in-memory map. */
export const loginAttempts = mysqlTable(
  "login_attempts",
  {
    id: id(),
    ip: varchar("ip", { length: 64 }).notNull(),
    at: timestamp("at").defaultNow().notNull(),
  },
  (t) => [index("login_attempts_ip_idx").on(t.ip, t.at)],
);
