import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transport — docs/BACKEND.md §5.
 *
 * Mail goes out through the Hostinger mailbox the business already owns
 * (ai@artors.in). artors.in publishes SPF, DKIM and DMARC for Hostinger's
 * mail servers, so anything relayed through smtp.hostinger.com authenticates
 * as the real address and replies land in the real inbox.
 *
 * Returns null when SMTP env is absent so every caller degrades to a console
 * log — the site works at every phase, unconfigured included.
 */

let transport: Transporter | null = null;
let checked = false;

export function getMailer(): Transporter | null {
  if (checked) return transport;
  checked = true;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);
  transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465, STARTTLS on 587
    auth: { user, pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
  });
  return transport;
}

/** The From header. Always the authenticated mailbox — anything else fails DMARC. */
export function mailFrom(): string {
  const address = process.env.LEAD_FROM_EMAIL ?? process.env.SMTP_USER ?? "";
  const name = process.env.LEAD_FROM_NAME ?? "Artors";
  return name ? `"${name}" <${address}>` : address;
}

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/** Sends one message. Resolves false rather than throwing — mail is
 *  best-effort everywhere it is used. */
export async function sendMail(mail: Mail): Promise<boolean> {
  const t = getMailer();
  if (!t) {
    console.log("[mail:no-smtp]", mail.to, mail.subject);
    return false;
  }
  try {
    await t.sendMail({ from: mailFrom(), ...mail });
    return true;
  } catch (e) {
    console.error("[mail:failed]", mail.to, e);
    return false;
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
