import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/dal";
import { listLeads } from "@/lib/admin/queries";

/** CSV export of the leads table. Admin-only — this is the whole contact list. */
export async function GET(req: Request) {
  if (!(await requireAdminApi())) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const status = new URL(req.url).searchParams.get("status") ?? undefined;
  const leads = await listLeads(status);

  const columns = [
    "id",
    "createdAt",
    "name",
    "company",
    "phone",
    "email",
    "service",
    "message",
    "sourcePath",
    "status",
    "emailedAt",
    "confirmedAt",
    "note",
  ] as const;

  // A leading = + - or @ makes Excel treat the cell as a formula, so prefix a
  // quote. Contact data is attacker-supplied; this is CSV injection defence.
  const cell = (v: unknown) => {
    if (v == null) return "";
    const s = v instanceof Date ? v.toISOString() : String(v);
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const csv = [
    columns.join(","),
    ...leads.map((l) => columns.map((c) => cell(l[c])).join(",")),
  ].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="artors-leads-${stamp}.csv"`,
    },
  });
}
