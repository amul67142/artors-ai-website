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

const W = 960;
const NODE_W = 168;
const NODE_H = 58;
const xs = [6, 200, 394, 588, 782];
const ys = [28, 128, 28, 128, 28];

function connector(i: number): string {
  const x1 = xs[i] + NODE_W;
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
  return (
    <figure className={s.wrap}>
      <div className={s.glow} aria-hidden="true" />
      <div className={s.canvas}>
        <svg viewBox={`0 0 ${W} 216`} className={s.svg} role="img" aria-label={ariaLabel}>
          {steps.slice(0, -1).map((_, i) => (
            <path key={`c${i}`} d={connector(i)} className={s.path} />
          ))}
          {steps.slice(0, -1).map((_, i) => (
            <path key={`p${i}`} d={connector(i)} className={s.pulse} />
          ))}
          {steps.map((step, i) => (
            <g key={step.label}>
              <rect
                x={xs[i]}
                y={ys[i]}
                width={NODE_W}
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
