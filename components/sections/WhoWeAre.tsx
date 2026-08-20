import Link from "next/link";
import { who } from "@/lib/content/about";
import s from "./who.module.css";

/**
 * Who we are — the AGR interstitial: a label, one big statement that
 * fills word-by-word on scroll, one link. Nothing else. The fill uses
 * the section's own view timeline, same signature as the problem
 * statement.
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

export default function WhoWeAre() {
  return (
    <section className={s.section} aria-labelledby="who-heading">
      <div className="shell">
        <p className={`${s.label} float-in`}>{who.label}</p>
        <h2 id="who-heading" className={s.statement}>
          <StatementWords text={who.statement} />
        </h2>
        <Link href={who.link.href} className={`${s.link} float-in`}>
          {who.link.label}
          <Arrow className={s.linkArrow} />
        </Link>
      </div>
    </section>
  );
}
