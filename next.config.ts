import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
