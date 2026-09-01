/**
 * /pricing — scope-first, no published numbers.
 *
 * Changed 2026-08-27 on Vedansh's instruction: the indicative "from" bands
 * are gone and every practice now routes to a consultation call instead.
 *
 * Note for whoever reads this next: docs/PLAN.md §2.4 argues the opposite —
 * "risk reversal, made structural … no hidden pricing" — because a new agency
 * with no case studies buys trust by being unusually concrete. This is a
 * deliberate reversal of that, not an oversight. Do not restore the bands
 * without asking. What the reversal costs is a visitor's ability to
 * self-qualify, so the copy below works harder to say what drives cost and
 * what the first commitment actually is.
 */

export const pricing = {
  label: "Pricing",
  statement: "Start small. Prove the result. Then scale.",
  intro:
    "You shouldn't have to bet big to find out whether this works. Every engagement starts with a scoped pilot: one system, one outcome, a fixed price, a clean exit if it isn't paying. Once it is, we scale it.",

  principles: [
    {
      title: "Pilot first",
      text: "A fixed-price first system with a defined outcome. You see the result before you commit further.",
    },
    {
      title: "Priced by what it runs, not by hours",
      text: "A one-off automation is a build and a handover. An always-on agent has to hold live conversations, sit inside your systems and keep working after launch — so it costs several times more. That gap is the difference between something we build once and something we run.",
    },
    {
      title: "Itemised scope",
      text: "Every quote lists what is built, what it costs, and what it should move. Fixed price, agreed before anything starts. No surprises, no bloated retainer.",
    },
  ],

  practicesLabel: "What we scope on the call",
  practicesNote:
    "Cost depends on the systems it touches, the volume it handles, and whether we run it after launch. Thirty minutes on a call is enough to size it properly — you leave with an itemised number whether or not you go ahead.",

  cta: { label: "Book a Consultation Call", href: "/contact" },

  /** Ordered to match docs/SERVICES.md; each maps to a pillar page. */
  practices: [
    { slug: "ai-application-development", note: "Scoped to the product" },
    { slug: "business-process-automation", note: "Scoped per workflow" },
    { slug: "ai-agents", note: "Scoped per agent" },
    { slug: "conversational-ai", note: "Setup plus a monthly run cost" },
    { slug: "marketing-growth", note: "Monthly engagement" },
    { slug: "content-video", note: "Per video or per month" },
    { slug: "consulting", note: "Per workshop or month" },
  ],
} as const;
