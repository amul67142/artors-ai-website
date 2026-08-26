import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

/** The leads table — docs/BACKEND.md §3. Nothing is ever deleted;
 *  status "spam" is the bin.
 *
 *  id is an explicit bigint rather than drizzle's serial(): Hostinger runs
 *  MariaDB, where SERIAL is already an alias for BIGINT UNSIGNED AUTO_INCREMENT
 *  UNIQUE, so the "serial AUTO_INCREMENT" drizzle emits is a syntax error. */
export const leads = mysqlTable("leads", {
  id: bigint("id", { mode: "number", unsigned: true })
    .autoincrement()
    .primaryKey(),
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
});
