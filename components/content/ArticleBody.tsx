import { renderArticle } from "@/lib/markdown";
import Prose from "./Prose";
import Contents from "./Contents";
import b from "./articleBody.module.css";

/**
 * Body + contents rail, side by side on a wide screen.
 *
 * The rail is what fills the column the reading measure leaves empty. Below
 * 1100px it disappears and the body simply takes the width, so nothing is
 * duplicated on a phone.
 */
export default function ArticleBody({
  markdown,
  children,
}: {
  markdown: string | null | undefined;
  /** FAQ, related links, CTA — anything that follows the body in the column. */
  children?: React.ReactNode;
}) {
  const { headings } = renderArticle(markdown);

  return (
    <div className={b.grid}>
      <div className={b.main}>
        <Prose markdown={markdown} />
        {children}
      </div>
      <aside className={b.aside}>
        <Contents headings={headings} />
      </aside>
    </div>
  );
}
