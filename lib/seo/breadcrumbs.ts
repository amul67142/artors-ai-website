import { breadcrumbSchema } from "@/lib/schema";

/** Home is always the first crumb; callers pass the rest. */
export function trail(...crumbs: { name: string; path: string }[]) {
  return breadcrumbSchema([{ name: "Home", path: "/" }, ...crumbs]);
}
