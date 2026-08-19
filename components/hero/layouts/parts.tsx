import { Fragment } from "react";
import { hero } from "@/lib/content/hero";
import L from "./layouts.module.css";

/** Word-level mask reveal, shared by every layout. */
export function RisingWords({
  text,
  offset = 0,
  gradient = false,
}: {
  text: string;
  offset?: number;
  gradient?: boolean;
}) {
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

/** Both headline sentences, the payoff carrying the gradient. */
export function Headline({ className }: { className?: string }) {
  const setupWords = hero.headlineSetup.split(" ").length;
  return (
    <h1 className={className}>
      <span>
        <RisingWords text={hero.headlineSetup} />
      </span>
      <span className="grad-line">
        <RisingWords text={hero.headlinePayoff} offset={setupWords} gradient />
      </span>
    </h1>
  );
}

/** The sub-headline with its three emphasised outcomes. */
export function Sub({ className }: { className?: string }) {
  return (
    <p className={`${L.sub} ${className ?? ""}`}>
      {hero.sub.map((seg, i) =>
        seg.em ? (
          <strong key={i} className={L.subEm}>
            {seg.text}
          </strong>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        ),
      )}
    </p>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M3 11L11 3M11 3H4M11 3v7" />
    </svg>
  );
}
