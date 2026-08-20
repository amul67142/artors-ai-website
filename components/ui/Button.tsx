import Link from "next/link";

type Variant = "primary" | "ghost" | "invert";

type Props = {
  href: string;
  label: string;
  variant?: Variant;
  /** Shows the diagonal arrow that swaps out on hover. */
  arrow?: boolean;
  className?: string;
};

function Arrow() {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M3 11L11 3M11 3H4M11 3v7" />
    </svg>
  );
}

/**
 * The label duplicates itself and rolls up on hover; the arrow exits
 * up-and-right while its twin arrives from down-and-left. Both run on
 * :focus-visible too, so keyboard users see the same affordance.
 * Geometry and easing: docs/DESIGN.md §3.1.
 */
export default function Button({
  href,
  label,
  variant = "primary",
  arrow = false,
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={["btn", variant === "ghost" ? "btn--ghost" : "", variant === "invert" ? "btn--invert" : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="btn__mask">
        <span className="btn__track">
          <span className="btn__label">{label}</span>
          {/* The parked duplicate. Hidden from assistive tech so the
              label is not announced twice. */}
          <span className="btn__label btn__label--ghost" aria-hidden="true">
            {label}
          </span>
        </span>
      </span>

      {arrow && (
        <span className="btn__icons" aria-hidden="true">
          <span className="btn__icon btn__icon--out">
            <Arrow />
          </span>
          <span className="btn__icon btn__icon--in">
            <Arrow />
          </span>
        </span>
      )}
    </Link>
  );
}
