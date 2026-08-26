import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy — Next 16's rename of middleware.
 *
 * This is an OPTIMISTIC check only: it looks for the session cookie's presence
 * and bounces obvious anonymous traffic away from /admin before it reaches a
 * render. It deliberately does NOT verify the signature — Next's own docs warn
 * against using proxy as the authorisation solution, and reading a secret here
 * would run on every matched request. The real check is requireAdmin() in
 * lib/auth/dal.ts, which every admin page and action calls.
 */

const COOKIE = "artors_admin";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get(COOKIE)?.value);

  if (pathname === "/admin/login") {
    if (hasCookie) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!hasCookie) {
    const url = new URL("/admin/login", request.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
