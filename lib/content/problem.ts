/**
 * Section 2 — the problem. Source: docs/COPY.md §2.
 * Register: AGR section grammar — label + count, one-line context,
 * then index rows that carry 2–4 words each. The sentence lives in
 * the hover reveal, nowhere else.
 *
 * Ordering rule (memory + COPY.md): back-office leaks lead; the
 * missed call is the LAST example, never the first.
 */

export const problem = {
  label: "The problem",

  /**
   * The statement, filled word-by-word on scroll. Words in [brackets]
   * fill to accent instead of ink.
   */
  statement: "Every business is [leaking] [money] in places nobody is watching.",

  /** One line. The P&L line won over the longer callout. */
  caption: "None of it shows up on a P&L. All of it costs you money.",
} as const;

export type Leak = {
  num: string;
  /** 2–4 words, set uppercase. The title IS the leak. */
  title: string;
  /** The fix, one short line, revealed on hover. */
  fix: string;
  /** Pillar tag, echoing the hero ledger's channel tags. */
  tag: string;
  href: string;
};

export const leaks = [
  {
    num: "01",
    title: "Copy-paste operations",
    fix: "We connect the stack. Data moves itself.",
    tag: "Process Automation",
    href: "/services/business-process-automation",
  },
  {
    num: "02",
    title: "Reports nobody builds",
    fix: "Your numbers, assembled overnight.",
    tag: "AI Agents",
    href: "/services/ai-agents",
  },
  {
    num: "03",
    title: "Content written five times",
    fix: "One asset in, thirty out, every language.",
    tag: "Content & Video",
    href: "/services/content-video",
  },
  {
    num: "04",
    title: "Forgotten follow-ups",
    fix: "Sequences that never forget.",
    tag: "Growth Systems",
    href: "/services/marketing-growth",
  },
  {
    num: "05",
    title: "Calls after hours",
    fix: "Answered, qualified and booked, any hour.",
    tag: "Conversational AI",
    href: "/services/conversational-ai",
  },
] satisfies Leak[];
