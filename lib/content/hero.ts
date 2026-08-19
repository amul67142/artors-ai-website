/**
 * Hero copy and the demo call.
 * Copy source of truth: docs/COPY.md §1.
 */

export type SubSegment = { text: string; em?: boolean };

export const hero = {
  headlineSetup: "We're not here to impress you with AI.",
  headlinePayoff: "We're here to grow your numbers.",

  /** One sentence, under twenty words. The stage above does the talking. */
  sub: [
    { text: "A full-service AI agency. We build the systems that " },
    { text: "answer, book, follow up, and report", em: true },
    { text: ". Your numbers move." },
  ] satisfies SubSegment[],

  primaryCta: { label: "Book a Free Strategy Call", href: "/contact" },
  secondaryCta: { label: "See What We Build", href: "/services" },
} as const;

export type CallLine = {
  speaker: "caller" | "agent";
  text: string;
  /** The outcome line: holds longest and carries the gradient. */
  final?: boolean;
};

/**
 * The demo call. Labelled as a recorded demonstration on purpose:
 * Artors has no clients yet, and a fake "live" feed would be the same
 * lie as a fake testimonial (docs/PLAN.md §2). What it proves instead
 * is the thing no competitor can fake on a static page: the visitor
 * watches a booking happen, end to end, in the first ten seconds.
 */
export const call = {
  label: "Recorded demo call",
  sublabel: "Answered by our voice agent",

  lines: [
    { speaker: "caller", text: "Hi, I need to move my appointment to next week." },
    { speaker: "agent", text: "Of course. You're with Dr. Mehra, Thursday at five. Which day suits you?" },
    { speaker: "caller", text: "Tuesday evening, if that's possible." },
    { speaker: "agent", text: "Tuesday 4:30 is open. Shall I book it?" },
    { speaker: "caller", text: "Yes, perfect." },
    {
      speaker: "agent",
      text: "Done. Tuesday 4:30. The confirmation is on your WhatsApp.",
      final: true,
    },
  ] satisfies CallLine[],

  /** What the system did while the caller was still on the line. */
  confirmations: ["Calendar updated", "WhatsApp sent", "CRM logged"],

  /** Accessible summary of the whole loop, for screen readers. */
  srSummary:
    "A recorded demo call: a caller asks to move an appointment. The Artors voice agent finds the booking, offers Tuesday 4:30, books it, and sends a WhatsApp confirmation. Calendar, WhatsApp and CRM are all updated during the call, with no human involved.",
} as const;
