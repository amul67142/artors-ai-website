import Link from "next/link";
import Button from "@/components/ui/Button";
import { proof, process, industries, engagements, faq, ctaBand } from "@/lib/content/sections";
import s from "./more.module.css";

/**
 * The lower page: proof, process, industries, engagements, FAQ, and
 * the CTA band — each in the AGR section grammar (label, one line,
 * index structure), each floating in on its own view timeline. One
 * interactive element per section, nothing looping.
 */

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11L11 3M11 3H4M11 3v7" />
    </svg>
  );
}

export function Proof() {
  return (
    <section className={s.proof} aria-labelledby="proof-heading">
      <div className="shell">
        <div className="float-in">
          <h2 id="proof-heading" className={s.sectionLabel}>
            {proof.label}
          </h2>
          <p className={s.proofStatement}>{proof.statement}</p>
        </div>

        <div className={s.proofGrid}>
          {proof.items.map((item, i) => (
            <Link
              key={item.num}
              href={proof.link.href}
              className={`${s.proofCell} float-in`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className={s.proofNum}>{item.num}</span>
              <span className={s.proofTitle}>{item.title}</span>
              <span className={s.proofNote}>{item.note}</span>
            </Link>
          ))}
        </div>

        <div className={`${s.proofFoot} float-in`}>
          <p className={s.proofClosing}>{proof.closing}</p>
          <Link href={proof.link.href} className={s.inlineLink}>
            {proof.link.label}
            <Arrow className={s.inlineArrow} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className={s.process} aria-labelledby="process-heading">
      <div className="shell">
        <div className={`${s.processHead} float-in`}>
          <h2 id="process-heading" className={s.sectionLabel}>
            {process.label}
          </h2>
          <div className={s.processMeta}>
            {process.meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* The fill draws left to right as the section scrolls through. */}
        <div className={s.track} aria-hidden="true">
          <div className={s.trackFill} />
        </div>

        <ol className={s.steps}>
          {process.steps.map((step, i) => (
            <li
              key={step.num}
              className="float-in"
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className={s.stepPct}>{step.pct}</span>
              <span className={s.stepTitle}>{step.title}</span>
              <p className={s.stepText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section className={s.industries} aria-labelledby="industries-heading">
      <div className="shell">
        <div className="float-in">
          <h2 id="industries-heading" className={s.sectionLabel}>
            {industries.label}
          </h2>
          <p className={s.intro}>{industries.intro}</p>
        </div>

        <div className={s.indGrid}>
          {industries.items.map((item, i) => (
            <div
              key={item.name}
              className={`${s.indCell} float-in`}
              style={{ "--i": i % 3 } as React.CSSProperties}
            >
              <h3 className={s.indName}>{item.name}</h3>
              <p className={s.indNote}>{item.note}</p>
            </div>
          ))}
        </div>

        <p className={`${s.indClosing} float-in`}>{industries.closing}</p>
      </div>
    </section>
  );
}

export function Engagements() {
  return (
    <section className={s.engage} aria-labelledby="engage-heading">
      <div className="shell">
        <div className="float-in">
          <h2 id="engage-heading" className={s.sectionLabel}>
            {engagements.label}
          </h2>
          <p className={s.intro}>{engagements.intro}</p>
        </div>

        <div className={s.engGrid}>
          {engagements.options.map((opt, i) => (
            <div
              key={opt.title}
              className={`${s.engCol} float-in`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className={s.engTag}>{opt.tag}</span>
              <h3 className={s.engTitle}>{opt.title}</h3>
              <ul className={s.engPoints}>
                {opt.points.map((p) => (
                  <li key={p} className={s.engPoint}>
                    {p}
                  </li>
                ))}
              </ul>
              <Button href={opt.cta.href} label={opt.cta.label} variant={i === 0 ? "primary" : "ghost"} arrow={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className={s.faq} aria-labelledby="faq-heading">
      <div className="shell">
        <h2 id="faq-heading" className={`${s.sectionLabel} float-in`}>
          {faq.label}
        </h2>

        <div className={s.faqList}>
          {faq.items.map((item, i) => (
            <details key={item.q} className={s.faqItem}>
              <summary className={s.faqQ}>
                <span className={s.faqNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.faqText}>{item.q}</span>
                <span className={s.faqIcon} aria-hidden="true" />
              </summary>
              <p className={s.faqA}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className={s.band} aria-labelledby="cta-heading">
      <div className="shell">
        <h2 id="cta-heading" className={`${s.bandHeadline} float-in`}>
          Every day without this is{" "}
          <span className={s.bandAccent}>money left on the table.</span>
        </h2>
        <p className={`${s.bandSub} float-in`}>{ctaBand.sub}</p>
        <div className="float-in">
          <Button href={ctaBand.cta.href} label={ctaBand.cta.label} variant="invert" arrow />
        </div>
      </div>
    </section>
  );
}
