/**
 * Content for the lower page sections. Source: docs/COPY.md §5–§10
 * and docs/PLAN.md §2 (trust layer). Copy stays short by design.
 */

export const proof = {
  label: "Proof",
  statement: "Artors is new. So instead of a logo wall, watch a system work.",
  items: [
    { num: "01", title: "The recording", note: "A full call, unedited" },
    { num: "02", title: "The transcript", note: "Every turn, timestamped" },
    { num: "03", title: "The workflow", note: "The n8n build behind it" },
  ],
  closing: "This site runs on the systems we sell. Case study zero.",
  link: { label: "See the full run", href: "/work" },
} as const;

export const process = {
  heading: "Flow",
  intro: "How we turn one strategy call into a system that runs the work itself.",
  metaLeft: { k: "Process", v: "4 steps" },
  metaRight: { k: "Duration", v: "Days, not months" },
  steps: [
    {
      title: "Map",
      text: "We find where money and hours leak, and what pays back first.",
      pct: 25,
    },
    {
      title: "Build",
      text: "Your system, trained on your business, tested on real scenarios.",
      pct: 50,
    },
    {
      title: "Launch",
      text: "Live in days. Every call, action and booking logged.",
      pct: 75,
    },
    {
      title: "Scale",
      text: "We stay on it and expand what works. An outcome, not a handoff.",
      pct: 100,
    },
  ],
} as const;

export const industries = {
  label: "Industries",
  intro: "Illustrations of the work, not restrictions on it.",
  items: [
    { name: "Real Estate", note: "Site visits booked, partners managed" },
    { name: "Healthcare", note: "OPD booked, front desk unburied" },
    { name: "Retail & D2C", note: "Orders, returns, catalogue at scale" },
    { name: "Education", note: "Demos captured, students enrolled" },
    { name: "Hospitality", note: "Bookings around the clock" },
    { name: "Professional Services", note: "Billable people stay billable" },
  ],
  closing:
    "Don't see your industry? We start from your workflow, not a template.",
} as const;

export const engagements = {
  label: "How to engage",
  intro: "Two ways to work with us. Tell us your goal and we scope it.",
  options: [
    {
      title: "Pilot Project",
      tag: "Start here",
      points: [
        "One system, one outcome",
        "Fixed price, clear scope",
        "Live in days",
        "Clean exit if it isn't paying",
      ],
      cta: { label: "Scope a Pilot", href: "/contact" },
    },
    {
      title: "Monthly Partnership",
      tag: "For scale",
      points: [
        "Ongoing build and optimisation",
        "Across all seven practices",
        "Priority turnaround",
        "Direct line, no ticket queue",
      ],
      cta: { label: "Start a Partnership", href: "/contact" },
    },
  ],
} as const;

export const faq = {
  label: "FAQ",
  items: [
    {
      q: "How fast can we go live?",
      a: "Most systems are live within days. We start with a focused pilot so you see results quickly, then expand.",
    },
    {
      q: "Do you only do voice agents and chatbots?",
      a: "No. Much of our work is behind the scenes: process automation, custom agents, content engines, and the reporting that shows what is actually happening.",
    },
    {
      q: "Do your systems work in Hindi and Hinglish?",
      a: "Yes. Voice and chat handle English, Hindi and Hinglish, tested on real Indian accents and phone audio.",
    },
    {
      q: "Will this replace my staff?",
      a: "It frees them. AI takes the repetitive, high-volume work so your people do the work that needs a human.",
    },
    {
      q: "Do you work with my industry?",
      a: "Almost certainly. The systems are industry-agnostic; what changes is the workflow and vocabulary. If we are not the right fit, we say so on the first call.",
    },
    {
      q: "How much does it cost?",
      a: "It depends on the outcome you want. Book a strategy call and you get a clear, itemised scope. No surprises.",
    },
  ],
} as const;

export const ctaBand = {
  headline: "Every day without this is money left on the table.",
  sub: "Book a free strategy call. We show you exactly where you're losing revenue, time and margin.",
  cta: { label: "Book My Free Strategy Call", href: "/contact" },
} as const;
