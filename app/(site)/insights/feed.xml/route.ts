import { getInsights } from "@/lib/content/db";
import { SITE_URL } from "@/lib/seo/site";
import { company } from "@/lib/content/company";

/** RSS 2.0 for /insights. Regenerated hourly alongside the sitemap. */
export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getInsights();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/insights/${post.slug}`;
      const date = (post.publishedAt ?? post.createdAt ?? new Date()).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(post.excerpt ?? post.directAnswer ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(company.name)} — Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Practical writing on AI automation for Indian businesses.</description>
    <language>en-IN</language>
    <atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
