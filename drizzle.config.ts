import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read .env.local the way Next.js does, so load it
// here. Absent in CI or on a fresh clone — the catch keeps that fine.
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  dialect: "mysql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Present only when migrating against a real database.
    url: process.env.DATABASE_URL ?? "mysql://placeholder",
  },
});
