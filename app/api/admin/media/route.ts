import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/dal";
import { getDb, schema } from "@/lib/db";
import { put, MAX_BYTES } from "@/lib/storage";

/** Upload endpoint for the admin. Admin-only — uploads are writes. */
export async function POST(req: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 4 MB)" }, { status: 413 });
  }

  try {
    const stored = await put(file);
    const db = getDb();
    if (db) {
      await db
        .insert(schema.media)
        .values({
          key: stored.key,
          filename: file.name.slice(0, 240),
          mimeType: stored.mimeType,
          bytes: stored.bytes,
        })
        .catch((e) => console.error("[media:index-failed]", e));
    }
    return NextResponse.json({ url: stored.url });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 400 },
    );
  }
}
