/** The six service pillars. Source: docs/COPY.md §4. */

export type Pillar = {
  index: string;
  title: string;
  href: string;
  /** One-line result, used where the index needs a second column. */
  result: string;
};

export const pillars = [
  {
    index: "01",
    title: "AI Automation & Custom Agents",
    href: "/services/ai-automation",
    result: "Manual work eliminated",
  },
  {
    index: "02",
    title: "AI Voice Agents",
    href: "/services/voice-agents",
    result: "Every call answered",
  },
  {
    index: "03",
    title: "Chatbots for WhatsApp & Web",
    href: "/services/chatbots",
    result: "Instant reply, any hour",
  },
  {
    index: "04",
    title: "AI Marketing & Growth",
    href: "/services/marketing-growth",
    result: "A predictable pipeline",
  },
  {
    index: "05",
    title: "AI Content & Video",
    href: "/services/content-video",
    result: "A content team's output",
  },
  {
    index: "06",
    title: "AI Consulting & Training",
    href: "/services/consulting-training",
    result: "Capability that stays",
  },
] satisfies Pillar[];

/** Small status facts for the console rail. */
export const statusRail = [
  { label: "Status", value: "Operating" },
  { label: "Base", value: "Gurugram, India" },
  { label: "Languages", value: "EN · HI · Hinglish" },
  { label: "Time to live", value: "Days" },
] as const;

/** The four results, for the banded layout. */
export const outcomes = [
  { title: "Revenue up", note: "More of the demand you already pay to create." },
  { title: "Cost down", note: "The same output with far less manual work." },
  { title: "Hours back", note: "People on the work only people can do." },
  { title: "Live in days", note: "Pilot first, measured from day one." },
] as const;
