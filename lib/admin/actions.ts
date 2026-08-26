"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { keyFromUrl, remove } from "@/lib/storage";
import { entry } from "./registry";

/**
 * Admin mutations — docs/ADMIN.md §4.
 *
 * Every action calls requireAdmin() first. Next's guidance is that Server
 * Actions are public endpoints: they are reachable by anyone who can post to
 * the app, so the session check belongs in the action itself, never only in
 * the page that renders the button.
 */

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

function fail(error: string): ActionState {
  return { ok: false, error };
}

/** Publishing changes what the marketing site shows, so its cache must drop. */
function revalidate(paths: readonly string[]) {
  revalidatePath("/", "layout");
  for (const p of paths) revalidatePath(p);
}

/** Discriminated on `ok` so callers narrow cleanly with one check. */
type Ready =
  | { ok: true; reg: NonNullable<ReturnType<typeof entry>>; db: NonNullable<ReturnType<typeof getDb>> }
  | { ok: false; state: ActionState };

async function ready(key: string): Promise<Ready> {
  await requireAdmin();
  const reg = entry(key);
  if (!reg) return { ok: false, state: fail("Unknown collection.") };
  const db = getDb();
  if (!db) return { ok: false, state: fail("No database connection.") };
  return { ok: true, reg, db };
}

export async function saveItem(
  collection: string,
  idRaw: string | null,
  formData: FormData,
): Promise<ActionState> {
  const r = await ready(collection);
  if (!r.ok) return r.state;
  const { reg, db } = r;

  const raw = Object.fromEntries(formData.entries());
  const parsed = reg.schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (path && !fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }

  const values = parsed.data as Record<string, unknown>;
  const id = idRaw ? Number(idRaw) : null;

  try {
    if (id) {
      await db.update(reg.table).set(values).where(eq(reg.table.id, id));
    } else {
      await db.insert(reg.table).values(values as never);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/duplicate/i.test(msg)) return fail("That slug is already taken.");
    console.error("[admin:save-failed]", collection, e);
    return fail("Could not save. The database rejected it.");
  }

  revalidate(reg.revalidate);
  return { ok: true };
}

export async function deleteItem(collection: string, idRaw: string): Promise<ActionState> {
  const r = await ready(collection);
  if (!r.ok) return r.state;
  const { reg, db } = r;

  const id = Number(idRaw);
  if (!Number.isInteger(id)) return fail("Bad id.");

  try {
    // Drop the uploaded file too, so deleting a row does not leave bytes behind.
    const [row] = await db.select().from(reg.table).where(eq(reg.table.id, id)).limit(1);
    if (row) {
      for (const field of ["logoUrl", "coverUrl", "avatarUrl", "photoUrl"] as const) {
        const key = keyFromUrl((row as Record<string, unknown>)[field] as string | undefined);
        if (key) await remove(key);
      }
    }
    await db.delete(reg.table).where(eq(reg.table.id, id));
  } catch (e) {
    console.error("[admin:delete-failed]", collection, e);
    return fail("Could not delete.");
  }

  revalidate(reg.revalidate);
  return { ok: true };
}

export async function setPublished(
  collection: string,
  idRaw: string,
  published: boolean,
): Promise<ActionState> {
  const r = await ready(collection);
  if (!r.ok) return r.state;
  const { reg, db } = r;

  const id = Number(idRaw);
  if (!Number.isInteger(id)) return fail("Bad id.");

  try {
    await db.update(reg.table).set({ published }).where(eq(reg.table.id, id));
  } catch (e) {
    console.error("[admin:publish-failed]", collection, e);
    return fail("Could not update.");
  }

  revalidate(reg.revalidate);
  return { ok: true };
}

/* ---------------------------------------------------------------- leads -- */

const leadStatus = z.enum(["new", "contacted", "qualified", "closed", "spam"]);

export async function setLeadStatus(idRaw: string, status: string): Promise<ActionState> {
  await requireAdmin();
  const db = getDb();
  if (!db) return fail("No database connection.");

  const parsed = leadStatus.safeParse(status);
  const id = Number(idRaw);
  if (!parsed.success || !Number.isInteger(id)) return fail("Bad request.");

  await db.update(schema.leads).set({ status: parsed.data }).where(eq(schema.leads.id, id));
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}

export async function setLeadNote(idRaw: string, note: string): Promise<ActionState> {
  await requireAdmin();
  const db = getDb();
  if (!db) return fail("No database connection.");

  const id = Number(idRaw);
  if (!Number.isInteger(id)) return fail("Bad request.");

  await db
    .update(schema.leads)
    .set({ note: note.slice(0, 20000) || null })
    .where(eq(schema.leads.id, id));
  revalidatePath("/admin/leads");
  return { ok: true };
}
