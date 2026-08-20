import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/lib/content/nav";
import lockup from "@/public/artors-lockup.png";
import s from "./footer.module.css";

/**
 * Footer: the full lockup, the primary nav, one line of place.
 * Address, registration and socials land here once supplied —
 * docs/PLAN.md §7 open items.
 */
export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={`shell ${s.inner}`}>
        <div className={s.top}>
          <Link href="/" aria-label="Artors home" className={s.lockup}>
            <Image src={lockup} alt="Artors — AI Automation" sizes="150px" />
          </Link>

          <nav aria-label="Footer">
            <ul className={s.nav}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={s.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={s.bottom}>
          <p className={s.line}>Artors · AI Agency · Gurugram, working across India</p>
          <p className={s.line}>© {new Date().getFullYear()} Artors</p>
        </div>
      </div>
    </footer>
  );
}
