import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /**
       * The two URLs the SEO brief named that this site does not use.
       *
       * Decisions recorded in SEO-AUDIT.md §2.4 and §2.5:
       *
       *   /security-and-data — the page exists at /security and is written
       *     rather than placeholdered. Shorter, already linked from the footer
       *     and already in the sitemap; renaming it would cost the URL its
       *     history for no gain.
       *
       *   /case-studies — case studies live at /work/[slug] by design
       *     (docs/PLAN.md §2.1), so real ones drop into the same URL as the
       *     worked sample without a redesign. Publishing both would put two
       *     URLs in front of one subject and split the ranking between them.
       *
       * Redirected rather than left to 404 because the brief named them, so
       * they may already appear in a proposal or a document somewhere. A 301
       * costs nothing and passes any link equity to the page that exists.
       */
      { source: "/security-and-data", destination: "/security", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/case-studies/:slug", destination: "/work/:slug", permanent: true },
    ];
  },

  async headers() {
    /**
     * Cache-Control, ordered least to most specific — a later rule wins.
     *
     * Next sends `s-maxage=31536000` for prerendered pages, assuming a CDN
     * that purges on deploy. Hostinger's honours the full year and has no such
     * hook, which served a three-day-old homepage referencing deleted asset
     * hashes on 2026-08-27 and rendered the site unstyled.
     *
     * The first fix gated the override on an Accept header containing
     * text/html. That was wrong, and the live site proved it on 2026-09-01:
     * requests sending a wildcard Accept header — which many crawlers
     * fell through to the year-long default. Whichever request happens to
     * populate the CDN entry decides what the CDN honours, so a single crawler
     * could re-pin the site for a year. Google was being served a seven-day-old
     * homepage with no canonical and no structured data.
     *
     * Matching on the path instead removes the guesswork: everything is
     * short-cached, then the genuinely immutable things opt back out below.
     */
    return [
      {
        // Everything. 60s at the edge, 5 minutes of stale-while-revalidate.
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        // Content-hashed filenames — safe to keep for a year, and expensive
        // not to.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Uploaded media keys are random and never reused (lib/storage).
        source: "/api/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // The admin must never be cached anywhere, by anyone.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
