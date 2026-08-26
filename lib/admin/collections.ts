/**
 * Collection specs — the single description of every editable content type.
 *
 * Client-safe: no drizzle, no zod, no server imports. The admin UI renders
 * forms and tables from these specs, and lib/admin/registry.ts maps the same
 * keys to tables and validation on the server. Adding a field means editing
 * one object, not five files.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "number"
  | "bool"
  | "select"
  | "image"
  | "metrics";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
};

export type CollectionKey = "clients" | "caseStudies" | "testimonials" | "team";

export type CollectionSpec = {
  key: CollectionKey;
  href: string;
  title: string;
  singular: string;
  blurb: string;
  /** Field names shown as table columns, in order. */
  columns: string[];
  fields: Field[];
};

const PUBLISH_FIELDS: Field[] = [
  {
    name: "sortOrder",
    label: "Sort order",
    type: "number",
    help: "Lower numbers appear first.",
  },
  {
    name: "published",
    label: "Published",
    type: "bool",
    help: "Off means it exists here but appears nowhere on the site.",
  },
];

export const COLLECTIONS: Record<CollectionKey, CollectionSpec> = {
  clients: {
    key: "clients",
    href: "/admin/clients",
    title: "Logos",
    singular: "Logo",
    blurb:
      "The strip under the hero. A logo may only be marked Client if Artors has an actual engagement with them — otherwise it is an Integration.",
    columns: ["name", "kind", "published"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      {
        name: "kind",
        label: "Kind",
        type: "select",
        required: true,
        options: [
          { value: "integration", label: "Integration — a tool we build with" },
          { value: "client", label: "Client — we have a real engagement" },
        ],
        help: "Showing a company as a client without an engagement is a legal liability, not a design choice.",
      },
      { name: "logoUrl", label: "Logo", type: "image" },
      { name: "websiteUrl", label: "Website", type: "url", placeholder: "https://" },
      ...PUBLISH_FIELDS,
    ],
  },

  caseStudies: {
    key: "caseStudies",
    href: "/admin/case-studies",
    title: "Case studies",
    singular: "Case study",
    blurb:
      "Real engagements only. /work shows the worked sample until the first case study is published here, then shows both.",
    columns: ["title", "clientName", "industry", "published"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        required: true,
        placeholder: "missed-calls-real-estate",
        help: "Used in the URL. Lowercase, hyphens, no spaces.",
      },
      { name: "clientName", label: "Client", type: "text" },
      { name: "industry", label: "Industry", type: "text" },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        help: "One or two sentences, shown on the index.",
      },
      { name: "challenge", label: "Challenge", type: "textarea" },
      { name: "solution", label: "What we built", type: "textarea" },
      { name: "outcome", label: "Outcome", type: "textarea" },
      {
        name: "metrics",
        label: "Metrics",
        type: "metrics",
        help: "Measured results only. An invented number is worse than no number.",
      },
      { name: "coverUrl", label: "Cover image", type: "image" },
      ...PUBLISH_FIELDS,
    ],
  },

  testimonials: {
    key: "testimonials",
    href: "/admin/testimonials",
    title: "Testimonials",
    singular: "Testimonial",
    blurb:
      "Only words a real person actually said, attributed to them by name. The section is hidden on the site while this is empty.",
    columns: ["authorName", "company", "published"],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", required: true },
      { name: "authorName", label: "Author", type: "text", required: true },
      { name: "authorRole", label: "Role", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "avatarUrl", label: "Photo", type: "image" },
      ...PUBLISH_FIELDS,
    ],
  },

  team: {
    key: "team",
    href: "/admin/team",
    title: "Founders & team",
    singular: "Person",
    blurb: "Named humans with real photos. An anonymous agency in this category reads as a scam.",
    columns: ["name", "role", "isFounder", "published"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", placeholder: "Founder" },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photoUrl", label: "Photo", type: "image" },
      { name: "linkedinUrl", label: "LinkedIn", type: "url", placeholder: "https://" },
      { name: "email", label: "Email", type: "email" },
      { name: "isFounder", label: "Founder", type: "bool" },
      ...PUBLISH_FIELDS,
    ],
  },
};

export const COLLECTION_LIST = Object.values(COLLECTIONS);
