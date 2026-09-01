import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * /robots.txt — SEO-AUDIT.md Phase 1.1.
 *
 * The AI crawlers are named explicitly rather than left to the wildcard.
 * Allowing them is the whole point of the GEO work: these are the agents that
 * decide whether Artors gets cited in an AI answer, and several of them
 * (Google-Extended in particular) are opt-in in the sense that a restrictive
 * robots file silently removes you from that surface.
 *
 * Deliberately NOT here: llms.txt. No major AI search system consumes it and
 * Google has said it ignores it, so it would be cargo cult.
 */

const AI_AND_SEARCH_AGENTS = [
  "GPTBot", // OpenAI, training + browsing
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // fetches on a user's behalf during a chat
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended", // gates Gemini / AI Overviews use
  "Googlebot",
  "Bingbot", // also fronts Copilot
];

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/",
    "/admin", // the admin itself
    "/admin/", // and everything under it
    "/*?*", // query-string duplicates of canonical paths
  ];

  return {
    rules: [
      // Named agents first, so their allowance is explicit in the file rather
      // than inherited from the wildcard.
      ...AI_AND_SEARCH_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
      { userAgent: "*", allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
