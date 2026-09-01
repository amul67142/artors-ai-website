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
