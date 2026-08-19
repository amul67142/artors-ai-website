import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { problem, leaks } from "@/lib/content/problem";
import s from "./problem.module.css";

/**
 * Section 2 — the problem, as a scroll-fill statement and a leak board.
 *
 * The statement fills word-by-word from pale to ink as the section
 * crosses the viewport (CSS scroll-driven animation; the ScrollReveal
 * idea from React Bits, without the library). The five leaks are
 * ledger-style rows: hover or focus opens the fix and the pillar link;
 * on touch the fix is simply always visible.
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

/** Parses "[bracketed]" words into accent-filled ones. */
function StatementWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((raw, i) => {
        const accent = raw.startsWith("[");
        const word = raw.replace(/[[\]]/g, "");
        return (
          <span key={i}>
            <span
              className={`${s.word} ${accent ? s.wordAccent : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {word}
            </span>
            {i < text.split(" ").length - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
}

export default function Problem() {
  return (
    <section className={s.section} aria-labelledby="problem-heading">
      <div className={`shell ${s.grid}`}>
        <div className={s.left}>
          <h2 id="problem-heading" className={s.statement}>
            <StatementWords text={problem.statement} />
          </h2>
          <p className={`t-caption ${s.callout}`}>{problem.callout}</p>
        </div>

        <div>
          <ul className={s.board}>
            {leaks.map((item, i) => (
              <li key={item.href} className={s.rowWrap}>
                <Reveal i={i}>
                  <Link href={item.href} className={s.row}>
                    <span className={s.rowHead}>
                      <span className={s.marker} aria-hidden="true" />
                      <span className={s.leak}>{item.leak}</span>
                      <span className={s.tag}>{item.tag}</span>
                    </span>
                    <span className={s.fixWrap}>
                      <span className={s.fixClip}>
                        <span className={s.fix}>
                          <Arrow className={s.fixArrow} />
                          <span>
                            <span className={s.fixLead}>Instead: </span>
                            {item.fix}
                          </span>
                        </span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal i={2}>
            <p className={`t-body ${s.closing}`}>
              <span className={s.closingEm}>
                None of it appears on a P&L as a line item.
              </span>{" "}
              All of it is costing you money.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
