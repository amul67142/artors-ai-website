import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import { trail } from "@/lib/seo/breadcrumbs";
import { tools } from "@/lib/content/tools";
import s from "@/app/pages.module.css";
import t from "./tools.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/tools" },
  title: "Free Calculators | Artors",
  description:
    "Free calculators for Indian businesses: what unanswered calls cost you each month, and what a manual process costs you each year. No sign-up, nothing stored.",
};

export default function ToolsPage() {
  return (
    <main id="main">
      <JsonLd schema={trail({ name: "Tools", path: "/tools" })} />

      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>Tools</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            Put a number on it first.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            Two calculators for the decisions that usually get made on instinct. No sign-up, no
            email gate, nothing stored — the maths runs in your browser.
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <ul className={t.list}>
            {tools.map((tool, i) => (
              <li
                key={tool.slug}
                className={`${t.item} float-in`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Link href={`/tools/${tool.slug}`} className={t.link}>
                  <span className={t.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className={t.title}>{tool.title}</span>
                    <span className={t.desc}>{tool.metaDescription}</span>
                  </span>
                  <svg className={t.arrow} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d="M3 11L11 3M11 3H4M11 3v7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          <div className="float-in" style={{ marginTop: 48 }}>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
