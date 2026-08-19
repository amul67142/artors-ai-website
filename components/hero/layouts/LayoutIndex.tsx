import Link from "next/link";
import Button from "@/components/ui/Button";
import { hero } from "@/lib/content/hero";
import { pillars } from "@/lib/content/services";
import { Headline, Sub, Arrow } from "./parts";
import L from "./layouts.module.css";

/**
 * 2 — INDEX. A studio move rather than a SaaS one: the claim on the
 * left, the whole practice listed as a numbered index on the right.
 * The hero doubles as navigation and shows the full range in a single
 * glance — which is exactly what a full-service agency with no case
 * studies has to establish first.
 */
export default function LayoutIndex() {
  return (
    <section className={L.indexHero}>
      <div className={`shell ${L.indexGrid}`}>
        <div className={L.indexLeft}>
          <Headline className={`${L.headline} ${L.indexClaim}`} />
          <Sub className="enter" />
          <div className={`${L.ctas} enter`} style={{ "--i": 8 } as React.CSSProperties}>
            <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
            <Button href={hero.secondaryCta.href} label={hero.secondaryCta.label} variant="ghost" />
          </div>
        </div>

        <nav aria-label="What we build" className="enter" style={{ "--i": 6 } as React.CSSProperties}>
          <p className={L.micro} style={{ marginBottom: 14 }}>
            What we build
          </p>
          <ul className={L.indexList}>
            {pillars.map((p) => (
              <li key={p.href} className={L.indexRow}>
                <Link href={p.href} className={L.indexLink}>
                  <span className={L.indexNum}>{p.index}</span>
                  <span className={L.indexTitle}>{p.title}</span>
                  <Arrow className={L.indexArrow} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
