/**
 * /pricing — pilot-first framing with indicative "from" bands drawn from
 * docs/SERVICES.md (internal catalogue). Bands are the lowest entry in
 * each pillar; every engagement is scoped to the outcome.
 */

export const pricing = {
  label: "Pricing",
  statement: "Start small. Prove the result. Then scale.",
  intro:
    "You shouldn't have to bet big to find out whether this works. Every engagement starts with a scoped pilot: one system, one outcome, a fixed price, a clean exit if it isn't paying. Once it is, we scale it.",

  bandsLabel: "Indicative ranges",
  bandsNote:
    "Starting points, not quotes. A strategy call ends with a clear, itemised scope for your business.",
  bands: [
    { slug: "ai-application-development", from: "Scoped per engagement", unit: "" },
    { slug: "business-process-automation", from: "₹35,000", unit: "per project" },
    { slug: "ai-agents", from: "₹1,50,000", unit: "per agent" },
    { slug: "conversational-ai", from: "₹35,000", unit: "setup + monthly" },
    { slug: "marketing-growth", from: "₹35,000", unit: "per month" },
    { slug: "content-video", from: "₹8,000", unit: "per video" },
    { slug: "consulting", from: "₹1,00,000", unit: "per workshop or month" },
  ],

  principles: [
    { title: "Pilot first", text: "A fixed-price first system with a defined outcome. You see the result before you commit further." },
    { title: "No bloated retainers", text: "Ongoing partnerships cover real build and optimisation work, not a standing fee for presence." },
    { title: "Itemised scope", text: "Every quote lists what is built, what it costs, and what it should move. No surprises." },
  ],
} as const;
