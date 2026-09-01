import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import ServiceFlow from "@/components/services/ServiceFlow";
import LeadForm from "@/components/lead/LeadForm";
import { industries, getIndustry, adjacentIndustry } from "@/lib/content/industries";
import { pillars } from "@/lib/content/services";
import l from "@/components/lead/lead.module.css";
import s from "@/app/pages.module.css";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) return {};
  return {
    title: `AI Systems for ${ind.name} | Artors`,
    description: ind.blurb,
    alternates: { canonical: `/industries/${slug}` },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const { prev, next } = adjacentIndustry(slug);
  const linked = pillars.filter((p) => ind.pillars.some((ps) => p.href.endsWith(`/${ps}`)));

  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>
            <Link href="/industries" style={{ color: "inherit", textDecoration: "none" }}>
              Industries
            </Link>
          </p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            AI systems for {ind.name}.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {ind.blurb}
          </p>
          <div className="enter" style={{ "--i": 3, marginTop: 32 } as React.CSSProperties}>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>

      <section className={s.section} aria-label="How it runs" style={{ paddingBottom: 96 }}>
        <div className="shell">
          <div className="float-in">
            <ServiceFlow
              steps={ind.flow}
              title={ind.flowTitle}
              ariaLabel={`${ind.name}: ${ind.flow.map((f) => f.label).join(", ")}.`}
            />
          </div>
        </div>
      </section>

      <section className={s.section} aria-labelledby="looks-heading" style={{ paddingTop: 0 }}>
        <div className="shell">
          <h2 id="looks-heading" className={`${s.sectionLabel} float-in`}>
            What it looks like in your sector
          </h2>
          <ol className={s.rows}>
            {ind.rows.map((row, i) => (
              <li
                key={row.title}
                className={`${s.row} float-in`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={s.rowTitle}>{row.title}</h3>
                  <p className={s.rowText}>{row.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="float-in" style={{ marginTop: 40 }}>
            <p className={s.sectionLabel} style={{ marginBottom: 16 }}>
              Practices we usually combine here
            </p>
            <div className={s.pills}>
              {linked.map((p) => (
                <Link key={p.href} href={p.href} className={s.pill}>
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={l.embed} aria-labelledby="lead-heading">
        <div className={`shell ${l.embedGrid}`}>
          <div className="float-in">
            <p className={l.kicker}>Free strategy call</p>
            <h2 id="lead-heading" className={l.embedTitle}>
              Map this to your {ind.name.toLowerCase()} business.
            </h2>
            <p className={l.embedText}>
              Tell us what you run and what you want moved. We reply within a day with a clear,
              itemised next step.
            </p>
          </div>
          <div className="float-in">
            <LeadForm />
          </div>
        </div>
      </section>

      <nav className={s.pager} aria-label="More industries">
        <div className={`shell ${s.pagerRow}`}>
          <Link href={`/industries/${prev.slug}`} className={s.pagerLink}>
            <span className={s.pagerDir}>← Previous</span>
            <span className={s.pagerTitle}>{prev.name}</span>
          </Link>
          <Link href={`/industries/${next.slug}`} className={`${s.pagerLink} ${s.pagerRight}`}>
            <span className={s.pagerDir}>Next →</span>
            <span className={s.pagerTitle}>{next.name}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
