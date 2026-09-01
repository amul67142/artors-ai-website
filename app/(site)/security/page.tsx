import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { security } from "@/lib/content/security";
import { company } from "@/lib/content/company";
import s from "@/app/pages.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/security" },
  title: "Security & data handling | Artors",
  description:
    "Where your data sits, who can reach it, our position on the DPDP Act, what happens to call recordings, and what you take with you if we part ways.",
};

export default function SecurityPage() {
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>{security.label}</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {security.statement}
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {security.intro}
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <ol className={s.rows}>
            {security.sections.map((section, i) => (
              <li
                key={section.heading}
                className={`${s.row} float-in`}
                style={{ "--i": Math.min(i, 3) } as React.CSSProperties}
              >
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className={s.rowTitle}>{section.heading}</h2>
                  {section.body.map((para) => (
                    <p key={para.slice(0, 40)} className={s.rowText}>
                      {para}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <div className="float-in" style={{ marginTop: 44 }}>
            <p className={s.closing} style={{ marginTop: 0, marginBottom: 24 }}>
              {security.closing}
            </p>
            <p className={s.note} style={{ marginTop: 0, marginBottom: 24 }}>
              Security contact:{" "}
              <a href={`mailto:${company.email}`} className={s.inlineLink}>
                {company.email}
              </a>
            </p>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
