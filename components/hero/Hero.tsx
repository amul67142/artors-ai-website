import { Fragment } from "react";
import Button from "@/components/ui/Button";
import InViewGate from "@/components/ui/InViewGate";
import Ledger from "./Ledger";
import { hero } from "@/lib/content/hero";
import s from "./hero.module.css";

type RisingWordsProps = {
  text: string;
  /** Continues the stagger index across two separate lines. */
  offset?: number;
  /** Walks each word along the shared gradient ramp (see .grad-line). */
  gradient?: boolean;
};

/** Splits a line into word-level masks so they rise in sequence. */
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
          {/* A real space between masks, so the heading reads as a sentence
              to screen readers and survives copy-paste. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export default function Hero() {
  const setupWords = hero.headlineSetup.split(" ").length;

  return (
    <section className={s.hero}>
      <div className={`shell ${s.grid}`}>
        <div>
          <div className={`${s.eyebrow} enter`} style={{ "--i": 0 } as React.CSSProperties}>
            <span className={s.dot} aria-hidden="true" />
            <p className="t-eyebrow">{hero.eyebrow}</p>
          </div>

          {/* One h1. The two movements are spans, so the heading still
              reads as a single sentence to screen readers. */}
          <h1>
            <span className={`t-statement ${s.setup}`}>
              <RisingWords text={hero.headlineSetup} />
            </span>
            <span className={`t-display grad-line ${s.payoff}`}>
              <RisingWords text={hero.headlinePayoff} offset={setupWords} gradient />
            </span>
          </h1>

          <p className={`t-lead ${s.sub} enter`} style={{ "--i": 7 } as React.CSSProperties}>
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

          <p
            className={`t-caption ${s.trust} enter`}
            style={{ "--i": 9 } as React.CSSProperties}
          >
            {hero.trustLine}
          </p>
        </div>

        <InViewGate className="enter">
          <Ledger />
        </InViewGate>
      </div>
    </section>
  );
}
