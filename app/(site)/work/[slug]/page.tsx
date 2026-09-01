import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import { getCaseStudies, getCaseStudy } from "@/lib/content/db";
import s from "@/app/pages.module.css";
import c from "@/components/sections/caseStudy.module.css";

/**
 * A single case study — Admin → Case studies.
 *
 * Prerendered for whatever is published at build time; anything published
 * afterwards renders on first request and is then cached, so adding a study in
 * the admin never needs a redeploy. With an empty table this generates no
 * paths at all and the route simply 404s, which is correct: docs/PLAN.md §2
 * would rather the page not exist than exist with invented content.
 */

export async function generateStaticParams() {
  const studies = await getCaseStudies();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Not found | Artors" };

  return {
    title: `${study.title} | Artors`,
    description: study.summary ?? undefined,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  const sections = [
    { heading: "The challenge", body: study.challenge },
    { heading: "What we built", body: study.solution },
    { heading: "The outcome", body: study.outcome },
  ].filter((section) => section.body);

  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>
            <Link href="/work" className={c.back}>
              Work
            </Link>
            {(study.clientName || study.industry) && (
              <span> &nbsp;/&nbsp; {[study.clientName, study.industry].filter(Boolean).join(" · ")}</span>
            )}
          </p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {study.title}
          </h1>
          {study.summary && (
            <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
              {study.summary}
            </p>
          )}
        </div>
      </section>

      {study.coverUrl && (
        <section className={c.coverSection}>
          <div className="shell">
            <div className={`${c.cover} float-in`}>
              <Image
                src={study.coverUrl}
                alt=""
                fill
                sizes="(min-width: 1200px) 1100px, 100vw"
                className={c.coverImg}
                priority
                unoptimized
              />
            </div>
          </div>
        </section>
      )}

      {Array.isArray(study.metrics) && study.metrics.length > 0 && (
        <section className={c.metricsSection}>
          <div className="shell">
            <dl className={`${c.metrics} float-in`}>
              {study.metrics.map((metric) => (
                <div key={metric.label} className={c.metric}>
                  <dt className={c.metricLabel}>{metric.label}</dt>
                  <dd className={c.metricValue}>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className={s.section} style={{ paddingTop: 0 }}>
          <div className="shell">
            {sections.map((section) => (
              <div key={section.heading} className={`${c.block} float-in`}>
                <h2 className={c.blockHeading}>{section.heading}</h2>
                <div className={c.blockBody}>
                  {section.body!.split(/\n{2,}/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className={`${c.cta} float-in`}>
            <p className={c.ctaText}>
              Want the same result measured on your numbers? We scope it on one call.
            </p>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
