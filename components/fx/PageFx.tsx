"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The site-wide GSAP motion layer. Mounted once in the root layout.
 *
 * Perf contract (docs/DESIGN.md §4 still holds):
 *  - transform/opacity/color only, no layout properties
 *  - no free-running rAF loops: everything is ScrollTrigger-driven or
 *    pointer-event-driven
 *  - every effect lives behind prefers-reduced-motion: no-preference;
 *    with reduced motion (or no JS) the page renders complete and static,
 *    because base CSS never hides content
 *
 * Choreography, each with its one-sentence reason:
 *  - .float-in reveals      → hierarchy: sections introduce themselves
 *  - [data-fx=statement]    → storytelling: the claim inks in as you read
 *  - FLOW pin (desktop)     → storytelling: the four steps play as a
 *                             sequence you scroll through, not a list
 *  - [data-fx=bar|pct]      → feedback: numbers earn their size on arrival
 *  - [data-fx=ledger]       → depth: the proof panel drifts against copy
 *  - .btn magnetic pull     → feedback: primary actions answer the cursor
 */
export default function PageFx() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const MOTION = "(prefers-reduced-motion: no-preference)";

      // ── Shared: reveals, statements, ledger drift ───────────
      mm.add(MOTION, () => {
        const readIndex = (el: Element) =>
          parseFloat(getComputedStyle(el as HTMLElement).getPropertyValue("--i")) || 0;

        // Section reveals. FLOW columns are excluded: both FLOW branches
        // below own their entrance completely.
        gsap.utils
          .toArray<HTMLElement>(".float-in")
          .filter((el) => el.dataset.fx !== "flowcol")
          .forEach((el) => {
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

        // Statement word-fills: dull → ink, bracketed words → accent,
        // walking with the reader. Literal colors on purpose: GSAP's
        // interpolator can't parse color-mix()/var() (tokens: --ink
        // #0a0a0a, --accent #2b5cff in globals.css).
        gsap.utils.toArray<HTMLElement>('[data-fx="statement"]').forEach((h) => {
          const words = h.querySelectorAll<HTMLElement>('[data-fx="word"]');
          if (!words.length) return;
          gsap.fromTo(
            words,
            { color: "rgba(10, 10, 10, 0.22)" },
            {
              color: (idx, el) =>
                (el as HTMLElement).dataset.accent ? "#2b5cff" : "#0a0a0a",
              ease: "none",
              stagger: 0.05,
              scrollTrigger: { trigger: h, start: "top 80%", end: "top 30%", scrub: 0.4 },
            }
          );
        });

        // Ledger drift against the copy column.
        gsap.utils.toArray<HTMLElement>('[data-fx="ledger"]').forEach((el) => {
          gsap.to(el, {
            y: -36,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 70%", end: "bottom top", scrub: 0.6 },
          });
        });
      });

      // ── FLOW, desktop: pinned sequence ──────────────────────
      // The section locks to the viewport and the four steps play through
      // under the scrollbar: column settles, bar draws, number counts.
      mm.add(`${MOTION} and (min-width: 810px)`, () => {
        const section = document.querySelector<HTMLElement>('[data-fx="process"]');
        if (!section) return;
        const cols = section.querySelectorAll<HTMLElement>('[data-fx="flowcol"]');
        if (!cols.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1600",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        cols.forEach((col, i) => {
          const at = i * 0.9;
          tl.fromTo(
            col,
            { y: 90, opacity: 0.12 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
            at
          );
          const bar = col.querySelector<HTMLElement>('[data-fx="bar"]');
          if (bar) {
            tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "none" }, at + 0.35);
          }
          const pct = col.querySelector<HTMLElement>('[data-fx="pct"]');
          if (pct) {
            const target = parseFloat(pct.dataset.pct || "0");
            const state = { v: 0 };
            tl.to(
              state,
              {
                v: target,
                duration: 0.5,
                ease: "none",
                onUpdate: () => {
                  pct.textContent = `${Math.round(state.v)}%`;
                },
              },
              at + 0.35
            );
          }
        });
        // A short hold at the end so the finished sequence can be read
        // before the section releases.
        tl.to({}, { duration: 0.5 });
      });

      // ── FLOW, mobile: plain scrubbed assembly (no pinning) ──
      mm.add(`${MOTION} and (max-width: 809px)`, () => {
        gsap.utils.toArray<HTMLElement>('[data-fx="flowcol"]').forEach((col) => {
          gsap.fromTo(
            col,
            { y: 44, opacity: 0.15 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: col, start: "top 92%", end: "top 55%", scrub: 0.5 },
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
      });

      // ── Magnetic buttons (desktop pointers only) ────────────
      mm.add(`${MOTION} and (pointer: fine)`, () => {
        const cleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>(".btn").forEach((btn) => {
          const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
          const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });

          const onMove = (e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            xTo(gsap.utils.clamp(-6, 6, (e.clientX - (r.left + r.width / 2)) * 0.14));
            yTo(gsap.utils.clamp(-5, 5, (e.clientY - (r.top + r.height / 2)) * 0.22));
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
      });
    },
    { scope: ref }
  );

  // Scope anchor only — renders nothing visible. Selectors above reach
  // the whole document via gsap.utils.toArray on purpose.
  return <div ref={ref} aria-hidden="true" />;
}
