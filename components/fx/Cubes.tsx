"use client";

import { useEffect, useRef } from "react";
import s from "./cubes.module.css";

type Props = {
  rows?: number;
  cols?: number;
  className?: string;
};

/**
 * Cubes — the React Bits Cubes idea, dependency-free.
 *
 * A field of dashed squares; near the pointer each cell tilts in 3D,
 * revealing extruded dashed faces, and settles flat as the pointer
 * leaves. Same engine as MagnetLines: pointermove writes two CSS
 * variables per cell, no state, no rAF, zero cost at rest. Decorative
 * (aria-hidden); on touch or reduced motion it holds still as a plain
 * dashed grid.
 */
export default function Cubes({ rows = 4, cols = 7, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const cells = useRef<{ el: HTMLElement; cx: number; cy: number }[]>([]);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (matchMedia("(hover: none)").matches) return;

    const RADIUS = 150;
    const MAX_TILT = 38;

    const measure = () => {
      cells.current = [...box.querySelectorAll<HTMLElement>(`.${s.cube}`)].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };

    const onMove = (e: PointerEvent) => {
      for (const { el, cx, cy } of cells.current) {
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const fall = Math.max(0, 1 - dist / RADIUS);
        el.style.setProperty("--rx", `${(-dy / RADIUS) * MAX_TILT * fall}deg`);
        el.style.setProperty("--ry", `${(dx / RADIUS) * MAX_TILT * fall}deg`);
      }
    };

    const onLeave = () => {
      for (const { el } of cells.current) {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      }
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
      style={{ "--cols": cols } as React.CSSProperties}
      aria-hidden="true"
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <span key={i} className={s.cube}>
          <i className={s.faceFront} />
          <i className={s.faceTop} />
          <i className={s.faceSide} />
        </span>
      ))}
    </div>
  );
}
