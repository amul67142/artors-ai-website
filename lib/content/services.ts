/**
 * The service pillars. Source: docs/COPY.md §4, docs/SERVICES.md.
 *
 * Named in professional solution terms (application development,
 * process automation, software delivery), not channel terms — Artors
 * is a business-solutions firm, and "chatbot company" undersells it.
 */

export type Pillar = {
  index: string;
  title: string;
  href: string;
  /** One-line description in the professional register. */
  blurb: string;
  /** The result it is bought for. */
  result: string;
};

export const pillars = [
  {
    index: "01",
    title: "AI Application Development",
    href: "/services/ai-application-development",
    blurb:
      "We build and deploy custom AI features directly into your existing software and products.",
    result: "Your product gets smarter without a rebuild",
  },
  {
    index: "02",
    title: "Business Process Automation",
    href: "/services/business-process-automation",
    blurb:
      "We automate high-cost, repetitive workflows across operations, finance and support, so systems talk to each other and work runs itself.",
    result: "Operating cost down, error rate with it",
  },
  {
    index: "03",
    title: "Custom AI Agents",
    href: "/services/ai-agents",
    blurb:
      "Autonomous multi-step agents that research, draft, decide and act, with approval gates wherever judgement matters.",
    result: "A full-time role's output, on software",
  },
  {
    index: "04",
    title: "Conversational AI — Voice & Chat",
    href: "/services/conversational-ai",
    blurb:
      "AI receptionists, outbound calling, and WhatsApp and web assistants that answer, qualify and book in English, Hindi and Hinglish.",
    result: "Every enquiry handled, any hour",
  },
  {
    index: "05",
    title: "AI Marketing & Growth Systems",
    href: "/services/marketing-growth",
    blurb:
      "Lead generation, full-funnel campaigns, SEO content and social, run as one measured system.",
    result: "A predictable pipeline",
  },
  {
    index: "06",
    title: "AI Content & Video",
    href: "/services/content-video",
    blurb:
      "Brand and product video, avatar-led content, and repurposing engines that turn one asset into thirty, multilingual by default.",
    result: "A content team's output at a fraction of the cost",
  },
  {
    index: "07",
    title: "AI Consulting & Enablement",
    href: "/services/consulting",
    blurb:
      "Audits, prioritised roadmaps, corporate training and a fractional AI officer on retainer.",
    result: "Capability that stays in your business",
  },
] satisfies Pillar[];
