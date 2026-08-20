import { pillars, type Pillar } from "./services";

/**
 * Per-service page content: the animated flow (how it runs inside the
 * client's business) and the benefits (what it does to their numbers).
 * Copy stays in the professional register — see memory rule.
 */

export type FlowStep = { label: string; sub: string; highlight?: boolean };
export type Benefit = { title: string; text: string };

export type ServicePage = {
  flowTitle: string;
  flow: FlowStep[];
  benefits: Benefit[];
};

export const servicePages: Record<string, ServicePage> = {
  "ai-application-development": {
    flowTitle: "An AI feature, shipped inside your product",
    flow: [
      { label: "Feature scoped", sub: "Your roadmap" },
      { label: "AI wired in", sub: "Your stack" },
      { label: "Guardrails set", sub: "Your data" },
      { label: "Shipped", sub: "Behind a flag", highlight: true },
      { label: "Adoption measured", sub: "Analytics" },
    ],
    benefits: [
      {
        title: "Smarter product, same codebase",
        text: "AI features land inside the software you already run. No rebuild, no re-platforming, no second product.",
      },
      {
        title: "Weeks, not quarters",
        text: "We ship a working feature behind a flag fast, then harden it in production against real usage.",
      },
      {
        title: "No new lock-in",
        text: "It lives in your stack, on your infrastructure, with your data staying yours.",
      },
    ],
  },

  "business-process-automation": {
    flowTitle: "One invoice, end to end, untouched",
    flow: [
      { label: "Trigger", sub: "Invoice lands" },
      { label: "Parsed", sub: "AI reads it" },
      { label: "Matched", sub: "Against PO" },
      { label: "Approved", sub: "Or flagged", highlight: true },
      { label: "Booked", sub: "In your ERP" },
    ],
    benefits: [
      {
        title: "Cost per process drops",
        text: "Work that took hours of copy-paste runs in seconds, every time, without a person in the loop.",
      },
      {
        title: "Error rate goes with it",
        text: "The system never mistypes, never skips a step, and flags anything unusual for a human.",
      },
      {
        title: "An audit trail for free",
        text: "Every step is logged as it happens. Compliance stops being a quarterly scramble.",
      },
    ],
  },

  "ai-agents": {
    flowTitle: "A weekly report, researched and written overnight",
    flow: [
      { label: "Goal set", sub: "Weekly report" },
      { label: "Research", sub: "Across your tools" },
      { label: "Drafted", sub: "Agent writes" },
      { label: "Approved", sub: "Human gate", highlight: true },
      { label: "Delivered", sub: "6 AM inbox" },
    ],
    benefits: [
      {
        title: "A full-time role's output",
        text: "Research, drafting, chasing and compiling — the work of a whole position, run on software.",
      },
      {
        title: "It works while you sleep",
        text: "Agents run overnight and across weekends, so mornings start with finished work.",
      },
      {
        title: "You keep the judgement",
        text: "Approval gates on anything sensitive. The agent does the labour; your people make the calls.",
      },
    ],
  },

  "conversational-ai": {
    flowTitle: "One enquiry, answered to booked, any hour",
    flow: [
      { label: "Enquiry in", sub: "Call or WhatsApp" },
      { label: "Answered", sub: "EN · HI · Hinglish" },
      { label: "Qualified", sub: "Budget, intent" },
      { label: "Booked", sub: "Calendar", highlight: true },
      { label: "Logged", sub: "CRM" },
    ],
    benefits: [
      {
        title: "Zero missed enquiries",
        text: "Every call answered and every message replied to — at 2 AM, on festivals, in the rush hour.",
      },
      {
        title: "Your front desk, freed",
        text: "The repetitive eighty percent is handled; your people take the conversations that need them.",
      },
      {
        title: "Every conversation on record",
        text: "Qualified, booked and logged into your CRM automatically, with transcripts to learn from.",
      },
    ],
  },

  "marketing-growth": {
    flowTitle: "A pipeline that fills itself, measurably",
    flow: [
      { label: "Audience built", sub: "Scraped, enriched" },
      { label: "Outreach", sub: "Personalised" },
      { label: "Follow-up", sub: "Multi-channel" },
      { label: "Qualified", sub: "Handed over", highlight: true },
      { label: "Reported", sub: "Weekly" },
    ],
    benefits: [
      {
        title: "Predictable pipeline",
        text: "A steady flow of qualified conversations instead of a good month followed by a bad one.",
      },
      {
        title: "Acquisition cost falls",
        text: "AI does the volume — lists, personalisation, follow-up — while a human holds the strategy.",
      },
      {
        title: "One measured system",
        text: "Ads, outreach, content and follow-up report into one number you can actually manage.",
      },
    ],
  },

  "content-video": {
    flowTitle: "One asset in, thirty pieces out",
    flow: [
      { label: "One asset in", sub: "Podcast, shoot" },
      { label: "Cut", sub: "Clips, captions" },
      { label: "Multiplied", sub: "30 pieces", highlight: true },
      { label: "Localised", sub: "5+ languages" },
      { label: "Published", sub: "On schedule" },
    ],
    benefits: [
      {
        title: "A content team's output",
        text: "Video, clips, carousels and posts at a volume no in-house team sustains, for a fraction of the cost.",
      },
      {
        title: "Every channel fed",
        text: "Reels, Shorts, LinkedIn, YouTube and your site, each getting the format it wants.",
      },
      {
        title: "Your voice, held",
        text: "Trained on your brand and reviewed by a human before anything ships.",
      },
    ],
  },

  consulting: {
    flowTitle: "From audit to a capability you own",
    flow: [
      { label: "Audit", sub: "Where AI pays" },
      { label: "Roadmap", sub: "12 months" },
      { label: "Pilot", sub: "Proof first", highlight: true },
      { label: "Training", sub: "Your team" },
      { label: "Capability", sub: "Stays in-house" },
    ],
    benefits: [
      {
        title: "No wasted spend",
        text: "A prioritised roadmap of where AI actually pays in your business — before you buy anything.",
      },
      {
        title: "Your team, upskilled",
        text: "Hands-on training on real tools for real roles, with prompts and playbooks they keep.",
      },
      {
        title: "Capability that stays",
        text: "When the engagement ends, the systems, skills and roadmap remain yours.",
      },
    ],
  },
};

export function getServicePage(slug: string) {
  const pillar = pillars.find((p) => p.href.endsWith(`/${slug}`));
  const page = servicePages[slug];
  if (!pillar || !page) return null;
  return { pillar, page };
}

export function serviceSlugs(): string[] {
  return pillars.map((p) => p.href.split("/").pop() as string);
}

export function adjacent(slug: string): { prev: Pillar; next: Pillar } {
  const i = pillars.findIndex((p) => p.href.endsWith(`/${slug}`));
  const prev = pillars[(i - 1 + pillars.length) % pillars.length];
  const next = pillars[(i + 1) % pillars.length];
  return { prev, next };
}
