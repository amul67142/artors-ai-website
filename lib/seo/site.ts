/**
 * Canonical origin for the site. Everything that has to emit an absolute URL —
 * metadataBase, canonicals, sitemap, JSON-LD @id — reads it from here so there
 * is exactly one place to change if the domain ever moves.
 *
 * No trailing slash. The URL convention for this site is NO trailing slash;
 * Next's default `trailingSlash: false` already enforces it with a redirect.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://artors.in").replace(
  /\/+$/,
  "",
);

/** "/pricing" -> "https://artors.in/pricing". Idempotent for absolute input. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
