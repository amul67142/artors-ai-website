/** Primary navigation. Site map: docs/PLAN.md §4. */

export type NavItem = {
  label: string;
  href: string;
  /** Renders the diagonal arrow. Reserved for the final, action item. */
  arrow?: boolean;
};

export const navItems = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact", arrow: true },
] satisfies NavItem[];
