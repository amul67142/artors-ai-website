import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/dal";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in — Artors Admin" };

export default async function LoginPage() {
  // proxy.ts bounces anyone holding a cookie, but that check is only optimistic
  // (it does not verify the signature), so confirm properly here too.
  if (await getAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Artors
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Admin sign in</h1>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
