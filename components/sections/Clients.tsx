import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import s from "./clients.module.css";

import spacetrans from "@/public/clients/spacetrans.png";
import godrej from "@/public/clients/godrej.svg";
import emaar from "@/public/clients/emaar.png";
import eldeco from "@/public/clients/eldeco.png";
import advitya from "@/public/clients/advitya.png";

/**
 * Client strip between the hero and the problem section. One quiet
 * line: label left, marks right, grayscale at rest.
 *
 * ⚠ PLACEHOLDERS (Vedansh's instruction, 2026-08-20): Spacetrans is a
 * real engagement; Emaar, Godrej, Eldeco and Advitya are dummy marks
 * for layout only. Replace or confirm every mark before launch —
 * docs/PLAN.md §7. Real brands shown as clients without an engagement
 * are a legal and trust liability.
 */

const clients = [
  { name: "Spacetrans Media", src: spacetrans },
  { name: "Godrej Properties", src: godrej },
  { name: "Emaar India", src: emaar },
  { name: "Eldeco Group", src: eldeco },
  { name: "Advitya", src: advitya },
];

export default function Clients() {
  return (
    <section className={s.section} aria-label="Brands we work with">
      <Reveal>
        <div className={`shell ${s.row}`}>
          <p className={s.label}>Brands we work with</p>
          <ul className={s.marks}>
            {clients.map((c) => (
              <li key={c.name} className={s.mark}>
                <Image src={c.src} alt={c.name} title={c.name} />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
