"use client";

import { useEffect, useRef } from "react";
import s from "./magnetLines.module.css";

type Props = {
  rows?: number;
  cols?: number;
  className?: string;
};

/**
 * Magnet lines — the React Bits MagnetLines idea, dependency-free.
 * A grid of hairline bars that rotate to face the pointer.
 *
 * Entirely event-driven: pointermove writes each bar's angle straight
 * to a CSS variable — no React state, no requestAnimationFrame loop,
 * zero cost while the pointer is elsewhere. Centres are re-measured on
 * pointerenter so scroll position never goes stale. Decorative:
 * aria-hidden, and under reduced motion the bars simply hold their
 * resting angle.
 */
export default function MagnetLines({ rows = 7, cols = 9, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const centres = useRef<{ el: HTMLElement; cx: number; cy: number }[]>([]);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(hover: none)").matches) return;

    const measure = () => {
      centres.current = [...box.querySelectorAll<HTMLElement>("span")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };

    const onMove = (e: PointerEvent) => {
      for (const { el, cx, cy } of centres.current) {
        const deg = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI + 90;
        el.style.setProperty("--r", `${deg}deg`);
      }
    };

    const onLeave = () => {
      for (const { el } of centres.current) el.style.setProperty("--r", "0deg");
    };

    box.addEventListener("pointerenter", measure);
    box.addEventListener("pointermove", onMove, { passive: true });
    box.addEventListener("pointerleave", onLeave);
    return () => {
      box.removeEventListener("pointerenter", measure);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${s.grid} ${className ?? ""}`}
      style={{ "--rows": rows, "--cols": cols } as React.CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
