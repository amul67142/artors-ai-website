/**
 * Hero copy. Source of truth: docs/COPY.md §1.
 */

export type SubSegment = { text: string; em?: boolean };

export const hero = {
  badge: "AI systems, live in days",

  headlineSetup: "We're not here to impress you with AI.",
  headlinePayoff: "We're here to grow your numbers.",

  sub: [
    { text: "A full-service AI agency. We build the systems that " },
    { text: "answer, book, follow up, and report", em: true },
    { text: ". Your numbers move." },
  ] satisfies SubSegment[],

  primaryCta: { label: "Book a Free Strategy Call", href: "/contact" },
  secondaryCta: { label: "See What We Build", href: "/services" },
} as const;

/**
 * The flow canvas: one of our systems, drawn as the workflow it is.
 * This is the deliverable an automation agency actually ships, so it
 * reads as product rather than decoration.
 */
export type FlowStep = { label: string; sub: string; highlight?: boolean };

export const flow = {
  caption: "One of our systems, end to end. No human in the loop.",
  ariaLabel:
    "Workflow diagram: a call comes in, the AI answers and qualifies, a slot is booked, WhatsApp confirms it, and the CRM is updated.",
  steps: [
    { label: "Call comes in", sub: "Any hour" },
    { label: "AI answers", sub: "EN · HI · Hinglish" },
    { label: "Slot booked", sub: "Calendar", highlight: true },
    { label: "WhatsApp confirms", sub: "Instant" },
    { label: "CRM updated", sub: "Logged" },
  ] satisfies FlowStep[],
} as const;
