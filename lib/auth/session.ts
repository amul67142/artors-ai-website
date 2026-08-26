import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Stateless admin session — docs/ADMIN.md §2.
 *
 * One operator, so there is no user table and no roles: the JWT carries only
 * the admin's email and an issue time. Signed with SESSION_SECRET (HS256) and
 * held in an httpOnly cookie, so client JavaScript can never read it and the
 * server can never be handed a session it did not mint.
 */

const COOKIE = "artors_admin";
const MAX_AGE_S = 60 * 60 * 8; // 8 hours — an operator session, not a login-forever cookie

function key(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set — the admin cannot issue sessions");
  return new TextEncoder().encode(secret);
}

export type SessionPayload = { email: string };

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_S}s`)
    .sign(key());
}

/** Returns the payload, or null for a missing, tampered, or expired token. */
export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return typeof payload.email === "string" ? { email: payload.email } : null;
  } catch {
    return null;
  }
}

export async function createSession(email: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, await encrypt({ email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decrypt(store.get(COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export const SESSION_COOKIE = COOKIE;
