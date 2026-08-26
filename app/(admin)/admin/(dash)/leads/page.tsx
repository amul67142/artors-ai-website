import Link from "next/link";
import { Download } from "lucide-react";
import { listLeads } from "@/lib/admin/queries";
import LeadsTable from "@/components/admin/LeadsTable";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin/cn";

export const dynamic = "force-dynamic";

const FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "closed", label: "Closed" },
  { value: "spam", label: "Spam" },
];

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const { status = "" } = await searchParams;
  const current = typeof status === "string" ? status : "";
  const leads = await listLeads(current);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Newest first. Nothing is ever deleted — mark it Spam instead.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={`/api/admin/leads/export${current ? `?status=${current}` : ""}`}>
            <Download className="size-3.5" aria-hidden />
            Export CSV
          </a>
        </Button>
      </header>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/leads?status=${f.value}` : "/admin/leads"}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              current === f.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          {current ? `No ${current} leads.` : "No leads yet."}
        </p>
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
