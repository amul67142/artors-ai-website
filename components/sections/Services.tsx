import Link from "next/link";
import { pillars } from "@/lib/content/services";
import s from "./services.module.css";

/**
 * What we do — the AGR services grammar: label, one line of context,
 * then seven index rows. Each row: number, uppercase title with its
 * result line, three micro-deliverables. Hover slides the title and
 * surfaces the arrow; every row links to its pillar page.
 */

function Arrow({ className }: { className?: string }) {
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

export default function Services() {
  return (
    <section className={s.section} aria-labelledby="services-heading">
      <div className="shell">
        <div className={`${s.head} float-in`}>
          <h2 id="services-heading" className={s.label}>
            What we do
          </h2>
          <p className={s.intro}>Seven practices, usually combined.</p>
        </div>

        <ul className={s.list}>
          {pillars.map((p, i) => (
            <li
              key={p.href}
              className={`${s.rowWrap} float-in`}
              style={{ "--i": Math.min(i, 3) } as React.CSSProperties}
            >
              <Link href={p.href} className={s.row}>
                <span className={s.num}>{p.index}</span>

                <span className={s.main}>
                  <span className={s.titleLine}>
                    <span className={s.title}>{p.title}</span>
                    <Arrow className={s.arrow} />
                  </span>
                  <span className={s.result}>{p.result}</span>
                </span>

                <span className={s.items}>
                  {p.items.map((item) => (
                    <span key={item} className={s.item}>
                      {item}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
