import type { FlowStep } from "./servicePages";

/**
 * Industry pages. Framed as "what this looks like in your sector",
 * never as a restriction — the index carries the door-opener line.
 * Slugs match docs/PLAN.md §4.
 */

export type IndustryRow = { title: string; text: string };

export type Industry = {
  slug: string;
  name: string;
  blurb: string;
  flowTitle: string;
  flow: FlowStep[];
  rows: IndustryRow[];
  /** Service slugs usually combined here. */
  pillars: string[];
};

export const industries: Industry[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    blurb:
      "Enquiries from portals, ads and WhatsApp qualified and booked into site visits, every visit followed up, channel partners managed, RERA answers a question away.",
    flowTitle: "A portal enquiry, qualified to a booked visit",
    flow: [
      { label: "Portal enquiry", sub: "Any source" },
      { label: "Qualified", sub: "Budget, timeline" },
      { label: "Site visit booked", sub: "Calendar", highlight: true },
      { label: "Follow-up", sub: "Day 3 · 7 · 14 · 30" },
      { label: "Dashboard", sub: "Closures predicted" },
    ],
    rows: [
      { title: "Site visits booked automatically", text: "Every enquiry answered in seconds, qualified on budget and timeline, and booked onto a rep's calendar." },
      { title: "Follow-up that actually happens", text: "Visit photos on WhatsApp, personalised email, and an AI check-in call on day 3, 7, 14 and 30." },
      { title: "Channel partners on one system", text: "Inventory and price broadcasts to brokers, a bot for their queries, commission tracked." },
    ],
    pillars: ["conversational-ai", "marketing-growth", "business-process-automation"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    blurb:
      "OPD appointments booked and reminded around the clock, routine queries answered, and a front desk that finally faces the patients in the room.",
    flowTitle: "A call at 8 PM, booked and reminded",
    flow: [
      { label: "Call at 8 PM", sub: "After hours" },
      { label: "Answered", sub: "HI · EN · Hinglish" },
      { label: "Slot booked", sub: "OPD calendar", highlight: true },
      { label: "Reminder sent", sub: "Day before" },
      { label: "No-show down", sub: "Measured" },
    ],
    rows: [
      { title: "OPD appointments, any hour", text: "Booked, confirmed and rescheduled without a human picking up." },
      { title: "Reminders that cut no-shows", text: "WhatsApp reminders the day before, with one-tap reschedule." },
      { title: "Routine queries handled", text: "Timings, directions, reports ready — answered instantly so staff aren't." },
    ],
    pillars: ["conversational-ai", "business-process-automation", "ai-agents"],
  },
  {
    slug: "retail-d2c",
    name: "Retail & D2C",
    blurb:
      "Order status, COD confirmation, returns and product questions handled automatically, and catalogue content produced at a scale no team sustains.",
    flowTitle: "An order, confirmed to delivered, untouched",
    flow: [
      { label: "Order placed", sub: "Store" },
      { label: "COD confirmed", sub: "WhatsApp", highlight: true },
      { label: "Status updates", sub: "Automatic" },
      { label: "Return handled", sub: "No ticket" },
      { label: "Catalogue content", sub: "Generated" },
    ],
    rows: [
      { title: "COD confirmed before dispatch", text: "A WhatsApp confirmation the moment an order lands, cutting RTO before it happens." },
      { title: "Returns without a queue", text: "Status, eligibility and pickup handled in conversation, escalated only when needed." },
      { title: "Catalogue at scale", text: "Descriptions, creatives and multi-language listings produced from one source." },
    ],
    pillars: ["conversational-ai", "content-video", "business-process-automation"],
  },
  {
    slug: "education",
    name: "Education",
    blurb:
      "Demo requests captured and qualified, students followed up until they enrol, and the same fifty questions answered without a counsellor.",
    flowTitle: "A demo request, followed up until enrolled",
    flow: [
      { label: "Demo request", sub: "Ad or site" },
      { label: "Qualified", sub: "Course, intent" },
      { label: "Demo booked", sub: "Calendar" },
      { label: "Follow-up", sub: "Until enrolled", highlight: true },
      { label: "Enrolled", sub: "Logged" },
    ],
    rows: [
      { title: "Demo requests qualified instantly", text: "Course, level and intent captured before a counsellor spends a minute." },
      { title: "Follow-up until enrolment", text: "Sequences across WhatsApp, call and email that don't depend on memory." },
      { title: "The same questions, answered", text: "Fees, batches, eligibility — handled automatically, escalated when it matters." },
    ],
    pillars: ["conversational-ai", "marketing-growth", "ai-agents"],
  },
  {
    slug: "hospitality-local",
    name: "Hospitality & Local Services",
    blurb:
      "Bookings taken around the clock, reminders that cut no-shows, and lapsed customers re-engaged automatically — for salons, clinics, restaurants and studios.",
    flowTitle: "A booking at midnight, confirmed and reminded",
    flow: [
      { label: "Booking request", sub: "Any hour" },
      { label: "Availability", sub: "Checked" },
      { label: "Booked", sub: "Confirmed", highlight: true },
      { label: "Reminder", sub: "Day before" },
      { label: "Re-engaged", sub: "Lapsed guests" },
    ],
    rows: [
      { title: "Bookings around the clock", text: "Taken, confirmed and rescheduled on WhatsApp and phone while you're closed." },
      { title: "No-shows cut", text: "Reminders with one-tap confirm or reschedule." },
      { title: "Lapsed customers back", text: "Automatic re-engagement with the right offer at the right interval." },
    ],
    pillars: ["conversational-ai", "marketing-growth", "business-process-automation"],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    blurb:
      "Intake, scheduling, document handling and reporting run by systems — so billable people stay billable.",
    flowTitle: "An enquiry, intake to report, no phone tag",
    flow: [
      { label: "Enquiry", sub: "Site or call" },
      { label: "Intake captured", sub: "Structured" },
      { label: "Scheduled", sub: "Calendar" },
      { label: "Documents", sub: "Handled", highlight: true },
      { label: "Report delivered", sub: "Automatic" },
    ],
    rows: [
      { title: "Intake without phone tag", text: "Details captured in conversation and filed where your team works." },
      { title: "Documents handled", text: "Collected, checked and routed with the judgement steps kept human." },
      { title: "Reporting that builds itself", text: "Status and billing summaries assembled overnight." },
    ],
    pillars: ["business-process-automation", "ai-agents", "ai-application-development"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug) ?? null;
}

export function adjacentIndustry(slug: string) {
  const i = industries.findIndex((x) => x.slug === slug);
  return {
    prev: industries[(i - 1 + industries.length) % industries.length],
    next: industries[(i + 1) % industries.length],
  };
}
