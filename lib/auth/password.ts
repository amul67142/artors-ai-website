import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password checking — docs/ADMIN.md §2.
 *
 * Two ways to configure the admin password, checked in this order:
 *
 *   ADMIN_PASSWORD_HASH   a scrypt hash; the password itself is stored
 *                         nowhere. Generate with: npm run admin:hash -- '…'
 *   ADMIN_PASSWORD        the plain password.
 *
 * Plain is the default because it is one paste into the host's env editor,
 * and the hash format's separators are mangled by some of those editors.
 * The security difference is narrower than it first looks: the same env store
 * already holds DATABASE_URL and SMTP_PASS in the clear, so anything able to
 * read ADMIN_PASSWORD already has the database and the mailbox. The hash only
 * helps when that one value leaks on its own — a screenshot, a pasted config.
 * Prefer it when that is a real risk. Both paths compare in constant time.
 *
 * scrypt comes from node:crypto, so neither path adds a dependency.
 */

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
  opts: { N: number; r: number; p: number },
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

/** Stored form: scrypt$N$r$p$<salt-b64>$<key-b64>. Cost parameters are inline,
 *  so raising them later does not invalidate hashes made under the old ones. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(password.normalize("NFKC"), salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/**
 * Constant-time compare of two plaintext passwords.
 *
 * timingSafeEqual throws when the buffers differ in length, and the length
 * itself would leak, so both sides are reduced to a fixed-width SHA-256 digest
 * first. That is not password storage — it only equalises the comparison.
 */
export function verifyPlainPassword(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input.normalize("NFKC")).digest();
  const b = createHash("sha256").update(expected.normalize("NFKC")).digest();
  return timingSafeEqual(a, b);
}

/** Constant-time compare against a stored hash. False on malformed input, never throws. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const [, n, r, p, saltB64, keyB64] = parts;
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(keyB64, "base64");
    const actual = await scryptAsync(password.normalize("NFKC"), salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
