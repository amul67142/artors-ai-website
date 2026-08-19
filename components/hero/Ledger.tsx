import Link from "next/link";
import { ledger } from "@/lib/content/hero";
import s from "./hero.module.css";

/**
 * A timestamped record of one automation run.
 *
 * It is labelled as a recording rather than a live feed on purpose —
 * Artors has no clients yet, and inventing live activity would be the
 * same lie as inventing a testimonial (docs/PLAN.md §2). The panel links
 * to /work, where the same run is published in full.
 *
 * Server Component. The looping animation is CSS; InViewGate only pauses it.
 */
export default function Ledger() {
  return (
    <figure className={s.ledgerWrap} style={{ margin: 0 }}>
      <Link href={ledger.href} className={s.ledger} aria-label="See the full sample run">
        <div className={s.ledgerHead}>
          <p className={s.ledgerLabel}>
            {ledger.label} — {ledger.note}
          </p>
          <p className={s.ledgerSubject}>{ledger.subject}</p>
        </div>

        <ol className={s.rows}>
          {ledger.rows.map((row, i) => (
            <li
              key={row.time}
              className={`${s.row} ${row.highlight ? s.rowHighlight : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className={s.time}>{row.time}</span>
              <span className={s.event}>{row.event}</span>
              <span className={s.detail}>{row.detail}</span>
            </li>
          ))}
        </ol>

        <div className={s.summary}>
          {ledger.summary.map((item) => (
            <span key={item} className={s.summaryItem}>
              {item}
            </span>
          ))}
        </div>
      </Link>

      <figcaption className={`t-caption ${s.caption}`}>
        A real run of one of our systems, start to finish. No human touched it.
      </figcaption>
    </figure>
  );
}
