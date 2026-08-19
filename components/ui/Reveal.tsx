"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger index: delay = i x 90ms. */
  i?: number;
};

/**
 * Scroll reveal for below-the-fold content: children start hidden
 * (.reveal in globals.css) and rise in when 15% visible, then the
 * observer lets go. One observer per instance, no loops, no state.
 */
export default function Reveal({ children, className, i = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className ?? ""}`}
      style={{ "--i": i } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
