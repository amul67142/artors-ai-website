import type { Metadata } from "next";
import Link from "next/link";
import { Engagements } from "@/components/sections/Lower";
import { pricing } from "@/lib/content/pricing";
import { pillars } from "@/lib/content/services";
import s from "@/app/pages.module.css";

export const metadata: Metadata = {
  title: "Pricing | Artors",
  description:
    "Pilot first: one system, one outcome, a fixed price, a clean exit if it isn't paying. Indicative ranges for each practice, itemised scope after a strategy call.",
};

export default function PricingPage() {
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>{pricing.label}</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {pricing.statement}
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {pricing.intro}
          </p>
        </div>
      </section>

      <section className={s.section} aria-labelledby="principles-heading" style={{ paddingBottom: 64 }}>
        <div className="shell">
          <h2 id="principles-heading" className={`${s.sectionLabel} float-in`}>
            How we price
          </h2>
          <div className={s.cells}>
            {pricing.principles.map((p, i) => (
              <div
                key={p.title}
                className={`${s.cell} float-in`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className={s.cellNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.cellTitle}>{p.title}</span>
                <span className={s.cellText}>{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section} aria-labelledby="bands-heading" style={{ paddingTop: 0, paddingBottom: 40 }}>
        <div className="shell">
          <h2 id="bands-heading" className={`${s.sectionLabel} float-in`}>
            {pricing.bandsLabel}
          </h2>
          <ul className={s.bands}>
            {pricing.bands.map((b, i) => {
              const pillar = pillars.find((p) => p.href.endsWith(`/${b.slug}`));
              if (!pillar) return null;
              return (
                <li key={b.slug} className="float-in" style={{ "--i": Math.min(i, 3) } as React.CSSProperties}>
                  <Link href={pillar.href} className={s.band}>
                    <span className={s.bandTitle}>{pillar.title}</span>
                    <span className={s.bandFrom}>
                      {b.unit ? "from " : ""}
                      {b.from}
                    </span>
                    <span className={s.bandUnit}>{b.unit}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className={`${s.note} float-in`}>{pricing.bandsNote}</p>
        </div>
      </section>

      <Engagements />
    </main>
  );
}
