import Image from "next/image";
import Link from "next/link";
import { getCaseStudies } from "@/lib/content/db";
import s from "./caseStudies.module.css";

/**
 * Published case studies on /work — managed in Admin → Case studies.
 *
 * docs/PLAN.md §2.1 designed /work so real case studies drop into the same URL
 * as the worked sample "without a redesign". This is that slot: while there
 * are none the section is absent and the worked sample carries the page alone;
 * the first published study makes it appear above the sample, and the sample
 * stays as supporting depth rather than being thrown away.
 */

export default async function CaseStudies() {
  const studies = await getCaseStudies();
  if (studies.length === 0) return null;

  return (
    <section className={s.section} aria-labelledby="cases-heading">
      <div className="shell">
        <h2 id="cases-heading" className={`${s.sectionLabel} float-in`}>
          Case studies
        </h2>

        <ul className={s.list}>
          {studies.map((study) => (
            <li key={study.id} className={`${s.item} float-in`}>
              <Link href={`/work/${study.slug}`} className={s.link}>
                {study.coverUrl && (
                  <span className={s.cover}>
                    <Image
                      src={study.coverUrl}
                      alt=""
                      fill
                      sizes="(min-width: 810px) 380px, 100vw"
                      className={s.coverImg}
                      unoptimized
                    />
                  </span>
                )}

                <span className={s.body}>
                  {(study.clientName || study.industry) && (
                    <span className={s.meta}>
                      {[study.clientName, study.industry].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  <span className={s.title}>{study.title}</span>
                  {study.summary && <span className={s.summary}>{study.summary}</span>}

                  {Array.isArray(study.metrics) && study.metrics.length > 0 && (
                    <span className={s.metrics}>
                      {study.metrics.map((m) => (
                        <span key={m.label} className={s.metric}>
                          <span className={s.metricValue}>{m.value}</span>
                          <span className={s.metricLabel}>{m.label}</span>
                        </span>
                      ))}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
