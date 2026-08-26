/**
 * Generates an ADMIN_PASSWORD_HASH for .env.local.
 *
 *   npm run admin:hash -- 'your new password'
 *
 * Paste the output into .env.local (and into hPanel's env store for
 * production). The plaintext is never written anywhere.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run admin:hash -- 'your new password'");
  process.exit(1);
}
if (password.length < 10) {
  console.error(`Refusing: ${password.length} characters. Use at least 10.`);
  process.exit(1);
}
const salt = randomBytes(16);
const key = await scryptAsync(password.normalize("NFKC"), salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`ADMIN_PASSWORD_HASH=scrypt$16384$8$1$${salt.toString("base64")}$${key.toString("base64")}`);
