import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import { trail } from "@/lib/seo/breadcrumbs";
import { getInsights } from "@/lib/content/db";
import { readingMinutes } from "@/lib/markdown";
import s from "@/app/pages.module.css";
import i from "./insights.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/insights" },
  title: "Insights | Artors",
  description:
    "Practical writing on AI automation for Indian businesses — what the terms mean, what the systems cost you to run, and how to tell a real use case from a demo.",
};

function formatDate(d: Date | string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function InsightsPage() {
  const posts = await getInsights();

  return (
    <main id="main">
      <JsonLd schema={trail({ name: "Insights", path: "/insights" })} />

      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>Insights</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            What we have learned building this.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            No trend pieces. What the terms actually mean, what these systems cost to run,
            and how to tell a real use case from a demo.
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          {posts.length === 0 ? (
            <p className={s.note}>Nothing published yet.</p>
          ) : (
            <ul className={i.list}>
              {posts.map((post) => (
                <li key={post.id} className={`${i.item} float-in`}>
                  <Link href={`/insights/${post.slug}`} className={i.link}>
                    <span className={i.meta}>
                      {[formatDate(post.publishedAt), `${readingMinutes(post.body)} min read`]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                    <span className={i.title}>{post.title}</span>
                    {post.excerpt && <span className={i.excerpt}>{post.excerpt}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="float-in" style={{ marginTop: 48 }}>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
