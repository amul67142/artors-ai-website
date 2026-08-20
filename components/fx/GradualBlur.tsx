/**
 * Gradual blur — the React Bits GradualBlur idea, dependency-free.
 *
 * A fixed strip at the bottom of the viewport built from stacked
 * backdrop-filter layers, each masked to a band and blurring harder
 * than the last, so content dissolves progressively off the page
 * edge instead of hitting a hard line.
 *
 * Styles are inline on purpose: the CSS pipeline strips
 * backdrop-filter from module files (see Header). pointer-events is
 * none throughout, so it never intercepts a click. Static effect —
 * no motion, so no reduced-motion counterpart is needed.
 */

const LAYERS = [0.5, 1, 2, 3.5, 6, 10];

export default function GradualBlur() {
  const seg = 100 / (LAYERS.length + 1);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: "clamp(72px, 12vh, 128px)",
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      {LAYERS.map((blur, i) => {
        const start = Math.max(0, (i - 1) * seg);
        const mid1 = i * seg;
        const mid2 = (i + 1) * seg;
        const end = Math.min(100, (i + 2) * seg);
        const mask = `linear-gradient(to bottom, transparent ${start}%, black ${mid1}%, black ${mid2}%, transparent ${end}%)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
