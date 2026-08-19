/**
 * Hero copy. Source of truth: docs/COPY.md §1.
 */

export type SubSegment = { text: string; em?: boolean };

export const hero = {
  headlineSetup: "We're not here to impress you with AI.",
  headlinePayoff: "We're here to grow your numbers.",

  /** One sentence, under twenty words. */
  sub: [
    { text: "A full-service AI agency. We build the systems that " },
    { text: "answer, book, follow up, and report", em: true },
    { text: ". Your numbers move." },
  ] satisfies SubSegment[],

  primaryCta: { label: "Book a Free Strategy Call", href: "/contact" },
  secondaryCta: { label: "See What We Build", href: "/services" },
} as const;

/**
 * The practice, as real links along the hero's base. Short labels on
 * purpose: the row must hold one line on desktop.
 */
export const heroLinks = [
  { label: "Automation", href: "/services/ai-automation" },
  { label: "Voice Agents", href: "/services/voice-agents" },
  { label: "Chatbots", href: "/services/chatbots" },
  { label: "Marketing", href: "/services/marketing-growth" },
  { label: "Content & Video", href: "/services/content-video" },
  { label: "Consulting", href: "/services/consulting-training" },
] as const;
