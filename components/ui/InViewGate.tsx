"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Fraction of the element that must be visible before it runs. */
  threshold?: number;
};

/**
 * Sets data-inview on a wrapper so CSS animations inside it can be paused
 * while off-screen (see .ledger__row in hero.module.css).
 *
 * This is the only JavaScript in the hero. It runs no timers and no
 * requestAnimationFrame loop — the animation itself is pure CSS, and this
 * just flips one attribute so nothing burns cycles out of view.
 *
 * Children are passed through untouched, so anything rendered inside stays
 * a Server Component and ships no JS of its own.
 */
export default function InViewGate({ children, className, threshold = 0.2 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts true so the animation is already running for the very first
  // paint, and so it degrades to "always on" if the observer never fires.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={className} data-inview={inView}>
      {children}
    </div>
  );
}
