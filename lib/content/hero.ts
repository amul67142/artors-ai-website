/**
 * Hero copy and the sample-run ledger.
 * Copy source of truth: docs/COPY.md §1.
 */

/**
 * A run of sub-headline copy. `em` lifts the phrase to full ink and 700,
 * so the paragraph can be skimmed on the key phrases alone before it is
 * read as a sentence.
 */
export type SubSegment = { text: string; em?: boolean };

export const hero = {
  eyebrow: "AI Agency · Gurugram",

  /** Setup line — quiet in tone, but full ink. */
  headlineSetup: "We're not here to impress you with AI.",
  /** Payoff — display size, uppercase, carries the gradient. */
  headlinePayoff: "We're here to grow your numbers.",

  /**
   * Emphasis is rationed to five phrases: who we are, the three outcomes
   * (kept parallel so they read as a triad), and the industry-agnostic
   * promise. Everything else stays muted connective tissue.
   */
  sub: [
    { text: "Artors builds AI systems", em: true },
    { text: " that " },
    { text: "add revenue", em: true },
    { text: ", " },
    { text: "remove cost", em: true },
    { text: ", and " },
    { text: "give your team back its hours", em: true },
    { text: " — across sales, operations, marketing and support. " },
    { text: "Whatever your industry", em: true },
    { text: ", we start with the number you want moved, then build the system that moves it." },
  ] satisfies SubSegment[],

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
  /** Which system did it — shows the stack working together, not one bot. */
  channel: string;
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
    {
      time: "09:42:07",
      event: "Inbound call",
      detail: "answered in 1.2s",
      channel: "Voice",
    },
    {
      time: "09:42:41",
      event: "Caller identified",
      detail: "returning patient",
      channel: "CRM",
    },
    {
      time: "09:43:02",
      event: "Intent captured",
      detail: "reschedule appointment",
      channel: "Voice",
    },
    {
      time: "09:43:20",
      event: "Slot offered",
      detail: "Tue 16:30",
      channel: "Calendar",
    },
    {
      time: "09:43:31",
      event: "Appointment booked",
      detail: "confirmed on WhatsApp",
      channel: "WhatsApp",
      highlight: true,
    },
    {
      time: "09:43:32",
      event: "CRM updated",
      detail: "record closed",
      channel: "CRM",
    },
  ] satisfies LedgerRow[],

  summary: ["6 steps", "85 seconds", "0 human minutes"],
} as const;
