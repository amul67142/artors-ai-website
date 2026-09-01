"use client";

import { useState } from "react";
import NumberField from "./NumberField";
import { formatCompact, formatCurrency, formatNumber, toNumber } from "./format";
import c from "./calculator.module.css";

/**
 * What a manual process costs per year in staff time.
 *
 * Deliberately reports COST TODAY, not savings. A "you will save X" figure
 * would require assuming how much of the work automation removes, and that
 * assumption would be ours rather than the visitor's — an invented number
 * dressed as a calculation, which docs/PLAN.md §2 rules out.
 *
 * Correction time is a separate input because it is the part people leave out
 * of every estimate and the part automation removes most reliably.
 */

const WORKING_WEEKS = 48; // 52 less leave and holidays
const HOURS_PER_DAY = 8;

export default function AutomationRoiCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState("6");
  const [people, setPeople] = useState("3");
  const [hourlyCost, setHourlyCost] = useState("400");
  const [fixHours, setFixHours] = useState("2");

  const hours = toNumber(hoursPerWeek, 168);
  const headcount = toNumber(people, 10000);
  const rate = toNumber(hourlyCost, 1000000);
  const fixing = toNumber(fixHours, 168);

  const weeklyHours = (hours + fixing) * headcount;
  const annualHours = weeklyHours * WORKING_WEEKS;
  const annualCost = annualHours * rate;
  const workingDays = annualHours / HOURS_PER_DAY;
  const correctionShare = hours + fixing > 0 ? (fixing / (hours + fixing)) * 100 : 0;

  return (
    <div className={c.panel}>
      <div className={c.inputs}>
        <p className={c.legend}>Your numbers</p>

        <NumberField
          id="hours-per-week"
          label="Hours a week doing the task"
          hint="Per person, on the process itself."
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          suffix="hrs"
          max={168}
        />

        <NumberField
          id="fix-hours"
          label="Hours a week fixing mistakes from it"
          hint="Re-keying errors, chasing what went missing. Usually underestimated."
          value={fixHours}
          onChange={setFixHours}
          suffix="hrs"
          max={168}
        />

        <NumberField
          id="people"
          label="People doing it"
          value={people}
          onChange={setPeople}
          max={10000}
        />

        <NumberField
          id="hourly-cost"
          label="Fully loaded cost per hour"
          hint="Not salary alone — add contributions, equipment, management time."
          value={hourlyCost}
          onChange={setHourlyCost}
          prefix="₹"
          max={1000000}
        />
      </div>

      <div className={c.results}>
        <p className={c.resultsLegend}>What it costs today</p>

        <div aria-live="polite">
          <p className={c.headline}>{formatCompact(annualCost)}</p>
          <p className={c.headlineLabel}>a year, in staff time on this one process</p>

          <dl className={c.breakdown}>
            <div className={c.row}>
              <dt className={c.rowLabel}>Hours a week, whole team</dt>
              <dd className={c.rowValue}>{formatNumber(weeklyHours)}</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Hours a year</dt>
              <dd className={c.rowValue}>{formatNumber(annualHours)}</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Working days a year</dt>
              <dd className={c.rowValue}>{formatNumber(workingDays)}</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Of it, correcting mistakes</dt>
              <dd className={c.rowValue}>{formatNumber(correctionShare)}%</dd>
            </div>
            <div className={c.row}>
              <dt className={c.rowLabel}>Cost a month</dt>
              <dd className={c.rowValue}>{formatCurrency(annualCost / 12)}</dd>
            </div>
          </dl>
        </div>

        <p className={c.assumption}>
          Assumes {WORKING_WEEKS} working weeks a year and an {HOURS_PER_DAY}-hour day. This is
          what the process costs now — not a saving. Automation rarely removes all of it, so
          treat this as the size of the prize rather than the cheque.
        </p>
        <p className={c.privacy}>Calculated in your browser. Nothing is sent or stored.</p>
      </div>
    </div>
  );
}
