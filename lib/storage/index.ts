import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { extname } from "node:path";

/**
 * Media storage — docs/ADMIN.md §5.
 *
 * Files land on disk under UPLOAD_DIR (default .uploads), NOT in public/:
 * public/ is scanned at build time, so a file written there after a build is
 * invisible until the next one. Bytes are served back through
 * /api/media/[key] instead, which works on any host.
 *
 * The seam is deliberate. Swapping to Cloudinary or S3 later means
 * reimplementing put/get/remove here and touching nothing else — the same
 * shape as lib/leads/deliver.ts.
 */

const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

export const MAX_BYTES = 4 * 1024 * 1024;

function root(): string {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || ".uploads");
}

/** Rejects anything that could escape the upload directory. */
function resolveKey(key: string): string {
  if (!/^[a-f0-9]{24}(\.[a-z0-9]{1,5})?$/i.test(key)) throw new Error("bad key");
  const full = path.resolve(root(), key);
  if (!full.startsWith(root() + path.sep)) throw new Error("bad key");
  return full;
}

export type StoredFile = { key: string; url: string; mimeType: string; bytes: number };

export async function put(file: File): Promise<StoredFile> {
  const ext = ALLOWED[file.type];
  if (!ext) throw new Error(`Unsupported file type: ${file.type || "unknown"}`);
  if (file.size > MAX_BYTES) throw new Error(`File is larger than ${MAX_BYTES / 1024 / 1024} MB`);

  const key = randomBytes(12).toString("hex") + ext;
  await mkdir(root(), { recursive: true });
  await writeFile(resolveKey(key), Buffer.from(await file.arrayBuffer()));

  return { key, url: `/api/media/${key}`, mimeType: file.type, bytes: file.size };
}

export async function get(key: string): Promise<{ body: Buffer; mimeType: string } | null> {
  try {
    const body = await readFile(resolveKey(key));
    const ext = extname(key).toLowerCase();
    const mimeType =
      Object.entries(ALLOWED).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
    return { body, mimeType };
  } catch {
    return null;
  }
}

export async function remove(key: string): Promise<void> {
  await unlink(resolveKey(key)).catch(() => {});
}

/** "/api/media/abc123.png" -> "abc123.png". Returns null for external URLs. */
export function keyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = /^\/api\/media\/([a-f0-9]{24}(?:\.[a-z0-9]{1,5})?)$/i.exec(url);
  return m ? m[1] : null;
}
