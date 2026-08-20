import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

/** The leads table — docs/BACKEND.md §3. Nothing is ever deleted;
 *  status "spam" is the bin. */
export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
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
  note: text("note"),
});
