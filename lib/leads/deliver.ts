import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";

/**
 * Lead pipeline — docs/BACKEND.md.
 *
 * Persist first (MySQL), notify second (Resend email), each stage
 * degrading gracefully when its env is absent so the site works at
 * every phase:
 *   - no DATABASE_URL  → lead is logged to the console instead
 *   - no RESEND_API_KEY → email step is skipped
 *
 * A WhatsApp slot stays open here by design; adding a Pabbly webhook
 * later touches only this file.
 */

export type Lead = {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  sourcePath?: string;
  ip?: string;
  userAgent?: string;
};

/** Writes the lead. Returns the row id, or null when running dark. */
export async function persistLead(lead: Lead): Promise<number | null> {
  const db = getDb();
  if (!db) {
    console.log("[lead:no-db]", JSON.stringify(lead));
    return null;
  }
  const [res] = await db.insert(schema.leads).values(lead).$returningId();
  return res.id;
}

/** Emails the lead via Resend; stamps emailed_at on success. */
export async function notifyEmail(lead: Lead, id: number | null): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!key || !to || !from) {
    console.log("[lead:no-email]", lead.name, lead.phone);
    return;
  }

  const rows = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Service", lead.service],
    ["Message", lead.message],
    ["Page", lead.sourcePath],
    ["Lead ID", id ? String(id) : "(not persisted)"],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555">${k}</td><td style="padding:4px 0"><b>${escapeHtml(String(v))}</b></td></tr>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email || undefined,
      subject: `New lead: ${lead.name}${lead.service ? ` — ${lead.service}` : ""}`,
      html: `<table style="font:14px system-ui">${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error("[lead:email-failed]", res.status, await res.text().catch(() => ""));
    return;
  }

  if (id !== null) {
    const db = getDb();
    if (db) {
      await db
        .update(schema.leads)
        .set({ emailedAt: new Date() })
        .where(eq(schema.leads.id, id))
        .catch((e) => console.error("[lead:stamp-failed]", e));
    }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
