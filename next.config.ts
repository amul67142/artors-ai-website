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
    return [
      {
        /**
         * Cap how long a CDN may hold a page document.
         *
         * Next sends `s-maxage=31536000` for statically prerendered pages,
         * assuming the CDN in front of it supports on-demand purging the way
         * Vercel's does. Hostinger's CDN honours the year and has no such
         * hook, which broke the live site on 2026-08-27: the homepage was
         * served from a three-day-old cache entry that still referenced asset
         * hashes a later deploy had deleted, so every stylesheet 404'd and the
         * site rendered as unstyled HTML.
         *
         * The same staleness would silently break the admin: publishing a
         * testimonial calls revalidatePath(), which updates the origin, but a
         * year-long edge cache means no visitor would ever see it.
         *
         * 60 seconds of shared cache with a 5-minute stale-while-revalidate
         * keeps the CDN useful while guaranteeing a deploy or a publish is
         * live within a minute. `max-age=0` keeps browsers revalidating.
         *
         * Matched on the Accept header so this only touches HTML navigations —
         * /_next/static keeps its immutable year, which is correct, because
         * those filenames are content-hashed.
         */
        source: "/:path*",
        has: [{ type: "header", key: "accept", value: "(.*text/html.*)" }],
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
          },
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
