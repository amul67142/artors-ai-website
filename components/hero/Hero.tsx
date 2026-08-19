import { Fragment } from "react";
import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import { hero, call } from "@/lib/content/hero";
import s from "./hero.module.css";

/**
 * The hero is a call. A recorded demo conversation plays out in large
 * type, one line at a time, and lands on the booked outcome with the
 * three system confirmations. The claim sits below as a quiet band.
 *
 * Server Component. The whole loop is CSS keyframes; InViewGate only
 * pauses it off-screen. No animation library, no timers, no rAF.
 */
export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={`shell ${s.inner}`}>
        {/* -------- the stage -------- */}
        <div className={s.stageHead}>
          <p className={s.micro}>{call.label}</p>
          <p className={s.micro}>{call.sublabel}</p>
        </div>

        {/* The animated lines are presentational; the full story is in
            the sr-only paragraph below. */}
        <InViewGate>
          <div className={s.stage} aria-hidden="true">
            {call.lines.map((line, i) => (
              <div
                key={i}
                className={[
                  s.line,
                  line.speaker === "caller" ? s.lineCaller : "",
                  line.final ? s.lineFinal : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{ "--t": `${i * 3.8}s` } as React.CSSProperties}
              >
                <span className={s.speaker}>
                  {line.speaker === "caller" ? "Caller" : "Artors agent"}
                </span>
                <span className={s.words}>{line.text}</span>
              </div>
            ))}
          </div>

          <div className={s.confirms} aria-hidden="true">
            {call.confirmations.map((c) => (
              <span key={c} className={s.confirm}>
                {c}
              </span>
            ))}
          </div>
        </InViewGate>

        <p className="sr-only">{call.srSummary}</p>

        {/* -------- the claim -------- */}
        <div className={`${s.band} enter`}>
          <div>
            <h1 className={s.headline}>
              <span>{hero.headlineSetup}</span>
              <span className={s.payoff}>{hero.headlinePayoff}</span>
            </h1>
            <p className={s.sub}>
              {hero.sub.map((seg, i) =>
                seg.em ? (
                  <strong key={i} className={s.subEm}>
                    {seg.text}
                  </strong>
                ) : (
                  <Fragment key={i}>{seg.text}</Fragment>
                ),
              )}
            </p>
          </div>

          <div className={s.ctas}>
            <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
            <Button
              href={hero.secondaryCta.href}
              label={hero.secondaryCta.label}
              variant="ghost"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
