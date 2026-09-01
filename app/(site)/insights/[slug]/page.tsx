import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import Prose from "@/components/content/Prose";
import FaqBlock from "@/components/content/FaqBlock";
import Button from "@/components/ui/Button";
import { articleSchema, faqSchema } from "@/lib/schema";
import { trail } from "@/lib/seo/breadcrumbs";
import { getInsight, getInsights, getTeam } from "@/lib/content/db";
import { readingMinutes } from "@/lib/markdown";
import s from "@/app/pages.module.css";
import a from "./article.module.css";

/**
 * One insight. Section 3 of the SEO brief, in order: direct answer under the
 * H1, body, FAQ, author and dates, related links, one CTA.
 */

export async function generateStaticParams() {
  return (await getInsights()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) return { title: "Not found | Artors" };

  return {
    title: `${post.title} | Artors`,
    description: post.excerpt ?? post.directAnswer?.slice(0, 155) ?? undefined,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
    },
  };
}

function formatDate(d: Date | string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InsightPage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const post = await getInsight(slug);
  if (!post) notFound();

  // Author falls back to the founder, so a post never publishes anonymously.
  const team = await getTeam();
  const author =
    team.find((p) => p.name === post.authorName) ?? team.find((p) => p.isFounder) ?? null;
  const authorName = post.authorName ?? author?.name ?? null;

  const others = (await getInsights()).filter((p) => p.slug !== slug).slice(0, 3);
  const published = formatDate(post.publishedAt);
  const updated =
    post.updatedAt && post.publishedAt &&
    new Date(post.updatedAt).toDateString() !== new Date(post.publishedAt).toDateString()
      ? formatDate(post.updatedAt)
      : null;

  return (
    <main id="main">
      <JsonLd
        schema={[
          articleSchema({
            headline: post.title,
            description: post.excerpt,
            path: `/insights/${slug}`,
            datePublished: post.publishedAt,
            dateModified: post.updatedAt,
            image: post.coverUrl,
            authors: author ? [author] : [],
          }),
          faqSchema(post.faq ?? []),
          trail(
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${slug}` },
          ),
        ]}
      />

      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>
            <Link href="/insights" className={a.back}>
              Insights
            </Link>
          </p>
          <h1 className={`${a.title} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {post.title}
          </h1>

          {/* The direct-answer block: the passage AI search extracts. */}
          {post.directAnswer && (
            <p className={`${a.lede} enter`} style={{ "--i": 2 } as React.CSSProperties}>
              {post.directAnswer}
            </p>
          )}

          <p className={`${a.byline} enter`} style={{ "--i": 3 } as React.CSSProperties}>
            {[
              authorName && `By ${authorName}`,
              published && `Published ${published}`,
              updated && `Updated ${updated}`,
              `${readingMinutes(post.body)} min read`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <Prose markdown={post.body} />

          <FaqBlock items={post.faq} />

          {others.length > 0 && (
            <section className={a.related}>
              <h2 className={a.relatedHeading}>More insights</h2>
              <ul className={a.relatedList}>
                {others.map((other) => (
                  <li key={other.id}>
                    <Link href={`/insights/${other.slug}`} className={a.relatedLink}>
                      {other.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className={a.cta}>
            <p className={a.ctaText}>
              Want this working on your numbers rather than in an article? We scope it on one
              call.
            </p>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
