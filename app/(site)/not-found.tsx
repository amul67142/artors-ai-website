import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { navItems } from "@/lib/content/nav";
import s from "@/app/pages.module.css";

/**
 * 404 — SEO-AUDIT.md Phase 1.7.
 *
 * Unknown paths already returned a correct 404 status; what they rendered was
 * Next's bare default, with no navigation and no way back. A 404 is a real
 * landing page — often the first thing a visitor sees after a stale link from
 * a search result — so it carries the nav and the same CTA as everywhere else.
 *
 * Lives inside (site) so it inherits the marketing header and footer. The
 * admin group has its own root layout and is deliberately excluded.
 */

export const metadata: Metadata = {
  title: "Page not found | Artors",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main">
      <section className={s.head}>
        <div className="shell">
          <p className={`${s.label} enter`}>404</p>
          <h1 className={`${s.statement} enter`} style={{ "--i": 1 } as React.CSSProperties}>
            That page isn&rsquo;t here.
          </h1>
          <p className={`${s.intro} enter`} style={{ "--i": 2 } as React.CSSProperties}>
            The link may be old, or the address may have a typo. Everything else is still
            where it was.
          </p>
        </div>
      </section>

      <section className={s.section} style={{ paddingTop: 0 }}>
        <div className="shell">
          <h2 className={`${s.sectionLabel} float-in`}>Try one of these</h2>
          <ul className={s.rows} style={{ marginTop: 20 }}>
            {navItems.map((item, i) => (
              <li
                key={item.href}
                className={`${s.row} float-in`}
                style={{ "--i": Math.min(i, 3) } as React.CSSProperties}
              >
                <span className={s.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={s.rowTitle}>
                    <Link href={item.href} className={s.inlineLink}>
                      {item.label}
                    </Link>
                  </h3>
                </div>
              </li>
            ))}
          </ul>

          <div className="float-in" style={{ marginTop: 40 }}>
            <Button href="/contact" label="Book a Consultation Call" arrow />
          </div>
        </div>
      </section>
    </main>
  );
}
