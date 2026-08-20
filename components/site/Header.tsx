"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/content/nav";
import wordmark from "@/public/artors-wordmark.png";
import s from "./header.module.css";

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

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  // A passive scroll listener doing one comparison per event — no
  // requestAnimationFrame loop, nothing running when the page is still.
  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Ignore the rubber-band region and tiny jitters.
      if (y > 120 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y <= 120) setHidden(false);
      lastY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile panel on route change, and never leave the header
  // hidden while the panel is open.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // Stop the page behind the panel from scrolling.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header
      className={s.header}
      data-scrolled={scrolled}
      data-hidden={hidden && !open}
    >
      <div className={s.bar}>
        <Link href="/" className={s.logo} aria-label="Artors home">
          <Image src={wordmark} alt="Artors" priority sizes="130px" />
        </Link>

        <nav className={s.nav} aria-label="Primary">
          <ul className={s.list}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={s.link}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  <span className={s.mask}>
                    <span className={s.track}>
                      <span className={s.label}>{item.label}</span>
                      <span className={s.label} aria-hidden="true">
                        {item.label}
                      </span>
                    </span>
                  </span>
                  {item.arrow && <Arrow className={s.arrow} />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={s.panel} id="mobile-nav" data-open={open} inert={!open}>
        <nav aria-label="Primary, mobile">
          <ul className={s.panelList}>
            {navItems.map((item) => (
              <li key={item.href} className={s.panelItem}>
                <Link
                  href={item.href}
                  className={s.panelLink}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <Arrow className={s.panelArrow} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
