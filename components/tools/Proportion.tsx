"use client";

import c from "./calculator.module.css";

/**
 * A single hairline bar showing one share of a whole.
 *
 * Informative rather than decorative: on the missed-call calculator it shows
 * how much of the phone line is going unanswered, which is the thing the money
 * figure abstracts away. Seeing a fifth of the bar filled lands differently
 * from reading "20%".
 *
 * Animated with a CSS transform on scaleX — never width — so it composites on
 * the GPU and never triggers layout. docs/DESIGN.md: transform and opacity
 * only.
 */
export default function Proportion({
  value,
  label,
  caption,
}: {
  /** 0–100. */
  value: number;
  label: string;
  caption: string;
}) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={c.proportion}>
      <div className={c.proportionHead}>
        <span className={c.proportionLabel}>{label}</span>
        <span className={c.proportionValue}>{Math.round(pct)}%</span>
      </div>
      <div
        className={c.track}
        role="img"
        aria-label={`${label}: ${Math.round(pct)} per cent`}
      >
        <span className={c.fill} style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <p className={c.proportionCaption}>{caption}</p>
    </div>
  );
}
