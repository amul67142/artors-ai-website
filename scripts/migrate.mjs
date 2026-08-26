/**
 * Applies drizzle/*.sql to DATABASE_URL.
 *
 *   npm run db:migrate
 *
 * Uses drizzle-orm's migrator rather than `drizzle-kit migrate`, which on
 * this setup exits 1 without printing the underlying error. Same journal,
 * same __drizzle_migrations bookkeeping — just a usable stack trace.
 */
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set — check .env.local");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: url, multipleStatements: true });
await migrate(drizzle(conn), { migrationsFolder: "./drizzle" });
console.log("✓ migrations applied");
await conn.end();
