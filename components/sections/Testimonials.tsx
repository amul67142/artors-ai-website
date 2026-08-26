import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { getTestimonials } from "@/lib/content/db";
import s from "./testimonials.module.css";

/**
 * Testimonials — managed in Admin → Testimonials.
 *
 * Renders nothing at all until a real client has said something real and it
 * has been published. docs/PLAN.md §2 forbids the placeholder testimonials
 * that shipped in the source copy PDF, so the absent state is the default
 * state, not an error: while Artors has no clients this section does not
 * exist on the page.
 */

export default async function Testimonials() {
  const items = await getTestimonials();
  if (items.length === 0) return null;

  return (
    <section className={s.section} aria-labelledby="testimonials-heading">
      <div className="shell">
        <Reveal>
          <h2 id="testimonials-heading" className={s.sectionLabel}>
            In their words
          </h2>
        </Reveal>

        <ul className={s.grid}>
          {items.map((t) => (
            <li key={t.id} className={s.cell}>
              <Reveal>
                <blockquote className={s.quote}>
                  <p className={s.quoteText}>{t.quote}</p>
                  <footer className={s.author}>
                    {t.avatarUrl && (
                      <Image
                        src={t.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className={s.avatar}
                        unoptimized
                      />
                    )}
                    <span>
                      <cite className={s.name}>{t.authorName}</cite>
                      {(t.authorRole || t.company) && (
                        <span className={s.role}>
                          {[t.authorRole, t.company].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </span>
                  </footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
