/**
 * SMTP smoke test — run once after filling SMTP_PASS in .env.local.
 *
 *   npm run mail:test -- you@example.com
 *
 * Verifies the credentials, then sends one real message so you can confirm
 * it arrives (and check the headers say SPF/DKIM/DMARC pass).
 */
import nodemailer from "nodemailer";

const to = process.argv[2] || process.env.LEAD_NOTIFY_EMAIL;
if (!to) {
  console.error("Usage: npm run mail:test -- you@example.com");
  process.exit(1);
}

const { SMTP_HOST, SMTP_PORT = "465", SMTP_USER, SMTP_PASS } = process.env;
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
  console.error("Missing SMTP_HOST / SMTP_USER / SMTP_PASS — check .env.local");
  process.exit(1);
}

const port = Number(SMTP_PORT);
const t = nodemailer.createTransport({
  host: SMTP_HOST,
  port,
  secure: port === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

await t.verify();
console.log(`✓ authenticated as ${SMTP_USER} on ${SMTP_HOST}:${port}`);

const info = await t.sendMail({
  from: `"${process.env.LEAD_FROM_NAME || "Artors"}" <${process.env.LEAD_FROM_EMAIL || SMTP_USER}>`,
  to,
  subject: "Artors SMTP test",
  text: "If you are reading this, the site can send mail as ai@artors.in.",
});
console.log(`✓ sent to ${to} — ${info.messageId}`);
process.exit(0);
