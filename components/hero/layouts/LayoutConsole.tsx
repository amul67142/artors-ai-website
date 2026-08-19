import Link from "next/link";
import Button from "@/components/ui/Button";
import { hero, ledger } from "@/lib/content/hero";
import { statusRail } from "@/lib/content/services";
import { Headline, Sub } from "./parts";
import L from "./layouts.module.css";

/**
 * 1 — CONSOLE. The hero is framed as a system readout: a status rail
 * across the top, the claim in the middle, and the pipeline running
 * edge to edge along the bottom. The full-bleed rules are what stop it
 * reading as a boxed marketing page.
 */
export default function LayoutConsole() {
  return (
    <section className={L.consoleHero}>
      <div className={L.rail}>
        {statusRail.map((cell, i) => (
          <div key={cell.label} className={L.railCell}>
            <p className={L.micro}>{cell.label}</p>
            <p className={L.railValue}>
              {i === 0 && <span className={L.railDot} aria-hidden="true" />}
              {cell.value}
            </p>
          </div>
        ))}
      </div>

      <div className={L.consoleBody}>
        <Headline className={`${L.headline} ${L.consoleClaim}`} />
        <div className={L.consoleAside}>
          <Sub className="enter" />
          <div className={`${L.ctas} enter`} style={{ "--i": 8 } as React.CSSProperties}>
            <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
            <Button href={hero.secondaryCta.href} label={hero.secondaryCta.label} variant="ghost" />
          </div>
        </div>
      </div>

      <Link href={ledger.href} className={L.pipe} aria-label="See the full sample run">
        <div className={L.pipeHead}>
          <span className={L.micro}>
            {ledger.label} — {ledger.subject}
          </span>
          <span className={L.micro}>{ledger.summary.join(" · ")}</span>
        </div>
        <div className={L.pipeSteps}>
          {ledger.rows.map((row) => (
            <div key={row.time} className={`${L.pipeStep} ${row.highlight ? L.pipeOn : ""}`}>
              <span className={L.pipeEvent}>{row.event}</span>
              <span className={L.pipeChannel}>{row.channel}</span>
            </div>
          ))}
        </div>
      </Link>
    </section>
  );
}
