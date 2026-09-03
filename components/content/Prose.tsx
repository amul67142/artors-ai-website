import { renderArticle } from "@/lib/markdown";
import p from "./prose.module.css";

/**
 * Rendered Markdown body.
 *
 * lib/markdown.ts groups the content under each H2 into its own <section>;
 * this adds the class hooks. `float-in` is the site's existing scroll-reveal
 * (components/fx/PageFx.tsx), so sections rise into place with the same
 * easing as every other section rather than through a second motion system —
 * and one trigger per section, not one per paragraph.
 */
export default function Prose({ markdown }: { markdown: string | null | undefined }) {
  const { html } = renderArticle(markdown);
  if (!html) return null;

  const withClasses = html
    .replace(/<section data-block data-lead>/g, `<section class="${p.section} ${p.lead} float-in">`)
    .replace(/<section data-block>/g, `<section class="${p.section} float-in">`);

  return <div className={p.prose} dangerouslySetInnerHTML={{ __html: withClasses }} />;
}
