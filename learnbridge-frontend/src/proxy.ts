import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: string;
  exp: number;
}

function getDashboardUrl(role: string): string {
  switch (role.toUpperCase()) {
    case "ADMIN":      return "/admin/analytics";
    case "TUTOR":
    case "TRAINER":    return "/tutor/dashboard";
    case "INSTITUTE":  return "/institute/dashboard";
    case "MENTOR":     return "/mentor/dashboard";
    case "MODERATOR":  return "/moderator/dashboard";
    default:           return "/dashboard";
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const role = (decoded.role ?? "").toUpperCase();
        return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const role = (decoded.role ?? "").toUpperCase();

    const prefixMap: [string, string[]][] = [
      ["/admin",      ["ADMIN"]],
      ["/tutor",      ["TUTOR", "TRAINER"]],
      ["/institute",  ["INSTITUTE"]],
      ["/mentor",     ["MENTOR"]],
      ["/moderator",  ["MODERATOR"]],
      ["/dashboard",  ["STUDENT"]],
    ];

    for (const [prefix, allowed] of prefixMap) {
      if (pathname.startsWith(prefix) && !allowed.includes(role)) {
        return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
      }
    }
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/institute/:path*",
    "/mentor/:path*",
    "/moderator/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
