import type { Heading } from "@/lib/markdown";
import c from "./contents.module.css";

/**
 * The contents rail.
 *
 * Exists for two reasons. It makes a long page navigable — you can see its
 * shape before committing to reading it, which is what the numbered headings
 * in the body correspond to. And it puts the empty right-hand column to work:
 * a 66ch measure inside a 1440px shell was leaving half the screen blank,
 * which is much of why these pages read as unformatted text.
 *
 * Sticky on desktop, hidden below it — on a phone the body is already the
 * whole width and a duplicate list of links would just be something to scroll
 * past. Smooth scrolling to an anchor is handled globally in globals.css.
 */
export default function Contents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;

  return (
    <nav className={c.rail} aria-label="On this page">
      <p className={c.label}>On this page</p>
      <ol className={c.list}>
        {headings.map((h, i) => (
          <li key={h.id} className={c.item}>
            <a href={`#${h.id}`} className={c.link}>
              <span className={c.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={c.text}>{h.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
