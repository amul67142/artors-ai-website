/**
 * Number formatting for the calculators.
 *
 * Indian grouping throughout (12,50,000 rather than 1,250,000) because the
 * audience reads in lakhs and crores, and a Western-grouped figure is read
 * wrong at a glance — which for a calculator whose whole job is a number is
 * the only mistake that matters.
 */

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return inr.format(Math.round(value));
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return plain.format(Math.round(value));
}

/**
 * Large figures in the words the audience actually uses. ₹48,00,000 lands
 * better as "48 lakh"; anything above a crore is read in crores.
 */
export function formatCompact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const v = Math.round(value);
  if (v >= 10000000) {
    const cr = v / 10000000;
    return `₹${cr.toFixed(cr < 10 ? 2 : 1)} crore`;
  }
  if (v >= 100000) {
    const l = v / 100000;
    return `₹${l.toFixed(l < 10 ? 2 : 1)} lakh`;
  }
  return inr.format(v);
}

/** Parses a form field, clamped to a sane range. Empty reads as 0. */
export function toNumber(raw: string, max: number): number {
  const n = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}
