# Artors — Design & Motion System

Derived from `agrbuttonsystem.html` (reverse-engineered from agr.studio), adapted to the
Artors logo. This file is the specification; the implementation lives in `app/globals.css`
and `components/ui/`.

**The brief in one line:** clean white, black text, sharp. A little blue gradient. No cursive
faces, no thin weights.

---

## 1. Colour

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0A0A0A` | All text, primary button fill |
| `--paper` | `#FFFFFF` | Page background |
| `--muted` | `#4F4F4F` | Secondary body, eyebrows |
| `--line` | `rgba(10,10,10,.12)` | Rules, card borders |
| `--accent` | `#2B5CFF` | Focus rings, hover borders, gradient start |
| `--accent-2` | `#5BE0DC` | Gradient end (from the logo's cyan) |

The accent gradient is `linear-gradient(100deg, ...)` running ink → accent → ink → accent-2.
It is **rationed**: the H1 sweep, one section rule, and the final CTA band. Nowhere else.
Buttons stay black on white or white on black — they never carry the gradient.

Logo endpoints for reference: `#3E7BE8 → #5BE0DC`.

---

## 2. Type

**Inter, weights 600 and 700 only.** Two weights, one family, nothing lighter than 600 —
that heaviness is what makes the page read "sharp" rather than soft. Loaded through
`next/font/google`, self-hosted, so there is no CLS and no third-party request.

**The scale is deliberately small.** The site takes its presence from space and precision,
not from size — display tops out at 54 px rather than the 90 px of the source system, and
body copy sits at 16–17 px. Big type was tried and rejected: at 150 px the page read as a
bigger plain page, not a designed one. What makes it feel sharp is heavy weight, tight
tracking, and gaps generous enough that nothing is crowded.

Tracking tightens as size grows (`-0.01em` body → `-0.038em` display). Leading does the
opposite (`1.6` body → `1.1` display); note that body leading is *loose* here, which is
what buys the air. Small uppercase labels are the only styles with positive tracking, and
they carry a lot of it (`+0.06em` to `+0.12em`) — that spacing is what makes them read as
precise rather than shrunken.

Breakpoints: desktop ≥ 1200 · tablet 810–1199 · mobile ≤ 809.

| Style | Size (d/t/m) | Weight | Tracking | Leading | Case |
|---|---|---|---|---|---|
| Display | 54 / 42 / 30 | 700 | −0.038em | 1.1 | sentence |
| Statement | 30 / 26 / 22 | 700 | −0.03em | 1.2 | sentence |
| Lead | 17 / 17 / 16 | 600 | −0.01em | 1.6 | — |
| Body | 15 | 600 | −0.01em | 1.6 | — |
| Caption / trust | 12 | 700 | **+0.06em** | 1.5 | UPPER |
| Eyebrow | 11 | 700 | **+0.1em** | 1.3 | UPPER, `--muted` |
| Micro label | 10 | 700 | **+0.12em** | — | UPPER |
| Button / nav label | 14 | 600 | −0.03em | 1.0 | UPPER |

Display is **sentence case, not uppercase** — a deviation from the source system. At 54 px
a long uppercase sentence turns into a wall; sentence case keeps it clean and reads as
modern rather than shouty. Uppercase is reserved for the small labels, where the wide
tracking does the work.

The logo wordmark is lowercase and rounded; it sits as a lockup and is never restyled.

---

## 3. Motion

Two easings, two durations. Everything on the site uses one of these.

```
--ease-btn:    cubic-bezier(1, .06, .37, .82)    --dur-btn:    .4s
--ease-reveal: cubic-bezier(.22, 1, .36, 1)      --dur-reveal: .7s
```

### 3.1 Button

Pill, `border-radius: 100px`, `padding: 12px 20px`, `overflow: hidden`. Two behaviours fire
together on hover and on `:focus-visible`:

- **Label roll.** The label is duplicated; the ghost copy is parked 40 px below. On hover the
  track translates `-40px`, so the label rolls up and the duplicate takes its place. The mask
  is `overflow: clip` at `line-height + 2 × 3px` padding.
- **Diagonal arrow swap.** Two arrow icons in a 20 px clipped box. The outgoing one exits
  up-and-right `translate(20px, -20px)`; the incoming one starts parked down-and-left
  `translate(-20px, 20px)` and returns to origin.

Variants: `primary` (ink on paper), `ghost` (transparent, hairline border, inverts to ink on
hover), `invert` (white on dark surfaces), `lg` (16/28 padding, 16 px label, 44 px travel).
Focus ring: `2px solid var(--accent)`, `outline-offset: 3px`.

### 3.2 Scroll reveal

Elements start at `opacity: 0; translateY(28px)` and animate over 0.7 s with
`--ease-reveal`. Stagger is a CSS variable — `transition-delay: calc(var(--i, 0) * 90ms)`.
Driven by a single IntersectionObserver at `threshold: 0.15`,
`rootMargin: "0px 0px -8% 0px"`, which **unobserves each element after it fires**.

### 3.3 Marquee

`34s linear infinite`, translating `0 → -50%` over a duplicated track. Pauses on hover via
`animation-play-state`. Used once, for the integrations strip.

### 3.4 The rest

| Effect | Implementation |
|---|---|
| H1 gradient sweep | `background-clip: text` on the accent gradient; animates once on load, then static |
| Count-up | IntersectionObserver, fires once, then the node is left alone |
| Sticky nav | Hides on scroll down, returns on scroll up; transform only |
| FAQ accordion | `grid-template-rows: 0fr → 1fr` — no JS height measurement |
| Card hover | Border to `--accent`, 2 px lift. **No glow.** |
| Process line | Draws downward on scroll |

### 3.5 Reduced motion

Under `prefers-reduced-motion: reduce`: reveals render at their final state with no
transition, the marquee stops, and button transitions collapse to `0.01ms`. Every new effect
must add its own counterpart here.

---

## 4. Performance rules

These are hard constraints, not preferences.

- No `requestAnimationFrame` loops. Continuous motion is CSS, and it stops when off-screen.
- One IntersectionObserver for all reveals, not one per element.
- No animation library. The whole system above is CSS plus roughly 1 KB of observer code.
- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, or `left`.
- `will-change` only on elements that actually animate, and never left on permanently.
- Server Components by default. `"use client"` is limited to: reveal observer, nav,
  accordion, counter, form.
