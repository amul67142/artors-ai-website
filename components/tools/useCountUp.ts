"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Tweens a number towards its target so a result visibly moves rather than
 * snapping. Same technique the rest of the site uses for counters
 * (components/fx/PageFx.tsx, [data-fx="pct"]) — a GSAP tween on a state
 * object with onUpdate — so there is one counting idiom in the codebase.
 *
 * Performance contract, per docs/DESIGN.md:
 *   - The tween runs only when the target changes and then completes. There is
 *     no rAF loop sitting idle between edits.
 *   - Each new target kills the previous tween, so fast typing cannot stack
 *     overlapping animations.
 *   - prefers-reduced-motion skips the tween entirely and sets the value.
 *
 * CORRECTNESS OVER ANIMATION. GSAP is driven by requestAnimationFrame, and rAF
 * can be frozen or throttled — a backgrounded tab, some embedded webviews. If
 * the tween never advances, onUpdate never fires and the figure would sit on a
 * stale value while the inputs said otherwise, which for a calculator is the
 * one unacceptable failure. The timeout below guarantees the target is reached
 * whether or not a single frame is ever painted.
 *
 * The first render is not animated: counting up from zero on load would delay
 * the number the page exists to show.
 */
export function useCountUp(target: number, duration = 0.45): number {
  const [display, setDisplay] = useState(target);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const stateRef = useRef({ v: target });
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      stateRef.current.v = target;
      setDisplay(target);
      return;
    }

    const settle = () => {
      stateRef.current.v = target;
      setDisplay(target);
    };

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !Number.isFinite(target)) {
      settle();
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(stateRef.current, {
      v: target,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(stateRef.current.v),
      onComplete: settle,
    });

    // The safety net. Fires on the timer queue rather than the frame queue, so
    // it lands even where rAF does not run at all.
    const guard = window.setTimeout(settle, duration * 1000 + 80);

    return () => {
      tweenRef.current?.kill();
      window.clearTimeout(guard);
    };
  }, [target, duration]);

  return display;
}
