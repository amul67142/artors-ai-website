import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { who } from "@/lib/content/about";
import Team from "@/components/sections/Team";
import s from "@/app/pages.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About | Artors",
  description:
    "A senior AI agency in Gurugram. The people who scope your system design it, build it, and stay on it. No handoffs, no account managers.",
};

const why = [
  {
    title: "Outcomes, not tech jargon",
    text: "We measure success in revenue, cost and hours saved — not features shipped. Every engagement starts by naming the number to move.",
  },
  {
    title: "We speak Indian business",
    text: "English, Hindi and Hinglish. Local buying behaviour. Workflows built for how your customers actually talk and decide.",
  },
  {
    title: "Fast to value",
    text: "Systems live in days, pilot first, so the result is proven before anything scales.",
  },
  {
    title: "We stay on the hook",
    text: "Ongoing management and optimisation. A system that keeps improving, not a handoff that gathers dust.",
  },
];

export default async function AboutPage() {
  const plain = who.statement.replace(/[[\]]/g, "");
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>About</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {plain}
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            Artors is a full-service AI agency based in Gurugram, working with businesses across
            India. We build the systems that answer, book, follow up, automate and report — so
            your numbers move.
          </p>
        </div>
      </section>

      <Team />

      <section className={s.section} aria-labelledby="why-heading" style={{ paddingTop: 0 }}>
        <div className="shell">
          <h2 id="why-heading" className={`${s.sectionLabel} float-in`}>
            Judge us on your numbers, not on our tech
          </h2>
          <ol className={s.rows}>
            {why.map((w, i) => (
              <li key={w.title} className={`${s.row} float-in`} style={{ "--i": i } as React.CSSProperties}>
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={s.rowTitle}>{w.title}</h3>
                  <p className={s.rowText}>{w.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="float-in" style={{ marginTop: 40 }}>
            <p className={s.closing} style={{ marginTop: 0, marginBottom: 24 }}>
              Gurugram-based. Working across India. Everything delivered remotely and managed
              online.
            </p>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
