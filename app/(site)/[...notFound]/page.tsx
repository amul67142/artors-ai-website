import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Catch-all that routes every unmatched path into this group's not-found.
 *
 * Needed because the app has two root layouts — app/(site) and app/(admin) —
 * so there is no root-level not-found.tsx for Next to fall back to, and an
 * unknown top-level path rendered the bare framework 404 with no navigation.
 *
 * Real routes still win: Next matches specific segments before a catch-all, so
 * /admin and every defined page are unaffected. Verified after adding this.
 */
/* Without this the page inherits the layout's metadata, so a 404 would
   advertise the homepage canonical. The 404 status already keeps it out of
   the index; this stops it claiming to be something it is not. */
export const metadata: Metadata = {
  title: "Page not found | Artors",
  robots: { index: false, follow: true },
  alternates: {},
};

export default function CatchAll(): never {
  notFound();
}
