"use client";

import { useState } from "react";
import NumberField from "./NumberField";
import Proportion from "./Proportion";
import { useCountUp } from "./useCountUp";
import { formatCompact, formatCurrency, formatNumber, toNumber } from "./format";
import c from "./calculator.module.css";

/**
 * What unanswered calls cost, per month and per year.
 *
 * Everything runs in the browser. Nothing is posted anywhere — which is stated
 * on screen, because a visitor typing their revenue into a form on an agency
 * site is entitled to know where it goes, and because it is checkable.
 *
 * The defaults produce a result on first paint rather than an empty state, so
 * the page demonstrates itself before anyone types. Figures then tween to each
 * new value rather than snapping, which is what makes the panel feel like an
 * instrument instead of a form.
 */

const WORKING_DAYS = 26;

export default function MissedCallCalculator() {
  const [callsPerDay, setCallsPerDay] = useState("40");
  const [missedPct, setMissedPct] = useState("20");
  const [convertPct, setConvertPct] = useState("25");
  const [dealValue, setDealValue] = useState("15000");

  const calls = toNumber(callsPerDay, 100000);
  const missed = Math.min(toNumber(missedPct, 100), 100);
  const convert = Math.min(toNumber(convertPct, 100), 100);
  const value = toNumber(dealValue, 100000000);

  const callsPerMonth = calls * WORKING_DAYS;
  const missedPerMonth = callsPerMonth * (missed / 100);
  const lostDeals = missedPerMonth * (convert / 100);
  const monthlyLoss = lostDeals * value;

  // Tweened for display. The maths above stays exact; only the rendering moves.
  const shownMonthly = useCountUp(monthlyLoss);
  const shownCalls = useCountUp(callsPerMonth);
  const shownMissed = useCountUp(missedPerMonth);
  const shownDeals = useCountUp(lostDeals);
  const shownAnnual = useCountUp(monthlyLoss * 12);

  return (
    <div className={c.panel}>
      <div className={c.inputs}>
        <p className={c.legend}>Your numbers</p>

        <NumberField
          id="calls-per-day"
          label="Calls a day"
          hint="Across all lines, on a normal working day."
          value={callsPerDay}
          onChange={setCallsPerDay}
          max={100000}
        />

        <NumberField
          id="missed-pct"
          label="Share nobody answers"
          hint="After hours, engaged, or rang out. Most businesses underestimate this."
          value={missedPct}
          onChange={setMissedPct}
          suffix="%"
          max={100}
        />

        <NumberField
          id="convert-pct"
          label="Of those, share that would have converted"
          hint="Use your real rate for calls you do answer."
          value={convertPct}
          onChange={setConvertPct}
          suffix="%"
          max={100}
        />

        <NumberField
          id="deal-value"
          label="Average value of one customer"
          hint="First order, or lifetime value if you track it."
          value={dealValue}
          onChange={setDealValue}
          prefix="₹"
          max={100000000}
        />
      </div>

      <div className={c.results}>
        <p className={c.resultsLegend}>What it costs</p>

        {/* aria-live so a screen reader hears the result change as the
            visitor types, rather than having to hunt for it. */}
        <div aria-live="polite">
          <p className={c.headline}>{formatCompact(shownMonthly)}</p>
          <span className={c.headlineRule} aria-hidden="true" />
          <p className={c.headlineLabel}>
            in revenue you never got the chance to win, every month
          </p>

          <Proportion
            value={missed}
            label="Of your phone line, unanswered"
            caption="The share of callers who reach nobody. Most of them do not ring back."
          />

          <dl className={c.breakdown}>
            <div className={c.row}>
              <dt className={c.rowLabel}>Calls a month</dt>
              <dd className={c.rowValue}>{formatNumber(shownCalls)}</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Of those, unanswered</dt>
              <dd className={c.rowValue}>{formatNumber(shownMissed)}</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Customers lost a month</dt>
              <dd className={c.rowValue}>{formatNumber(shownDeals)}</dd>
            </div>
            <div className={`${c.row} ${c.rowStrong}`}>
              <dt className={c.rowLabel}>Over a year</dt>
              <dd className={c.rowValue}>{formatCurrency(shownAnnual)}</dd>
            </div>
          </dl>
        </div>

        <p className={c.assumption}>
          Assumes {WORKING_DAYS} working days a month. This is an estimate of missed
          opportunity, not a bill — some of those callers rang back, and some were never
          going to buy.
        </p>
        <p className={c.privacy}>Calculated in your browser. Nothing is sent or stored.</p>
      </div>
    </div>
  );
}
