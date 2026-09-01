import { renderMarkdown } from "@/lib/markdown";
import p from "./prose.module.css";

/**
 * Rendered Markdown body. Tables are wrapped so they scroll on a phone
 * instead of forcing the whole page sideways.
 */
export default function Prose({ markdown }: { markdown: string | null | undefined }) {
  const html = renderMarkdown(markdown);
  if (!html) return null;

  const wrapped = html.replace(
    /<table>/g,
    `<div class="${p.tableWrap}"><table>`,
  ).replace(/<\/table>/g, "</table></div>");

  return <div className={p.prose} dangerouslySetInnerHTML={{ __html: wrapped }} />;
}
