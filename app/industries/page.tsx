import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { industries } from "@/lib/content/industries";
import s from "@/app/pages.module.css";

export const metadata: Metadata = {
  title: "Industries | Artors",
  description:
    "What AI systems look like in real estate, healthcare, retail, education, hospitality and professional services. Illustrations of the work, not restrictions on it.",
};

export default function IndustriesIndex() {
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>Industries</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            Built for any business with work that shouldn't need a human.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            The systems are industry-agnostic. What changes is the workflow, the vocabulary and
            the regulations. Here is what the work looks like in sectors we know well.
          </p>
        </div>
      </section>

      <section className={s.section} aria-label="Sectors">
        <div className="shell">
          <div className={s.cells}>
            {industries.map((ind, i) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className={`${s.cell} float-in`}
                style={{ "--i": i % 3 } as React.CSSProperties}
              >
                <span className={s.cellNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.cellTitle}>{ind.name}</span>
                <span className={s.cellText}>{ind.rows[0].title}</span>
              </Link>
            ))}
          </div>

          <p className={`${s.closing} float-in`}>
            Don&apos;t see your industry? That&apos;s not a problem. We start every engagement by
            mapping your actual workflow, not by reaching for a template.
          </p>
          <div className="float-in" style={{ marginTop: 28 }}>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
