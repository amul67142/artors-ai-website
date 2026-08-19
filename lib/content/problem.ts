/**
 * Section 2 — the problem. Source: docs/COPY.md §2.
 *
 * Ordering rule (see memory + COPY.md note): the back-office leak
 * leads; the missed call is the LAST example, never the first.
 */

export const problem = {
  /**
   * The statement, filled word-by-word on scroll. Words in [brackets]
   * fill to accent instead of ink.
   */
  statement: "Every business is [leaking] [money] in places nobody is watching.",

  callout:
    "Most businesses run on manual work they've stopped noticing, because it's always been that way.",

  closing:
    "None of it appears on a P&L as a line item. All of it is costing you money.",
} as const;

export type Leak = {
  /** The leak, phrased as the reader's own day. */
  leak: string;
  /** What Artors builds instead. */
  fix: string;
  /** Pillar tag, echoing the hero ledger's channel tags. */
  tag: string;
  href: string;
};

export const leaks = [
  {
    leak: "Hours lost to copy-pasting between tools that don't talk to each other.",
    fix: "We connect the stack. Data moves itself.",
    tag: "Process Automation",
    href: "/services/business-process-automation",
  },
  {
    leak: "Reports nobody has time to build, so decisions run on last month's numbers.",
    fix: "Agents that assemble your numbers overnight, every night.",
    tag: "AI Agents",
    href: "/services/ai-agents",
  },
  {
    leak: "The same content written five times for five channels.",
    fix: "One asset in, thirty pieces out, in every language you sell in.",
    tag: "Content & Video",
    href: "/services/content-video",
  },
  {
    leak: "Follow-ups that depend on someone remembering.",
    fix: "Sequences that never forget, across email, calls and WhatsApp.",
    tag: "Growth Systems",
    href: "/services/marketing-growth",
  },
  {
    leak: "Enquiries at 10 PM answered the next afternoon. Calls in the rush hour missed.",
    fix: "Answered, qualified and booked, any hour, in EN, HI or Hinglish.",
    tag: "Conversational AI",
    href: "/services/conversational-ai",
  },
] satisfies Leak[];
