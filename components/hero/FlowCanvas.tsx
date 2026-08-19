import { flow } from "@/lib/content/hero";
import s from "./hero.module.css";

/**
 * The hero's centerpiece: one automation drawn as the workflow it is.
 * Five nodes on a zigzag, connected by curves that carry a slow
 * travelling dash. Pure inline SVG scaled by viewBox; the only motion
 * is stroke-dashoffset, paused off-screen and under reduced motion.
 *
 * This is a diagram of real content, not a fake screenshot: the flow
 * shown is the thing the agency actually delivers.
 */

const W = 960;
const H = 240;
const NODE_W = 158;
const NODE_H = 58;

// Zigzag: high, low, high, low, high.
const xs = [10, 206, 402, 598, 794];
const ys = [30, 130, 30, 130, 30];

function connector(i: number): string {
  const x1 = xs[i] + NODE_W;
  const y1 = ys[i] + NODE_H / 2;
  const x2 = xs[i + 1];
  const y2 = ys[i + 1] + NODE_H / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

export default function FlowCanvas() {
  return (
    <figure className={s.canvasWrap}>
      <div className={s.canvasGlow} aria-hidden="true" />
      <div className={s.canvas}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className={s.flowSvg}
          role="img"
          aria-label={flow.ariaLabel}
        >
          {/* connectors under the nodes */}
          {flow.steps.slice(0, -1).map((_, i) => (
            <path key={`c${i}`} d={connector(i)} className={s.flowPath} />
          ))}
          {flow.steps.slice(0, -1).map((_, i) => (
            <path key={`p${i}`} d={connector(i)} className={s.flowPulse} />
          ))}

          {flow.steps.map((step, i) => (
            <g key={step.label}>
              <rect
                x={xs[i]}
                y={ys[i]}
                width={NODE_W}
                height={NODE_H}
                rx={13}
                className={`${s.flowNode} ${step.highlight ? s.flowNodeOn : ""}`}
              />
              <circle
                cx={xs[i] + 20}
                cy={ys[i] + NODE_H / 2}
                r={3.5}
                className={`${s.flowDot} ${step.highlight ? s.flowDotOn : ""}`}
              />
              <text
                x={xs[i] + 34}
                y={ys[i] + 25}
                className={`${s.flowLabel} ${step.highlight ? s.flowLabelOn : ""}`}
              >
                {step.label}
              </text>
              <text x={xs[i] + 34} y={ys[i] + 43} className={s.flowSub}>
                {step.sub}
              </text>
            </g>
          ))}
        </svg>

        {/* Phone version: the same flow, stacked. The SVG scales below
            legibility under ~640px, so it swaps for this list. */}
        <ol className={s.flowList} aria-hidden="true">
          {flow.steps.map((step) => (
            <li
              key={step.label}
              className={`${s.flowListRow} ${step.highlight ? s.flowListRowOn : ""}`}
            >
              <span className={s.flowListDot} aria-hidden="true" />
              <span className={s.flowListLabel}>{step.label}</span>
              <span className={s.flowListSub}>{step.sub}</span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={s.canvasCaption}>{flow.caption}</figcaption>
    </figure>
  );
}
