import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import { trail } from "@/lib/seo/breadcrumbs";
import { getGlossary } from "@/lib/content/db";
import s from "@/app/pages.module.css";
import g from "./glossary.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/glossary" },
  title: "AI Glossary | Artors",
  description:
    "Plain definitions of the AI automation terms that come up in real projects — agents, RAG, intent recognition, workflow automation — written for business owners, not engineers.",
};

export default async function GlossaryPage() {
  const terms = await getGlossary();

  // Alphabetical groups, so the index scans like a reference rather than a list.
  const groups = new Map<string, typeof terms>();
  for (const term of terms) {
    const letter = term.term[0]?.toUpperCase() ?? "#";
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(term);
  }

  return (
    <main id="main">
      <JsonLd schema={trail({ name: "Glossary", path: "/glossary" })} />

      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>Glossary</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            The words, without the sales pitch.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            Every term here comes up in real projects. Definitions are written for the person
            paying for the system, not the person building it.
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          {terms.length === 0 ? (
            <p className={s.note}>Nothing published yet.</p>
          ) : (
            [...groups.entries()].map(([letter, items]) => (
              <div key={letter} className={`${g.group} float-in`}>
                <p className={g.letter} aria-hidden="true">
                  {letter}
                </p>
                <ul className={g.list}>
                  {items.map((term) => (
                    <li key={term.id} className={g.item}>
                      <Link href={`/glossary/${term.slug}`} className={g.link}>
                        <span className={g.term}>{term.term}</span>
                        <span className={g.definition}>{term.definition}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}

          <div className="float-in" style={{ marginTop: 48 }}>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
