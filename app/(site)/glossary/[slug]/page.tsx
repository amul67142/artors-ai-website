import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import ArticleBody from "@/components/content/ArticleBody";
import FaqBlock from "@/components/content/FaqBlock";
import Button from "@/components/ui/Button";
import { faqSchema } from "@/lib/schema";
import { trail } from "@/lib/seo/breadcrumbs";
import { absoluteUrl } from "@/lib/seo/site";
import { getGlossary, getGlossaryTerm } from "@/lib/content/db";
import { pillars } from "@/lib/content/services";
import s from "@/app/pages.module.css";
import a from "@/app/(site)/insights/[slug]/article.module.css";

/**
 * One glossary term.
 *
 * These are the highest-yield pages on the site for AI citation: a question
 * with a crisp, self-contained answer is exactly what assistants quote. The
 * H1 is phrased as the question people actually type, and the definition is
 * written to survive being lifted out of the page on its own.
 */

export async function generateStaticParams() {
  return (await getGlossary()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTerm(slug);
  if (!term) return { title: "Not found | Artors" };

  return {
    title: `What is ${term.term}? | Artors`,
    description: term.definition.slice(0, 155),
    alternates: { canonical: `/glossary/${slug}` },
  };
}

export default async function GlossaryTermPage({ params }: PageProps<"/glossary/[slug]">) {
  const { slug } = await params;
  const term = await getGlossaryTerm(slug);
  if (!term) notFound();

  const all = await getGlossary();
  const relatedSlugs = (term.relatedTerms ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const related = all.filter((t) => relatedSlugs.includes(t.slug));
  const service = term.relatedService
    ? pillars.find((p) => p.href.endsWith("/" + term.relatedService))
    : undefined;

  return (
    <main id="main">
      <JsonLd
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.term,
            description: term.definition,
            url: absoluteUrl(`/glossary/${slug}`),
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "Artors AI Glossary",
              url: absoluteUrl("/glossary"),
            },
          },
          faqSchema(term.faq ?? []),
          trail(
            { name: "Glossary", path: "/glossary" },
            { name: term.term, path: `/glossary/${slug}` },
          ),
        ]}
      />

      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>
            <Link href="/glossary" className={a.back}>
              Glossary
            </Link>
          </p>
          <h1 className={`${a.title} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            What is {term.term}?
          </h1>
          {/* The definition doubles as the direct-answer block — one sentence
              that has to survive being quoted on its own. */}
          <p className={`${a.lede} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {term.definition}
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <ArticleBody markdown={term.body}>
            <FaqBlock items={term.faq} />

            {(related.length > 0 || service) && (
              <section className={a.related}>
                <h2 className={a.relatedHeading}>Related</h2>
                <ul className={a.relatedList}>
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link href={`/glossary/${r.slug}`} className={a.relatedLink}>
                        {r.term}
                      </Link>
                    </li>
                  ))}
                  {service && (
                    <li>
                      <Link href={service.href} className={a.relatedLink}>
                        {service.title}
                      </Link>
                    </li>
                  )}
                </ul>
              </section>
            )}

            <div className={a.cta}>
              <p className={a.ctaText}>
                Wondering whether this applies to your business? That is a thirty-minute
                call, not a research project.
              </p>
              <Button href="/contact" label="Book a Consultation Call" arrow />
            </div>
          </ArticleBody>
        </div>
      </section>
    </main>
  );
}
