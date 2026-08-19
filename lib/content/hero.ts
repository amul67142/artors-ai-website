/**
 * Hero copy and the sample-run ledger.
 * Copy source of truth: docs/COPY.md §1.
 */

export const hero = {
  eyebrow: "AI Agency · Gurugram",

  /** Setup line — quiet, sentence case. */
  headlineSetup: "We're not here to impress you with AI.",
  /** Payoff — display size, uppercase, carries the gradient. */
  headlinePayoff: "We're here to grow your numbers.",

  sub: "Artors builds AI systems that add revenue, remove cost, and give your team back its hours — across sales, operations, marketing and support. Whatever your industry, we start with the number you want moved, then build the system that moves it.",

  primaryCta: { label: "Book a Free Strategy Call", href: "/contact" },
  secondaryCta: { label: "See What We Build", href: "/services" },

  trustLine: "Gurugram-based · Working across India · Systems live in days, not months",
} as const;

export type LedgerRow = {
  /** Wall-clock stamp, rendered with tabular figures. */
  time: string;
  /** What happened. */
  event: string;
  /** The detail that makes it concrete. */
  detail: string;
  /** Marks the row the whole run exists to produce. */
  highlight?: boolean;
};

export const ledger = {
  label: "Sample run",
  subject: "Clinic receptionist",
  /** Honest framing — this is a recording, not a live feed. */
  note: "Recorded",
  href: "/work",

  rows: [
    { time: "09:42:07", event: "Inbound call", detail: "answered in 1.2s" },
    { time: "09:42:41", event: "Caller identified", detail: "returning patient" },
    { time: "09:43:02", event: "Intent captured", detail: "reschedule appointment" },
    { time: "09:43:20", event: "Slot offered", detail: "Tue 16:30" },
    {
      time: "09:43:31",
      event: "Appointment booked",
      detail: "confirmed on WhatsApp",
      highlight: true,
    },
    { time: "09:43:32", event: "CRM updated", detail: "record closed" },
  ] satisfies LedgerRow[],

  summary: ["6 steps", "85 seconds", "0 human minutes"],
} as const;
