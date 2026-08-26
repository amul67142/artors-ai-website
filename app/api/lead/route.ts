import { NextResponse } from "next/server";
import { z } from "zod";
import { persistLead, notifyEmail, confirmLead } from "@/lib/leads/deliver";

/**
 * The lead endpoint — docs/BACKEND.md §4.
 * Order: anti-spam → validate → persist (source of truth) → notify.
 * Bots always receive a happy {ok:true} and silence.
 */

const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  sourcePath: z.string().trim().max(200).optional().or(z.literal("")),
  website: z.string().optional(), // honeypot
});

/** 5 submissions per IP per 10 minutes. In-memory per instance — the
 *  volume is tens a week; moves to a MySQL table only if abuse shows. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // unbounded-growth guard
  return list.length > LIMIT;
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const d = parsed.data;

  // Honeypot: pretend success, write nothing.
  if (d.website) return NextResponse.json({ ok: true });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: true });

  const lead = {
    name: d.name,
    phone: d.phone,
    company: d.company || undefined,
    email: d.email || undefined,
    service: d.service || undefined,
    message: d.message || undefined,
    sourcePath: d.sourcePath || undefined,
    ip,
    userAgent: req.headers.get("user-agent")?.slice(0, 256) ?? undefined,
  };

  // Persist first — the source of truth.
  let id: number | null = null;
  try {
    id = await persistLead(lead);
  } catch (e) {
    console.error("[lead:persist-failed]", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Notify second — best-effort, never fails the request. The team
  // notification and the visitor confirmation go out together.
  await Promise.allSettled([notifyEmail(lead, id), confirmLead(lead, id)]).then(
    (rs) =>
      rs.forEach((r) => {
        if (r.status === "rejected") console.error("[lead:notify-failed]", r.reason);
      }),
  );

  return NextResponse.json({ ok: true });
}
