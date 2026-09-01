import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { getClientMarks, type ClientMark } from "@/lib/content/db";
import s from "./clients.module.css";

/**
 * Client strip between the hero and the problem section. One quiet
 * line: label left, marks right, grayscale at rest.
 *
 * The marks come from the database (Admin → Logos), which is what closed the
 * placeholder risk in docs/PLAN.md §7 — the dummy Emaar/Godrej/Eldeco/Advitya
 * images are gone and nothing appears here unless it was deliberately added
 * and published.
 *
 * `kind` decides the label, and the two groups never mix: docs/PLAN.md §2.6
 * allows integration marks in this slot but forbids presenting a company as a
 * client without an engagement. With nothing published, the whole section is
 * omitted rather than shown empty.
 */

function Marks({ label, marks }: { label: string; marks: ClientMark[] }) {
  return (
    <div className={`shell ${s.row}`}>
      <p className={s.label}>{label}</p>
      <ul className={s.marks} data-fx="marks">
        {marks.map((mark) => (
          <li key={mark.id} className={s.mark}>
            {mark.logoUrl ? (
              // Sized entirely by CSS (width:auto, height:24px); these
              // dimensions only satisfy the intrinsic-size requirement.
              <Image
                src={mark.logoUrl}
                alt={mark.name}
                title={mark.name}
                width={160}
                height={40}
                unoptimized
              />
            ) : (
              <span className={s.wordmark}>{mark.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function Clients() {
  const marks = await getClientMarks();
  if (marks.length === 0) return null;

  const clients = marks.filter((m) => m.kind === "client");
  const integrations = marks.filter((m) => m.kind === "integration");

  return (
    <section className={s.section} aria-label="Brands and tools we work with">
      <Reveal>
        <div className={s.stack}>
          {clients.length > 0 && <Marks label="Trusted by" marks={clients} />}
          {integrations.length > 0 && <Marks label="Built with" marks={integrations} />}
        </div>
      </Reveal>
    </section>
  );
}
