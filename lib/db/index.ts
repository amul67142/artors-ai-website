import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

/**
 * Lazy database handle. Returns null when DATABASE_URL is absent, so
 * every caller degrades gracefully in dev and before credentials land
 * (docs/BACKEND.md — code ships dark, env vars switch it on).
 */

function createDb(url: string) {
  const pool = mysql.createPool({ uri: url, connectionLimit: 4 });
  return drizzle(pool, { schema, mode: "default" });
}

let db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (db) return db;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  db = createDb(url);
  return db;
}

export { schema };
