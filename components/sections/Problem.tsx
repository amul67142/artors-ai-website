import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { problem, leaks } from "@/lib/content/problem";
import s from "./problem.module.css";

/**
 * Section 2 — the problem, in the AGR section grammar: label + count,
 * a scroll-fill statement, one caption line, then index rows carrying
 * 2–4 words each. The sentence lives only in the hover reveal.
 *
 * The statement fill is a CSS scroll-driven animation on a named view
 * timeline — no JS, no scroll listener. Browsers without
 * animation-timeline see the statement in full ink.
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
  const parts = text.split(" ");
  return (
    <>
      {parts.map((raw, i) => {
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
            {i < parts.length - 1 ? " " : null}
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
          <p className={s.labelRow}>
            <span>{problem.label}</span>
            <span className={s.count}>({leaks.length})</span>
          </p>
          <h2 id="problem-heading" className={s.statement}>
            <StatementWords text={problem.statement} />
          </h2>
          <p className={`t-caption ${s.caption}`}>{problem.caption}</p>
        </div>

        <ul className={s.board}>
          {leaks.map((item, i) => (
            <li key={item.href} className={s.rowWrap}>
              <Reveal i={i}>
                <Link href={item.href} className={s.row}>
                  <span className={s.rowHead}>
                    <span className={s.num}>{item.num}</span>
                    <span className={s.title}>{item.title}</span>
                    <span className={s.tag}>{item.tag}</span>
                  </span>
                  <span className={s.fixWrap}>
                    <span className={s.fixClip}>
                      <span className={s.fix}>
                        <Arrow className={s.fixArrow} />
                        {item.fix}
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
