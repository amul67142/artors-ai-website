import Link from "next/link";

const options = [
  { id: "1", label: "1 — Console" },
  { id: "2", label: "2 — Index" },
  { id: "3", label: "3 — Bands" },
];

const base: React.CSSProperties = {
  padding: "9px 15px",
  borderRadius: 100,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

/** Temporary bar for comparing the three layouts. */
export default function Switcher({ current }: { current: string }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 18,
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "flex",
        gap: 3,
        padding: 3,
        background: "var(--ink)",
        borderRadius: 100,
      }}
    >
      {options.map((o) => (
        <Link
          key={o.id}
          href={`/l/${o.id}`}
          style={{
            ...base,
            background: current === o.id ? "#fff" : "transparent",
            color: current === o.id ? "var(--ink)" : "rgba(255,255,255,.7)",
          }}
        >
          {o.label}
        </Link>
      ))}
      <Link href="/" style={{ ...base, color: "rgba(255,255,255,.7)" }}>
        Current
      </Link>
    </div>
  );
}
