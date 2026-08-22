import type { FlowStep } from "@/lib/content/servicePages";
import s from "./serviceFlow.module.css";

/**
 * The animated flow diagram on every service page: five nodes on a
 * zigzag inside a soft panel, connectors carrying a slow travelling
 * dash — the work visibly moving through the client's business. Pure
 * SVG scaled by viewBox; the dash is the only motion, CSS-driven.
 * Below 640px the SVG drops below legibility and swaps for a stacked
 * list of the same steps.
 */

const NODE_H = 58;
const GAP = 30;
const TEXT_X = 34; // dot + breathing room before the label
const PAD_R = 18;

/**
 * Nodes size to their text. SVG text can't be measured at render time
 * on the server, so widths come from a per-glyph estimate for Inter:
 * measured in-browser at ~0.57em/0.58em, padded to 0.63/0.64 so every
 * label and sub on every page clears the box with room; the viewBox
 * grows to fit and the SVG scales.
 */
function nodeWidth(step: FlowStep): number {
  const label = step.label.length * 14.5 * 0.63;
  const sub = step.sub.length * 11.5 * 0.64;
  return Math.max(150, Math.ceil(TEXT_X + Math.max(label, sub) + PAD_R));
}

function layout(steps: readonly FlowStep[]) {
  const widths = steps.map(nodeWidth);
  const xs: number[] = [];
  let x = 6;
  for (const w of widths) {
    xs.push(x);
    x += w + GAP;
  }
  const ys = steps.map((_, i) => (i % 2 === 0 ? 28 : 128));
  return { widths, xs, ys, W: x - GAP + 6 };
}

function connector(xs: number[], ys: number[], widths: number[], i: number): string {
  const x1 = xs[i] + widths[i];
  const y1 = ys[i] + NODE_H / 2;
  const x2 = xs[i + 1];
  const y2 = ys[i + 1] + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export default function ServiceFlow({
  steps,
  title,
  ariaLabel,
}: {
  steps: readonly FlowStep[];
  title: string;
  ariaLabel: string;
}) {
  const { widths, xs, ys, W } = layout(steps);
  return (
    <figure className={s.wrap}>
      <div className={s.glow} aria-hidden="true" />
      <div className={s.canvas}>
        <svg viewBox={`0 0 ${W} 216`} className={s.svg} role="img" aria-label={ariaLabel}>
          {steps.slice(0, -1).map((_, i) => (
            <path key={`c${i}`} d={connector(xs, ys, widths, i)} className={s.path} />
          ))}
          {steps.slice(0, -1).map((_, i) => (
            <path key={`p${i}`} d={connector(xs, ys, widths, i)} className={s.pulse} />
          ))}
          {steps.map((step, i) => (
            <g key={step.label}>
              <rect
                x={xs[i]}
                y={ys[i]}
                width={widths[i]}
                height={NODE_H}
                rx={13}
                className={`${s.node} ${step.highlight ? s.nodeOn : ""}`}
              />
              <circle
                cx={xs[i] + 20}
                cy={ys[i] + NODE_H / 2}
                r={3.5}
                className={`${s.dot} ${step.highlight ? s.dotOn : ""}`}
              />
              <text
                x={xs[i] + 34}
                y={ys[i] + 25}
                className={`${s.labelText} ${step.highlight ? s.labelOn : ""}`}
              >
                {step.label}
              </text>
              <text x={xs[i] + 34} y={ys[i] + 43} className={s.subText}>
                {step.sub}
              </text>
            </g>
          ))}
        </svg>

        <ol className={s.list} aria-hidden="true">
          {steps.map((step) => (
            <li key={step.label} className={`${s.listRow} ${step.highlight ? s.listRowOn : ""}`}>
              <span className={s.listDot} aria-hidden="true" />
              <span className={s.listLabel}>{step.label}</span>
              <span className={s.listSub}>{step.sub}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={s.caption}>{title}</figcaption>
    </figure>
  );
}
