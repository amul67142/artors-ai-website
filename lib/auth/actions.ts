"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { verifyPassword, verifyPlainPassword } from "./password";
import { createSession, destroySession } from "./session";

/**
 * Login and logout — docs/ADMIN.md §2.
 *
 * Failures are counted per IP in the login_attempts table rather than an
 * in-memory map, so a restart does not reset an attacker's budget and the
 * count holds across the multiple processes a Node host may run.
 */

const WINDOW_MIN = 15;
const MAX_FAILURES = 8;

const credentials = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export type LoginState = { error?: string };

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Failed attempts for this IP inside the window.
 *
 * Fails OPEN, deliberately. This query runs before credentials are checked, so
 * an unreachable database used to throw and turn every login into a 500 — the
 * admin was completely unusable, and the error said nothing about why. Auth
 * integrity does not depend on it: the password check reads from env, not the
 * database, so a lockout counter that cannot be read degrades brute-force
 * protection without ever letting a wrong password through.
 */
async function recentFailures(ip: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const since = new Date(Date.now() - WINDOW_MIN * 60 * 1000);
    const rows = await db
      .select({ n: sql<number>`count(*)` })
      .from(schema.loginAttempts)
      .where(and(eq(schema.loginAttempts.ip, ip), gte(schema.loginAttempts.at, since)));
    return Number(rows[0]?.n ?? 0);
  } catch (e) {
    console.error("[admin:lockout-unavailable] login rate limiting is off:", e);
    return 0;
  }
}

async function recordFailure(ip: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.insert(schema.loginAttempts).values({ ip }).catch(() => {});
}

async function clearFailures(ip: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.delete(schema.loginAttempts).where(eq(schema.loginAttempts.ip, ip)).catch(() => {});
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  // One message for every failure mode below: never reveal whether the email
  // exists, whether the password was close, or whether the account is real.
  const GENERIC = "Email or password is incorrect.";
  if (!parsed.success) return { error: GENERIC };

  const ip = await clientIp();
  if ((await recentFailures(ip)) >= MAX_FAILURES) {
    return { error: `Too many attempts. Try again in ${WINDOW_MIN} minutes.` };
  }

  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  const expectedPlain = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || (!expectedHash && !expectedPlain)) {
    console.error(
      "[admin:misconfigured] need ADMIN_EMAIL plus ADMIN_PASSWORD or ADMIN_PASSWORD_HASH",
    );
    return { error: "Admin is not configured on this server." };
  }

  // A stale ADMIN_PASSWORD_HASH silently outranking a freshly set
  // ADMIN_PASSWORD looks exactly like a wrong password, and cost an hour in
  // production on 2026-08-27. The precedence stays — never silently downgrade
  // to the weaker credential — but it says so out loud now.
  if (expectedHash && expectedPlain) {
    console.warn(
      "[admin:both-credentials-set] ADMIN_PASSWORD_HASH takes precedence and " +
        "ADMIN_PASSWORD is being ignored. Delete one of them.",
    );
  }

  // Always run the password comparison, even when the email is wrong, so
  // response time does not disclose which half of the credentials failed.
  const emailOk = parsed.data.email === expectedEmail;
  const passwordOk = expectedHash
    ? await verifyPassword(parsed.data.password, expectedHash)
    : verifyPlainPassword(parsed.data.password, expectedPlain!);

  if (!emailOk || !passwordOk) {
    await recordFailure(ip);
    return { error: GENERIC };
  }

  await clearFailures(ip);
  await createSession(expectedEmail);
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
