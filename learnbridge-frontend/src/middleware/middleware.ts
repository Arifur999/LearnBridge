import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // BetterAuth session cookie (http-only, set by backend)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value;

  const roleHome = (role: string) => {
    if (role === "admin")                          return "/admin";
    if (role === "trainer" || role === "tutor")    return "/tutor/dashboard";
    return "/student";
  };

  // ── Already logged in → redirect away from login/register ──
  if (pathname === "/login" || pathname === "/register") {
    if (sessionToken) {
      // Can't decode role from opaque session token in edge runtime.
      // Redirect to "/" — the root layout will send to correct dashboard.
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes — require session token ────────────────
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/student/:path*",
    "/login",
    "/register",
  ],
};
