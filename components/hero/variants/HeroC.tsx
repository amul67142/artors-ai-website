import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import Ledger from "../Ledger";
import { hero } from "@/lib/content/hero";
import { RisingWords, Sub } from "../variantParts";
import v from "../variants.module.css";

/**
 * C — SPLIT SCREEN. The right half is a black block running to the
 * viewport edge, holding the run in white on ink. Highest contrast of
 * the three, still only ink, paper and the accent.
 */
export default function HeroC() {
  const setupWords = hero.headlineSetup.split(" ").length;

  return (
    <section className={v.cHero}>
      <div className={v.cLeft}>
        <h1>
          <span className={v.setup}>
            <RisingWords text={hero.headlineSetup} />
          </span>
          <span className={`grad-line ${v.payoff} ${v.cPayoff}`}>
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

      <div className={v.cRight}>
        <div className={v.cRightInner}>
          <InViewGate className="enter">
            <Ledger tone="dark" />
          </InViewGate>
        </div>
      </div>
    </section>
  );
}
