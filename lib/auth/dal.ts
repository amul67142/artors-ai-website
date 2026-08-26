import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { readSession, type SessionPayload } from "./session";

/**
 * Data Access Layer — the real authorisation boundary.
 *
 * proxy.ts does an optimistic cookie-presence check to keep unauthenticated
 * traffic off the admin routes cheaply, but Next's own guidance is explicit
 * that proxy must not be the authorisation solution. Every admin page, server
 * action and route handler calls requireAdmin() here, so a route that forgets
 * the check fails closed rather than leaking.
 *
 * cache() memoises within a single render pass, so a page and its children
 * verify once, not once per component.
 */

export const getAdmin = cache(async (): Promise<SessionPayload | null> => readSession());

/** Redirects to the login page when there is no valid session. */
export async function requireAdmin(): Promise<SessionPayload> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** For route handlers, which should 401 rather than redirect. */
export async function requireAdminApi(): Promise<SessionPayload | null> {
  return getAdmin();
}
