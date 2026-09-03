"use client";

import { useState } from "react";
import Link from "next/link";
import { useCountUp } from "@/components/tools/useCountUp";
import { formatCompact, toNumber } from "@/components/tools/format";
import s from "./toolsTeaser.module.css";

/**
 * Homepage highlight for /tools.
 *
 * A live, single-input calculator rather than two cards linking away. Three
 * reasons it is built this way:
 *
 *   - docs/PLAN.md §2: no invented statistics. A band claiming "businesses
 *     lose ₹X a year" would be a fabricated number. A figure the visitor
 *     produced from their own call volume is theirs, and it is true.
 *   - It demonstrates the tool instead of describing it. Someone who has
 *     already watched a number appear arrives at /tools warm.
 *   - Card-heavy layouts have been rejected on this project before, so this
 *     keeps the site's hairline grammar and lets type carry the weight.
 *
 * Motion: one GSAP tween per edit that completes and stops. No loop, nothing
 * running off-screen — the performance contract in docs/DESIGN.md.
 */

const WORKING_DAYS = 26;
const ASSUMED_MISSED = 0.2;
const ASSUMED_CONVERT = 0.25;
const ASSUMED_VALUE = 15000;

export default function ToolsTeaser() {
  const [callsPerDay, setCallsPerDay] = useState("40");

  const calls = toNumber(callsPerDay, 100000);
  const monthlyLoss =
    calls * WORKING_DAYS * ASSUMED_MISSED * ASSUMED_CONVERT * ASSUMED_VALUE;
  const shown = useCountUp(monthlyLoss);

  return (
    <section className={s.section} aria-labelledby="tools-teaser-heading">
      <div className={`shell ${s.grid}`}>
        <div>
          <h2 id="tools-teaser-heading" className={s.label}>
            Free tools
          </h2>
          <p className={s.statement}>Put a number on it before you decide.</p>
          <p className={s.intro}>
            Two calculators, no sign-up and no email gate. The maths runs in your browser and
            nothing is stored.
          </p>

          <ul className={s.links}>
            <li>
              <Link href="/tools/missed-call-cost-calculator" className={s.link}>
                <span className={s.linkTitle}>Missed call cost calculator</span>
                <span className={s.linkNote}>What unanswered calls cost you a month</span>
              </Link>
            </li>
            <li>
              <Link href="/tools/automation-roi-calculator" className={s.link}>
                <span className={s.linkTitle}>Automation ROI calculator</span>
                <span className={s.linkNote}>What a manual process costs you a year</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className={s.live}>
          <label htmlFor="teaser-calls" className={s.liveLabel}>
            How many calls do you take a day?
          </label>
          <input
            id="teaser-calls"
            className={s.liveInput}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={callsPerDay}
            onChange={(e) => setCallsPerDay(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
          />

          <div className={s.liveResult} aria-live="polite">
            <p className={s.liveNumber}>{formatCompact(shown)}</p>
            <span className={s.liveRule} aria-hidden="true" />
            <p className={s.liveCaption}>
              could be walking past your phone line every month, if a fifth of those calls go
              unanswered and a quarter of those callers would have bought.
            </p>
          </div>

          <Link href="/tools/missed-call-cost-calculator" className={s.liveCta}>
            Use your own assumptions
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path d="M3 11L11 3M11 3H4M11 3v7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
