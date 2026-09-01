/**
 * /security — data handling. docs/PLAN.md §2 trust layer.
 *
 * Written because the site lists Healthcare as an industry, and anyone
 * handling patient data will ask three questions before they will take a
 * call: where does the data sit, what happens to call recordings, and what is
 * your position on the DPDP Act. With no answer on the site, that is a silent
 * deal-blocker.
 *
 * TWO RULES FOR EDITING THIS FILE:
 *
 * 1. Every statement here is a commitment a client can hold Artors to.
 *    Describe what is actually done. Do not describe an aspiration.
 * 2. Never claim a certification. There is no ISO 27001, no SOC 2 and no
 *    "DPDP certified" — no such certification exists in the first place.
 *    Stating a posture towards the Act is honest; implying an audit is not.
 *
 * Items marked NEEDS CONFIRMATION below are commercial or operational facts
 * only Vedansh can settle. They are written as the standard, defensible
 * position; confirm each before this page carries real weight.
 */

export const security = {
  label: "Security & data",
  statement: "Where your data sits, who can reach it, and what happens when you leave.",
  intro:
    "Automation means handing a system your customer conversations. These are the answers we would want before doing that ourselves. If something here does not meet your policy, say so on the first call — most of it is configurable.",

  sections: [
    {
      heading: "Where the data lives",
      body: [
        "Artors' own systems — this website, its lead database and its mail — run on infrastructure hosted in Mumbai, India. Lead data submitted through this site does not leave the country.",
        "For client systems, data residency is part of the scope, not an afterthought. Where an Indian region is available for the components an engagement needs, we default to it and name the location in the proposal. Where a workload has to use a provider outside India, we say so before anything is built, and you decide.",
      ],
    },
    {
      heading: "The DPDP Act",
      body: [
        "Under the Digital Personal Data Protection Act, 2023, you are the Data Fiduciary for your customers' personal data. When we build and run a system on your behalf, Artors acts as a Data Processor: we process that data on your instructions and for your stated purpose, and for nothing else.",
        "In practice that means the purpose is written into the engagement, the retention period is written into the engagement, and personal data is never reused to train a general model or shared with another client.",
        "No one is DPDP-certified — the Act provides no certification scheme, and any vendor claiming one is telling you something untrue. What we can do is contract to the obligations, name the sub-processors involved, and support you when a data principal exercises a right.",
      ],
    },
    {
      heading: "Call recordings and transcripts",
      // NEEDS CONFIRMATION: default retention period and whether recording is
      // opt-in per engagement. 90 days is the standard defensible default.
      body: [
        "Voice systems record and transcribe by default, because a system that cannot be reviewed cannot be improved. That default is yours to change: recording can be disabled entirely, limited to transcripts with no audio, or scoped to a sample.",
        "Where recording is on, callers are told at the start of the call. Recordings and transcripts are retained for an agreed window — 90 days unless your policy says otherwise — and then deleted. You can request earlier deletion of any specific recording at any time.",
        "Recordings are never used as marketing material. The sample run published on this site is our own system, not a client's.",
      ],
    },
    {
      heading: "Access and secrets",
      body: [
        "Credentials for your systems stay in your accounts wherever the integration allows it, so access is something you can revoke without asking us. Where Artors must hold a key, it is scoped to the minimum the workflow needs.",
        "Access is limited to the people actually building your system. There is no shared login and no offshore support pool.",
        "This website carries no third-party analytics, advertising pixels or session-recording scripts. Nothing you do here is sent to an ad network.",
      ],
    },
    {
      heading: "If we part ways",
      // NEEDS CONFIRMATION: this is the commercial position, not just a
      // security one. See the FAQ entry on ownership — the two must agree.
      body: [
        "The automations we build for you are yours. On exit you get the workflow definitions, the prompts, the integration configuration and your data, in a form you or another vendor can run.",
        "Nothing is locked to a proprietary Artors platform, because there isn't one — we build on tools you can hold accounts for directly. If you want to bring the work in-house later, that is a handover, not a rebuild.",
        "On request we delete the copies we hold and confirm it in writing.",
      ],
    },
    {
      heading: "Reporting a problem",
      body: [
        "If you believe you have found a security issue in something we built or run, email us and we will acknowledge it within one working day. We would much rather hear it early and awkwardly than late and politely.",
      ],
    },
  ],

  closing:
    "Have a security questionnaire, a DPA to sign, or a policy we need to fit? Send it before the call and we'll come to it with answers rather than promises.",
} as const;
