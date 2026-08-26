import { requireAdmin } from "@/lib/auth/dal";
import AdminNav from "@/components/admin/AdminNav";

/**
 * Everything under this group is behind the session check. proxy.ts already
 * turned anonymous traffic away, but that check is optimistic by design, so
 * this is the one that actually decides.
 */
export default async function DashLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminNav email={admin.email} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
