import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "mysql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Present only when migrating against a real database.
    url: process.env.DATABASE_URL ?? "mysql://placeholder",
  },
});
