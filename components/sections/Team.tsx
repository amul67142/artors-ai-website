import Image from "next/image";
import { getTeam } from "@/lib/content/db";
import s from "@/app/pages.module.css";

/**
 * "Who you'll work with" on /about — managed in Admin → Founders & team.
 *
 * Point 3 of the trust layer in docs/PLAN.md §2: named humans with real
 * photos, because an anonymous agency in this category reads as a scam.
 *
 * With nobody published it falls back to the unattributed statement about how
 * the work is staffed. That is a true claim about the operating model, so it
 * is safe to show — unlike a placeholder name or a stock portrait, which would
 * be fabricated proof and is exactly what §2 rules out.
 */

export default async function Team() {
  const people = await getTeam();

  return (
    <section
      className={s.section}
      aria-labelledby="founder-heading"
      style={{ paddingBottom: 72 }}
    >
      <div className="shell">
        <h2 id="founder-heading" className={`${s.sectionLabel} float-in`}>
          Who you&rsquo;ll work with
        </h2>

        {people.length === 0 ? (
          <div className={`${s.founder} float-in`}>
            <div className={s.portrait}>Founder photo</div>
            <div>
              <p className={s.founderName}>Founder</p>
              <p className={s.founderRole}>Founder &middot; Artors</p>
              <p className={s.founderText}>
                The person who scopes your system on the first call is the person who designs it,
                builds it and stays on it. No account managers, no junior handoffs, no ticket
                queue between you and the work.
              </p>
            </div>
          </div>
        ) : (
          people.map((person, i) => (
            <div
              key={person.id}
              className={`${s.founder} float-in`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className={s.portrait}>
                {person.photoUrl ? (
                  <Image
                    src={person.photoUrl}
                    alt={person.name}
                    fill
                    sizes="(min-width: 810px) 220px, 160px"
                    className={s.portraitImg}
                    unoptimized
                  />
                ) : (
                  "Photo"
                )}
              </div>
              <div>
                <p className={s.founderName}>{person.name}</p>
                {person.role && (
                  <p className={s.founderRole}>
                    {person.role}
                    {person.isFounder && !/founder/i.test(person.role) ? " · Founder" : ""}
                  </p>
                )}
                {person.bio && <p className={s.founderText}>{person.bio}</p>}
                {(person.linkedinUrl || person.email) && (
                  <p className={s.founderLinks}>
                    {person.linkedinUrl && (
                      <a href={person.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
