import Link from "next/link";

const options = [
  { id: "a", label: "A — Statement" },
  { id: "b", label: "B — Dark anchor" },
  { id: "c", label: "C — Split screen" },
];

/** Temporary bar for comparing the three heroes side by side. */
export default function Switcher({ current }: { current: string }) {
  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 20,
        transform: "translateX(-50%)",
        zIndex: 60,
        display: "flex",
        gap: 4,
        padding: 4,
        background: "var(--ink)",
        borderRadius: 100,
      }}
    >
      {options.map((o) => (
        <Link
          key={o.id}
          href={`/preview/${o.id}`}
          style={{
            padding: "9px 16px",
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            whiteSpace: "nowrap",
            background: current === o.id ? "#fff" : "transparent",
            color: current === o.id ? "var(--ink)" : "rgba(255,255,255,.72)",
          }}
        >
          {o.label}
        </Link>
      ))}
      <Link
        href="/"
        style={{
          padding: "9px 16px",
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textDecoration: "none",
          whiteSpace: "nowrap",
          color: "rgba(255,255,255,.72)",
        }}
      >
        Current
      </Link>
    </div>
  );
}
