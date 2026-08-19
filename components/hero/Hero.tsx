import { Fragment } from "react";
import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import FlowCanvas from "./FlowCanvas";
import { hero } from "@/lib/content/hero";
import s from "./hero.module.css";

/**
 * Modern product idiom: badge, sentence-case headline with gradient
 * payoff, sub, CTAs, and the flow canvas as the visual centerpiece.
 * Server Component; the canvas dash is CSS, paused off-screen.
 */
export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={`shell ${s.inner}`}>
        <p className={`${s.badge} enter`} style={{ "--i": 0 } as React.CSSProperties}>
          {hero.badge}
        </p>

        <h1 className={`${s.headline} enter`} style={{ "--i": 1 } as React.CSSProperties}>
          <span>{hero.headlineSetup}</span>
          <span className={s.payoff}>{hero.headlinePayoff}</span>
        </h1>

        <p className={`${s.sub} enter`} style={{ "--i": 2 } as React.CSSProperties}>
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

        <div className={`${s.ctas} enter`} style={{ "--i": 3 } as React.CSSProperties}>
          <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
          <Button
            href={hero.secondaryCta.href}
            label={hero.secondaryCta.label}
            variant="ghost"
          />
        </div>

        <InViewGate className="enter">
          <FlowCanvas />
        </InViewGate>
      </div>
    </section>
  );
}
