import { Fragment } from "react";
import Link from "next/link";
import { hero, ledger } from "@/lib/content/hero";
import v from "./variants.module.css";

/** Word-level mask reveal, shared by every variant. */
export function RisingWords({
  text,
  offset = 0,
  gradient = false,
}: {
  text: string;
  offset?: number;
  gradient?: boolean;
}) {
  const words = text.split(" ");
  const last = Math.max(words.length - 1, 1);

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="rise-mask"
            style={
              {
                "--i": i + offset,
                ...(gradient ? { "--p": i / last } : {}),
              } as React.CSSProperties
            }
          >
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** The sub-headline with its three emphasised outcomes. */
export function Sub({ className }: { className?: string }) {
  return (
    <p className={`t-lead ${v.sub} ${className ?? ""}`}>
      {hero.sub.map((seg, i) =>
        seg.em ? (
          <strong key={i} className={v.subEm}>
            {seg.text}
          </strong>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </p>
  );
}

/**
 * Variant A's run: the same five steps flattened onto a single rule,
 * so the panel stops competing with the headline for attention.
 */
export function LedgerStrip() {
  return (
    <Link href={ledger.href} className={v.strip} aria-label="See the full sample run">
      <div className={v.stripHead}>
        <span className={v.stripLabel}>
          {ledger.label} — {ledger.note}
        </span>
        <span className={v.stripLabel}>{ledger.summary.join(" · ")}</span>
      </div>
      <div className={v.stripSteps}>
        {ledger.rows.map((row) => (
          <div
            key={row.time}
            className={`${v.stripStep} ${row.highlight ? v.stripStepOn : ""}`}
          >
            <span className={v.stripEvent}>{row.event}</span>
            <span className={v.stripChannel}>{row.channel}</span>
          </div>
        ))}
      </div>
    </Link>
  );
}
