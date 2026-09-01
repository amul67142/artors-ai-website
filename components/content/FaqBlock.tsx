import f from "./faq.module.css";

/**
 * FAQ, always visible.
 *
 * Deliberately not an accordion: the SEO brief is explicit that answers must
 * not be hidden behind JavaScript. An answer a crawler has to click to see is
 * an answer that does not get quoted.
 */
export default function FaqBlock({
  items,
  heading = "Questions",
}: {
  items: { q: string; a: string }[] | null | undefined;
  heading?: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className={f.section} aria-labelledby="faq-block-heading">
      <h2 id="faq-block-heading" className={f.heading}>
        {heading}
      </h2>
      <dl className={f.list}>
        {items.map((item) => (
          <div key={item.q} className={f.item}>
            <dt className={f.q}>{item.q}</dt>
            <dd className={f.a}>{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
