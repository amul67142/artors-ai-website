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

Tracking tightens as size grows (`-0.01em` body → `-0.04em` display); leading does the
opposite (`1.4em` body → `0.8em` display). The 13 px eyebrow is the only style with
*positive* tracking.

Breakpoints: desktop ≥ 1200 · tablet 810–1199 · mobile ≤ 809.

| Style | Size (d/t/m) | Weight | Tracking | Leading | Case |
|---|---|---|---|---|---|
| Display | 90 / 80 / 40 | 700 | −3.3px (−0.5px mobile) | 0.8em | UPPER |
| Statement | 61 / 49 / 42 | 700 | −0.04em | 0.9em | UPPER |
| Stat numeral | 63 | 700 | 0 | 1.0em | — |
| Section heading | 38 / 38 / 31 | 700 | −0.03em | 0.9em | UPPER |
| Card heading | 30 / 22 / 20 | 700 | −0.03em | 1.0em | UPPER |
| Lead paragraph | 26 / 24 / 22 | 600 | −0.03em | 1.2em | — |
| Sub heading | 22 / 18 | 700 | −0.03em | 1.0em | UPPER |
| Minor heading | 20 / 18 | 700 | −0.02em | 1.0em | UPPER |
| Card title | 16 | 700 | −0.02em | 1.1em | — |
| Body | 16 | 600 | −0.01em | 1.4em | — |
| Body muted | 16 | 600 | −0.01em | 1.4em | `--muted` |
| Person name | 15 | 700 | 0 | 1.3em | — |
| Button / nav label | 14 | 600 | −0.03em | 1.0em | UPPER |
| Index numeral | 14 | 700 | −0.03em | 1.0em | UPPER |
| Eyebrow | 13 | 700 | **+0.04em** | 1.3em | UPPER, `--muted` |
| Caption | 13 | 600 | −0.03em | 1.4em | — |

The logo wordmark is lowercase and rounded; it sits against uppercase tight headings as a
lockup and is never restyled to match.

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
