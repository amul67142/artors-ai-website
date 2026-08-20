/**
 * Lead delivery adapter. The form posts here regardless of transport,
 * so email/WhatsApp (and later MySQL or a CRM) can be added without
 * touching the UI — docs/PLAN.md Phase 3.
 *
 * TODO(launch): wire real delivery. Blocked on notification email +
 * WhatsApp number (PLAN §7 open items).
 */

export type Lead = {
  name: string;
  company?: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
};

export async function deliverLead(lead: Lead): Promise<void> {
  // Placeholder transport: log to the server console so submissions
  // are visible in dev. Replace with email + WhatsApp.
  console.log("[lead]", JSON.stringify(lead));
}
