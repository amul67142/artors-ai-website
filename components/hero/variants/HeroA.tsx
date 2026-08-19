import Button from "@/components/ui/Button";
import { hero } from "@/lib/content/hero";
import { RisingWords, Sub, LedgerStrip } from "../variantParts";
import v from "../variants.module.css";

/**
 * A — STATEMENT. The type is the design: the payoff runs the full
 * container at up to 168px, and the sample run flattens to a thin
 * strip so nothing competes with it.
 */
export default function HeroA() {
  const setupWords = hero.headlineSetup.split(" ").length;

  return (
    <section className={v.aHero}>
      <div className={`shell ${v.aInner}`}>
        <h1>
          <span className={v.setup}>
            <RisingWords text={hero.headlineSetup} />
          </span>
          <span className={`grad-line ${v.payoff} ${v.aPayoff}`}>
            <RisingWords text={hero.headlinePayoff} offset={setupWords} gradient />
          </span>
        </h1>

        <div className={v.aFoot}>
          <Sub className="enter" />
          <div className="enter" style={{ "--i": 8 } as React.CSSProperties}>
            <div className={v.ctas}>
              <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
              <Button
                href={hero.secondaryCta.href}
                label={hero.secondaryCta.label}
                variant="ghost"
              />
            </div>
            <p className={`t-caption ${v.trust}`}>{hero.trustLine}</p>
          </div>
        </div>

        <LedgerStrip />
      </div>
    </section>
  );
}
