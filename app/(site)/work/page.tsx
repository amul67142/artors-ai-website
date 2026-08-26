import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import ServiceFlow from "@/components/services/ServiceFlow";
import { work } from "@/lib/content/work";
import s from "@/app/pages.module.css";
import w from "./work.module.css";
import CaseStudies from "@/components/sections/CaseStudies";

export const metadata: Metadata = {
  title: "Work | Artors",
  description:
    "One system shown end to end: the recording, the transcript and the workflow behind it. Artors publishes demonstrations instead of a logo wall.",
};

export default async function WorkPage() {
  const { run } = work;
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>{work.label}</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            {work.statement}
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            {work.intro}
          </p>
        </div>
      </section>

      {/* ---- published case studies, when there are any ---- */}
      <CaseStudies />

      {/* ---- the run ---- */}
      <section className={s.section} aria-labelledby="run-heading" style={{ paddingBottom: 64 }}>
        <div className="shell">
          <div className={`${w.runHead} float-in`}>
            <div>
              <p className={w.kicker}>Demonstration · Recorded</p>
              <h2 id="run-heading" className={w.runTitle}>
                {run.title}
              </h2>
            </div>
            <ul className={w.summary}>
              {run.summary.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          {/* 01 — recording */}
          <div className={`${w.artifact} float-in`}>
            <span className={w.artNum}>01</span>
            <div>
              <h3 className={w.artTitle}>The recording</h3>
              <div className={w.audioSlot} role="group" aria-label="Call recording">
                <span className={w.audioDot} aria-hidden="true" />
                <span>Recording file drops in here. Until then, the transcript below is the call, word for word.</span>
              </div>
            </div>
          </div>

          {/* 02 — transcript */}
          <div className={`${w.artifact} float-in`}>
            <span className={w.artNum}>02</span>
            <div>
              <h3 className={w.artTitle}>The transcript</h3>
              <ol className={w.transcript}>
                {run.transcript.map((line) => (
                  <li
                    key={line.t}
                    className={`${w.line} ${line.who === "Agent" ? w.lineAgent : ""}`}
                  >
                    <span className={w.time}>{line.t}</span>
                    <span className={w.who}>{line.who}</span>
                    <span className={w.text}>{line.text}</span>
                  </li>
                ))}
              </ol>
              <div className={w.actions}>
                {run.actions.map((a) => (
                  <span key={a} className={w.action}>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 03 — workflow */}
          <div className={`${w.artifact} float-in`}>
            <span className={w.artNum}>03</span>
            <div>
              <h3 className={w.artTitle}>The workflow</h3>
              <ServiceFlow
                steps={run.flow}
                title={run.flowTitle}
                ariaLabel={`Workflow: ${run.flow.map((f) => f.label).join(", ")}.`}
              />
              <p className={w.slotNote}>
                The n8n build screenshot sits here once exported — every node, no blur.
              </p>
            </div>
          </div>

          <p className={`${w.honesty} float-in`}>{work.honesty}</p>
        </div>
      </section>

      {/* ---- case study zero ---- */}
      <section className={s.section} aria-labelledby="zero-heading" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className={`${w.zero} float-in`}>
            <h2 id="zero-heading" className={w.zeroTitle}>
              Case study zero.
            </h2>
            <p className={w.zeroText}>{work.siteLine}</p>
            <Button href="/contact" label="Book a Free Strategy Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
