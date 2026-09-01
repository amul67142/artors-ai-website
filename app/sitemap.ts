import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { pillars } from "@/lib/content/services";
import { industries } from "@/lib/content/industries";
import { getCaseStudies, getInsights, getGlossary } from "@/lib/content/db";
import { tools } from "@/lib/content/tools";

/**
 * /sitemap.xml — SEO-AUDIT.md Phase 1.2.
 *
 * Sources, in order of authority:
 *   - static routes, listed here
 *   - service and industry pillars, from the same typed content files the
 *     pages themselves render from, so the sitemap cannot drift from reality
 *   - published case studies, from the database
 *
 * Only published rows appear: getCaseStudies() already filters on published,
 * which is the same guarantee the public pages rely on. Drafts, /admin and the
 * API are absent by construction rather than by exclusion rules.
 *
 * If the database is unreachable the static entries still ship — a partial
 * sitemap is worth far more than a 500, and getCaseStudies() returns [] rather
 * than throwing.
 *
 * Revisit as a sitemap index past ~200 URLs. Currently ~20.
 */

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] =
  [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work", priority: 0.8, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/tools", priority: 0.8, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" },
    { path: "/glossary", priority: 0.7, changeFrequency: "monthly" },
    { path: "/security", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.9, changeFrequency: "yearly" },
  ];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // One timestamp for everything without a real modification date. Using
  // "now" per entry would tell crawlers the whole site changes on every
  // request, which is a lie that costs crawl budget.
  const buildTime = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path === "/" ? "" : route.path}`,
    lastModified: buildTime,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const pillar of pillars) {
    entries.push({
      url: `${SITE_URL}${pillar.href}`,
      lastModified: buildTime,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const industry of industries) {
    entries.push({
      url: `${SITE_URL}/industries/${industry.slug}`,
      lastModified: buildTime,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Real lastModified here, because these rows carry updated_at.
  const caseStudies = await getCaseStudies();
  for (const study of caseStudies) {
    entries.push({
      url: `${SITE_URL}/work/${study.slug}`,
      lastModified: study.updatedAt ?? study.createdAt ?? buildTime,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Insights carry a real publish date, which is the lastModified crawlers
  // actually use to decide whether to refetch.
  for (const post of await getInsights()) {
    entries.push({
      url: `${SITE_URL}/insights/${post.slug}`,
      lastModified: post.updatedAt ?? post.publishedAt ?? buildTime,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const term of await getGlossary()) {
    entries.push({
      url: `${SITE_URL}/glossary/${term.slug}`,
      lastModified: term.updatedAt ?? buildTime,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Calculators change only when the code does, so the build time is their
  // real lastModified.
  for (const tool of tools) {
    entries.push({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: buildTime,
      changeFrequency: "yearly",
      priority: 0.8,
    });
  }

  return entries;
}
