import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/admin/ui/sonner";

/**
 * Admin root layout.
 *
 * A separate root layout from the marketing site (app/(site)/layout.tsx) so the
 * admin inherits none of its chrome — no header, footer, lead modal or GSAP
 * scroll layer, all of which would be noise here and cost load time.
 *
 * `admin-root` is what activates the shadcn token set; see app/admin-theme.css
 * for why the tokens are scoped rather than global.
 */

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Artors Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="admin-root min-h-full font-sans">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
