import Link from "next/link";
import Button from "@/components/ui/Button";
import { hero, ledger } from "@/lib/content/hero";
import { outcomes } from "@/lib/content/services";
import { Headline, Sub } from "./parts";
import L from "./layouts.module.css";

/**
 * 3 — BANDS. Horizontal rhythm instead of columns. Full-width rules
 * cut the screen into a meta rail, the statement, four results and a
 * footer, so it reads as a designed sheet rather than a landing page.
 * The headline gets the most room of the three layouts.
 */
export default function LayoutBands() {
  return (
    <section className={L.bandsHero}>
      <div className={L.bandMeta}>
        <p className={L.micro}>Artors — AI Agency</p>
        <p className={L.micro}>Gurugram, working across India</p>
        <p className={L.micro}>Live in days</p>
      </div>

      <div className={L.bandStatement}>
        <Headline className={L.bandsHeadline} />
        <Sub className="enter" />
      </div>

      <div className={L.bandResults}>
        {outcomes.map((o) => (
          <div key={o.title} className={L.resultCell}>
            <p className={L.resultTitle}>{o.title}</p>
            <p className={L.resultNote}>{o.note}</p>
          </div>
        ))}
      </div>

      <div className={L.bandFooter}>
        <div className={L.ctas}>
          <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
          <Button href={hero.secondaryCta.href} label={hero.secondaryCta.label} variant="ghost" />
        </div>
        <Link href={ledger.href} className={L.micro} style={{ textDecoration: "none" }}>
          {ledger.label} — {ledger.summary.join(" · ")} →
        </Link>
      </div>
    </section>
  );
}
