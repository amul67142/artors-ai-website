import { Fragment } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import { hero, heroLinks } from "@/lib/content/hero";
import s from "./hero.module.css";

type RisingWordsProps = {
  text: string;
  offset?: number;
  /** Walks each word along the shared gradient ramp (see .grad-line). */
  gradient?: boolean;
};

/** Word-level mask reveal. */
function RisingWords({ text, offset = 0, gradient = false }: RisingWordsProps) {
  const words = text.split(" ");
  const last = Math.max(words.length - 1, 1);

  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            className="rise-mask"
            style={
              {
                "--i": i + offset,
                ...(gradient ? { "--p": i / last } : {}),
              } as React.CSSProperties
            }
          >
            <span>{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/**
 * The dawn composition: centered claim over a rising orbital arc and a
 * blue-cyan horizon glow, with the six services as real links along
 * the base. Server Component; all motion is CSS, paused off-screen by
 * InViewGate.
 */
export default function Hero() {
  const setupWords = hero.headlineSetup.split(" ").length;

  return (
    <InViewGate>
      <section className={s.hero}>
        <div className={s.grid} aria-hidden="true" />
        <div className={s.glow} aria-hidden="true" />
        <div className={s.orbit} aria-hidden="true">
          <div className={s.orbitSpin}>
            <span className={`${s.node} ${s.nodeA}`} />
            <span className={`${s.node} ${s.nodeB}`} />
            <span className={`${s.node} ${s.nodeC}`} />
          </div>
        </div>

        <div className={`shell ${s.stack}`}>
          <h1 className={s.headline}>
            <span>
              <RisingWords text={hero.headlineSetup} />
            </span>
            <span className="grad-line">
              <RisingWords text={hero.headlinePayoff} offset={setupWords} gradient />
            </span>
          </h1>

          <p className={`${s.sub} enter`} style={{ "--i": 7 } as React.CSSProperties}>
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

          <div className={`${s.ctas} enter`} style={{ "--i": 8 } as React.CSSProperties}>
            <Button href={hero.primaryCta.href} label={hero.primaryCta.label} arrow />
            <Button
              href={hero.secondaryCta.href}
              label={hero.secondaryCta.label}
              variant="ghost"
            />
          </div>
        </div>

        <nav
          className={`${s.strip} enter`}
          style={{ "--i": 9 } as React.CSSProperties}
          aria-label="What we build"
        >
          {heroLinks.map((link) => (
            <Link key={link.href} href={link.href} className={s.stripLink}>
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </InViewGate>
  );
}
