import { NextResponse } from "next/server";
import { deliverLead } from "@/lib/leads/deliver";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: bots fill every field; humans never see this one.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (name.length < 2 || phone.length < 7) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await deliverLead({
    name,
    phone,
    company: String(body.company ?? "").trim() || undefined,
    email: String(body.email ?? "").trim() || undefined,
    service: String(body.service ?? "").trim() || undefined,
    message: String(body.message ?? "").trim().slice(0, 2000) || undefined,
  });

  return NextResponse.json({ ok: true });
}
