import "server-only";
import { marked } from "marked";

/**
 * Markdown → HTML, server-side only.
 *
 * Markdown rather than a rich-text editor because GFM gives real <table>
 * markup — which Section 3 of the SEO brief requires and which a div-based
 * editor would not produce — without adding an editor dependency to the admin.
 *
 * Input is admin-authored, behind the session check, so it is trusted content
 * and marked's output is rendered directly. If a second, less-trusted author
 * role is ever added, sanitise here first.
 */

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return "";
  return marked.parse(md, { async: false });
}

/** Rough reading time, for the insights index. 200 wpm. */
export function readingMinutes(md: string | null | undefined): number {
  if (!md) return 1;
  const words = md.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export type Heading = { id: string; text: string };

/** "Getting the hourly cost right" -> "getting-the-hourly-cost-right" */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

/**
 * Renders an article body into anchored sections.
 *
 * A flat stream of paragraphs is what made these pages read as a wall of text.
 * Grouping the content under each H2 into its own <section> buys three things
 * at once: each section can reveal on scroll as a unit rather than one trigger
 * per paragraph, the H2s can be auto-numbered by a CSS counter for rhythm, and
 * every heading gets an id so the contents rail can link to it.
 */
export function renderArticle(md: string | null | undefined): {
  html: string;
  headings: Heading[];
} {
  if (!md) return { html: "", headings: [] };

  const raw = marked.parse(md, { async: false });
  const headings: Heading[] = [];

  // Tables scroll inside their own container rather than pushing the page
  // sideways on a phone.
  const withTables = raw
    .replace(/<table>/g, '<div data-table><table>')
    .replace(/<\/table>/g, "</table></div>");

  // Split on top-level H2s, keeping the heading with the block that follows.
  const parts = withTables.split(/(?=<h2>)/);
  const sections = parts
    .filter((part) => part.trim() !== "")
    .map((part) => {
      const match = /^<h2>([\s\S]*?)<\/h2>/.exec(part);
      if (!match) {
        // Content before the first heading — the article's opening.
        return `<section data-block data-lead>${part}</section>`;
      }
      const text = match[1].replace(/<[^>]*>/g, "");
      const id = slugify(text);
      headings.push({ id, text });
      const rest = part.slice(match[0].length);
      return `<section data-block><h2 id="${id}">${match[1]}</h2>${rest}</section>`;
    })
    .join("");

  return { html: sections, headings };
}
