"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The site-wide GSAP motion layer. Mounted once in the root layout.
 *
 * Replaces the CSS scroll-timeline system (Chromium-only — the site was
 * fully static in Safari/Firefox) with ScrollTrigger, and upgrades the
 * linear scrubbed entrances to decisive power3 reveals.
 *
 * Perf contract (docs/DESIGN.md §4 still holds):
 *  - transform/opacity/color only, no layout properties
 *  - no free-running rAF loops: everything is ScrollTrigger-driven or
 *    pointer-event-driven
 *  - every effect lives inside prefers-reduced-motion: no-preference;
 *    with reduced motion (or no JS) the page renders complete and static,
 *    because base CSS never hides content
 *
 * Choreography, each with its one-sentence reason:
 *  - .float-in reveals      → hierarchy: sections introduce themselves
 *  - [data-fx=statement]    → storytelling: the claim inks in as you read
 *  - [data-fx=flowcol]      → storytelling: the FLOW staircase assembles
 *  - [data-fx=bar|pct]      → feedback: numbers earn their size on arrival
 *  - [data-fx=ledger]       → depth: the proof panel drifts against copy
 *  - .btn magnetic pull     → feedback: primary actions answer the cursor
 */
export default function PageFx() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const readIndex = (el: Element) =>
          parseFloat(getComputedStyle(el as HTMLElement).getPropertyValue("--i")) || 0;

        // ── Section reveals ───────────────────────────────────
        gsap.utils.toArray<HTMLElement>(".float-in").forEach((el) => {
          const i = readIndex(el);
          gsap.fromTo(
            el,
            { opacity: 0, y: 44 + i * 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.95,
              delay: Math.min(i * 0.07, 0.35),
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        });

        // ── Statement word-fills (Problem / Who we are) ───────
        // The favourite effect, now scrubbed cross-browser: dull → ink,
        // bracketed words → accent, walking with the reader's scroll.
        gsap.utils.toArray<HTMLElement>('[data-fx="statement"]').forEach((h) => {
          const words = h.querySelectorAll<HTMLElement>('[data-fx="word"]');
          if (!words.length) return;
          // Literal colors: GSAP's color interpolator can't parse
          // color-mix()/var() strings. Values mirror the tokens in
          // globals.css (--ink #0a0a0a at 22%, --accent #2b5cff).
          gsap.fromTo(
            words,
            { color: "rgba(10, 10, 10, 0.22)" },
            {
              color: (idx, el) =>
                (el as HTMLElement).dataset.accent ? "#2b5cff" : "#0a0a0a",
              ease: "none",
              stagger: 0.05,
              scrollTrigger: {
                trigger: h,
                start: "top 80%",
                end: "top 30%",
                scrub: 0.4,
              },
            }
          );
        });

        // ── FLOW: staircase assembles, bars draw, numbers count ─
        gsap.utils.toArray<HTMLElement>('[data-fx="flowcol"]').forEach((col) => {
          const step =
            parseFloat(getComputedStyle(col).getPropertyValue("--step")) || 0;
          gsap.fromTo(
            col,
            { y: 30 + step * 26 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: col.parentElement,
                start: "top 88%",
                end: "top 30%",
                scrub: 0.5,
              },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-fx="bar"]').forEach((bar) => {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: bar, start: "top 95%", end: "top 60%", scrub: 0.4 },
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-fx="pct"]').forEach((el) => {
          const target = parseFloat(el.dataset.pct || "0");
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = `${Math.round(state.v)}%`;
            },
          });
        });

        // ── Ledger drift (hero proof panel) ───────────────────
        gsap.utils.toArray<HTMLElement>('[data-fx="ledger"]').forEach((el) => {
          gsap.to(el, {
            y: -36,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 70%",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
      });

      // ── Magnetic buttons (desktop pointers only) ────────────
      mm.add(
        "(prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const cleanups: Array<() => void> = [];
          gsap.utils.toArray<HTMLElement>(".btn").forEach((btn) => {
            const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
            const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });

            const onMove = (e: PointerEvent) => {
              const r = btn.getBoundingClientRect();
              const relX = e.clientX - (r.left + r.width / 2);
              const relY = e.clientY - (r.top + r.height / 2);
              // Pull is capped tiny — a nod toward the cursor, not a chase.
              xTo(gsap.utils.clamp(-6, 6, relX * 0.14));
              yTo(gsap.utils.clamp(-5, 5, relY * 0.22));
            };
            const onLeave = () => {
              xTo(0);
              yTo(0);
            };

            btn.addEventListener("pointermove", onMove);
            btn.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              btn.removeEventListener("pointermove", onMove);
              btn.removeEventListener("pointerleave", onLeave);
            });
          });
          return () => cleanups.forEach((fn) => fn());
        }
      );
    },
    { scope: ref }
  );

  // Scope anchor only — renders nothing. Selectors above intentionally
  // reach the whole document via gsap.utils.toArray.
  return <div ref={ref} aria-hidden="true" />;
}
