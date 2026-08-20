import type { Metadata } from "next";
import LeadForm from "@/components/lead/LeadForm";
import l from "@/components/lead/lead.module.css";

export const metadata: Metadata = {
  title: "Contact | Artors",
  description:
    "Book a free strategy call. Tell us the number you want moved; we reply within a day with a clear next step.",
};

/**
 * The no-JS and direct-visit home of the lead form. Site CTAs open
 * the same form in the consultation popup.
 */
export default function ContactPage() {
  return (
    <main id="main" style={{ paddingTop: 150 }}>
      <section className={l.embed} aria-labelledby="contact-heading">
        <div className={`shell ${l.embedGrid}`}>
          <div>
            <p className={l.kicker}>Free strategy call</p>
            <h1 id="contact-heading" className={l.embedTitle}>
              Tell us the number you want moved.
            </h1>
            <p className={l.embedText}>
              Revenue, cost, hours, response time. We reply within a day with a
              clear, itemised next step. No spam, no retainer pitch.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </main>
  );
}
