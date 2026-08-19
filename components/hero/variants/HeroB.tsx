import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import Ledger from "../Ledger";
import { hero } from "@/lib/content/hero";
import { RisingWords, Sub } from "../variantParts";
import v from "../variants.module.css";

/**
 * B — DARK ANCHOR. Same split as the current hero, but the panel is a
 * black mass rather than white-on-white, which is what gives the page
 * something to land on. The headline grows to 112px.
 */
export default function HeroB() {
  const setupWords = hero.headlineSetup.split(" ").length;

  return (
    <section className={v.bHero}>
      <div className={`shell ${v.bGrid}`}>
        <div>
          <h1>
            <span className={v.setup}>
              <RisingWords text={hero.headlineSetup} />
            </span>
            <span className={`grad-line ${v.payoff} ${v.bPayoff}`}>
              <RisingWords text={hero.headlinePayoff} offset={setupWords} gradient />
            </span>
          </h1>

          <Sub className="enter" />

          <div className={`${v.ctas} enter`} style={{ "--i": 8 } as React.CSSProperties}>
            <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
            <Button
              href={hero.secondaryCta.href}
              label={hero.secondaryCta.label}
              variant="ghost"
            />
          </div>
          <p className={`t-caption ${v.trust} enter`} style={{ "--i": 9 } as React.CSSProperties}>
            {hero.trustLine}
          </p>
        </div>

        <InViewGate className="enter">
          <Ledger tone="dark" />
        </InViewGate>
      </div>
    </section>
  );
}
