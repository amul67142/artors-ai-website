import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import ServiceFlow from "@/components/services/ServiceFlow";
import LeadForm from "@/components/lead/LeadForm";
import { getServicePage, serviceSlugs, adjacent } from "@/lib/content/servicePages";
import l from "@/components/lead/lead.module.css";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema } from "@/lib/schema";
import { trail } from "@/lib/seo/breadcrumbs";
import s from "./servicePage.module.css";

export function generateStaticParams() {
  return serviceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getServicePage(slug);
  if (!data) return {};
  return {
    title: `${data.pillar.title} | Artors`,
    description: data.pillar.blurb,
    alternates: { canonical: `/services/${slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getServicePage(slug);
  if (!data) notFound();
  const { pillar, page } = data;
  const { prev, next } = adjacent(slug);

  return (
    <main id="main">
      <JsonLd
        schema={[
          serviceSchema({
            name: pillar.title,
            description: pillar.blurb,
            path: `/services/${slug}`,
          }),
          trail(
            { name: "Services", path: "/services" },
            { name: pillar.title, path: `/services/${slug}` },
          ),
        ]}
      />
      {/* ---- head ---- */}
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.kicker} enter`}>
            <Link href="/services" className={s.kickerLink}>
              Services
            </Link>
            <span className={s.kickerNum}>{pillar.index} / 07</span>
          </p>
          <h1 className={`${s.title} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {pillar.title}
          </h1>
          <p className={`${s.blurb} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {pillar.blurb}
          </p>
          <div className={`${s.ctas} enter`} style={{ "--i": 3 } as React.CSSProperties}>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>

      {/* ---- the flow ---- */}
      <section className={s.flow} aria-label="How it runs">
        <div className="shell">
          <div className="float-in">
            <ServiceFlow
              steps={page.flow}
              title={page.flowTitle}
              ariaLabel={`${pillar.title}: ${page.flow.map((f) => f.label).join(", ")}.`}
            />
          </div>
        </div>
      </section>

      {/* ---- benefits ---- */}
      <section className={s.benefits} aria-labelledby="benefits-heading">
        <div className="shell">
          <h2 id="benefits-heading" className={`${s.sectionLabel} float-in`}>
            What it does for your business
          </h2>
          <div className={s.benefitGrid}>
            {page.benefits.map((b, i) => (
              <div
                key={b.title}
                className={`${s.benefitCell} float-in`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={s.benefitNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={s.benefitTitle}>{b.title}</h3>
                <p className={s.benefitText}>{b.text}</p>
              </div>
            ))}
          </div>

          <div className={`${s.deliverables} float-in`}>
            <p className={s.delLabel}>In the box</p>
            <div className={s.delItems}>
              {pillar.items.map((item) => (
                <span key={item} className={s.delItem}>
                  {item}
                </span>
              ))}
            </div>
            <p className={s.result}>{pillar.result}.</p>
          </div>
        </div>
      </section>

      {/* ---- lead form ---- */}
      <section className={l.embed} aria-labelledby="lead-heading">
        <div className={`shell ${l.embedGrid}`}>
          <div className="float-in">
            <p className={l.kicker}>Free strategy call</p>
            <h2 id="lead-heading" className={l.embedTitle}>
              Scope this for your business.
            </h2>
            <p className={l.embedText}>
              Tell us what you run and what you want moved. We reply within a
              day with a clear, itemised next step.
            </p>
          </div>
          <div className="float-in">
            <LeadForm presetService={pillar.title} />
          </div>
        </div>
      </section>

      {/* ---- prev / next ---- */}
      <nav className={s.pager} aria-label="More services">
        <div className={`shell ${s.pagerRow}`}>
          <Link href={prev.href} className={s.pagerLink}>
            <span className={s.pagerDir}>← Previous</span>
            <span className={s.pagerTitle}>{prev.title}</span>
          </Link>
          <Link href={next.href} className={`${s.pagerLink} ${s.pagerRight}`}>
            <span className={s.pagerDir}>Next →</span>
            <span className={s.pagerTitle}>{next.title}</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
