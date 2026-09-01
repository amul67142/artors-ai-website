/**
 * Renders one or more JSON-LD graphs.
 *
 * A server component with no client cost: this is a plain <script> tag in the
 * server-rendered HTML, which is what crawlers read. Nulls are filtered so a
 * caller can pass a builder that returned nothing (an empty FAQ, say) without
 * guarding at every call site.
 */
export default function JsonLd({
  schema,
}: {
  schema: Record<string, unknown> | (Record<string, unknown> | null)[];
}) {
  const graphs = (Array.isArray(schema) ? schema : [schema]).filter(Boolean);
  if (graphs.length === 0) return null;

  return (
    <>
      {graphs.map((graph, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Content is built from our own typed data, never user input.
          // The escape guards against a "</script>" sequence in any string.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(graph).replace(/</g, "\u003c"),
          }}
        />
      ))}
    </>
  );
}
