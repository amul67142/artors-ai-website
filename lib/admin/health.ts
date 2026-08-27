import "server-only";
import mysql from "mysql2/promise";
import { requireAdmin } from "@/lib/auth/dal";
import { getMailer } from "@/lib/mail";

/**
 * System health — docs/ADMIN.md §8.
 *
 * Exists because a broken DATABASE_URL is invisible from the outside: a wrong
 * host, a wrong database name, a wrong password and a blocked port all surface
 * as the same 500. Diagnosing that by guessing costs hours — this reports the
 * driver's own error code instead.
 *
 * Admin-only, and it never prints a secret. The connection string is shown
 * decomposed — user, host, port, database — with the password omitted, because
 * those four fields are exactly where the mistakes are and none of them is
 * sensitive on its own.
 */

export type Check = {
  label: string;
  ok: boolean;
  detail: string;
  hint?: string;
};

/** Splits a mysql:// URL without ever revealing the password. */
function describeUrl(raw: string): { detail: string; hint?: string } {
  try {
    const u = new URL(raw);
    const user = decodeURIComponent(u.username || "(none)");
    const db = u.pathname.replace(/^\//, "") || "(none)";
    const detail = `user ${user} · host ${u.hostname} · port ${u.port || "3306"} · database ${db}`;

    // An unescaped '@' inside the password is NOT a fault: URL parsing splits
    // on the LAST '@', so mysql://u:pa@ss@host/db resolves correctly. Verified
    // against this server — do not reintroduce a %40 warning here.
    if (!u.password) {
      return { detail, hint: "No password was parsed from this URL." };
    }
    return { detail };
  } catch {
    return {
      detail: "unparseable",
      hint: "Not a valid URL. Expected mysql://user:password@host:3306/database — check for stray quotes or whitespace around the value.",
    };
  }
}

function hintForCode(code?: string): string | undefined {
  switch (code) {
    case "ER_ACCESS_DENIED_ERROR":
      return "The server was reached but the username or password was rejected. Compare both against hPanel → Databases.";
    case "ER_DBACCESS_DENIED_ERROR":
      return "The credentials are right but this user cannot access that database — usually the database name is wrong. It needs the full prefixed name, e.g. u839308886_artors.";
    case "ER_BAD_DB_ERROR":
      return "Connected, but no database of that name exists on this server.";
    case "ECONNREFUSED":
      return "Nothing is listening on that host and port. The app and MySQL share a machine here, so try localhost.";
    case "ETIMEDOUT":
    case "ER_GET_CONNECTION_TIMEOUT":
      return "Timed out, which usually means a firewall. Try localhost, since the app runs on the same server as MySQL.";
    case "ENOTFOUND":
      return "That hostname does not resolve. Check it for a typo.";
    default:
      return undefined;
  }
}

export async function getHealth(): Promise<Check[]> {
  await requireAdmin();
  const checks: Check[] = [];

  /* ---------------------------------------------------------- database -- */
  const url = process.env.DATABASE_URL;
  if (!url) {
    checks.push({
      label: "Database",
      ok: false,
      detail: "DATABASE_URL is not set",
      hint: "Leads are being written to the server log instead of the database, and are effectively lost.",
    });
  } else {
    const described = describeUrl(url);
    let conn: mysql.Connection | null = null;
    try {
      conn = await mysql.createConnection({ uri: url, connectTimeout: 8000 });
      const [rows] = await conn.query("SELECT DATABASE() AS db, VERSION() AS v");
      const row = (rows as { db: string; v: string }[])[0];
      checks.push({
        label: "Database",
        ok: true,
        detail: `connected to ${row.db} on ${row.v} — ${described.detail}`,
      });
    } catch (e) {
      const err = e as { code?: string; message?: string };
      checks.push({
        label: "Database",
        ok: false,
        detail: `${err.code ?? "error"}: ${err.message ?? String(e)} — read as ${described.detail}`,
        hint: described.hint ?? hintForCode(err.code),
      });
    } finally {
      await conn?.end().catch(() => {});
    }
  }

  /* -------------------------------------------------------------- mail -- */
  const mailer = getMailer();
  if (!mailer) {
    checks.push({
      label: "Email",
      ok: false,
      detail: "SMTP is not configured",
      hint: "Set SMTP_HOST, SMTP_USER and SMTP_PASS. Leads still save; nobody is notified.",
    });
  } else {
    try {
      await mailer.verify();
      checks.push({
        label: "Email",
        ok: true,
        detail: `authenticated as ${process.env.SMTP_USER} on ${process.env.SMTP_HOST}`,
      });
    } catch (e) {
      checks.push({
        label: "Email",
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
        hint: "Leads still save — only the notification fails.",
      });
    }
  }

  /* --------------------------------------------------------- admin env -- */
  const hasHash = Boolean(process.env.ADMIN_PASSWORD_HASH);
  const hasPlain = Boolean(process.env.ADMIN_PASSWORD);
  checks.push({
    label: "Admin credentials",
    ok: !(hasHash && hasPlain),
    detail: [
      `ADMIN_EMAIL ${process.env.ADMIN_EMAIL ? "set" : "MISSING"}`,
      hasHash ? "ADMIN_PASSWORD_HASH set" : null,
      hasPlain ? "ADMIN_PASSWORD set" : null,
      process.env.SESSION_SECRET ? "SESSION_SECRET set" : "SESSION_SECRET MISSING",
    ]
      .filter(Boolean)
      .join(" · "),
    hint:
      hasHash && hasPlain
        ? "Both are set. ADMIN_PASSWORD_HASH wins and ADMIN_PASSWORD is ignored — delete one."
        : undefined,
  });

  return checks;
}
