import { eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { escapeHtml, sendMail } from "@/lib/mail";

/**
 * Lead pipeline — docs/BACKEND.md.
 *
 * Persist first (MySQL), notify second (SMTP via the Hostinger mailbox),
 * each stage degrading gracefully when its env is absent so the site works
 * at every phase:
 *   - no DATABASE_URL → lead is logged to the console instead
 *   - no SMTP_* vars  → email steps are skipped
 *
 * Two messages leave per lead: the internal notification to the team, and
 * the confirmation back to the visitor. Neither can fail the request.
 *
 * A WhatsApp slot stays open here by design; adding a Pabbly webhook later
 * touches only this file.
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

/** Stamps a delivery column on the row, best-effort. */
async function stamp(id: number | null, column: "emailedAt" | "confirmedAt") {
  if (id === null) return;
  const db = getDb();
  if (!db) return;
  const patch =
    column === "emailedAt"
      ? { emailedAt: new Date() }
      : { confirmedAt: new Date() };
  await db
    .update(schema.leads)
    .set(patch)
    .where(eq(schema.leads.id, id))
    .catch((e) => console.error("[lead:stamp-failed]", column, e));
}

/** The internal notification — the lead, in full, to whoever works it. */
export async function notifyEmail(lead: Lead, id: number | null): Promise<void> {
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) {
    console.log("[lead:no-notify-address]", lead.name, lead.phone);
    return;
  }

  const fields: [string, string | undefined][] = [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Service", lead.service],
    ["Message", lead.message],
    ["Page", lead.sourcePath],
    ["Lead ID", id ? String(id) : "(not persisted)"],
  ];
  const present = fields.filter(([, v]) => v) as [string, string][];

  const rows = present
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555;vertical-align:top">${k}</td><td style="padding:4px 0"><b>${escapeHtml(v)}</b></td></tr>`,
    )
    .join("");

  const ok = await sendMail({
    to,
    replyTo: lead.email || undefined,
    subject: `New lead: ${lead.name}${lead.service ? ` — ${lead.service}` : ""}`,
    text: present.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<table style="font:14px system-ui,-apple-system,Segoe UI,sans-serif">${rows}</table>`,
  });

  if (ok) await stamp(id, "emailedAt");
}

/** The confirmation back to the visitor. Skipped when they left no email. */
export async function confirmLead(lead: Lead, id: number | null): Promise<void> {
  if (!lead.email) return;

  const firstName = lead.name.split(" ")[0] || lead.name;
  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for getting in touch with Artors — your request has reached us.",
    "",
    "We reply within a day with a clear next step, not a brochure. If it's",
    "urgent, reply to this email and say so, and we move faster.",
    "",
    "— Artors",
    "AI systems for business results",
    "ai@artors.in",
  ].join("\n");

  const ok = await sendMail({
    to: lead.email,
    subject: "Thanks — we've got your request",
    text,
    html: `<div style="font:15px/1.6 system-ui,-apple-system,Segoe UI,sans-serif;color:#111;max-width:520px">
  <p>Hi ${escapeHtml(firstName)},</p>
  <p>Thanks for getting in touch with Artors — your request has reached us.</p>
  <p>We reply within a day with a clear next step, not a brochure. If it's urgent, reply to this email and say so, and we move faster.</p>
  <p style="margin-top:28px;color:#555;font-size:13px">
    — Artors<br>AI systems for business results<br>
    <a href="mailto:ai@artors.in" style="color:#555">ai@artors.in</a>
  </p>
</div>`,
  });

  if (ok) await stamp(id, "confirmedAt");
}
