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

function getRoleFromToken(raw: string | undefined): string {
  if (!raw) return "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return (decoded.role ?? "").toUpperCase();
  } catch {
    return "";
  }
}

function getRoleFromAuthUser(raw: string | undefined): string {
  if (!raw) return "";
  const attempts = [raw, decodeURIComponent(raw)];
  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt);
      if (parsed?.role && typeof parsed.role === "string") {
        return parsed.role.toUpperCase();
      }
    } catch {
      // try next
    }
  }
  return "";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken  = request.cookies.get("accessToken")?.value;
  const rawUser   = request.cookies.get("authUser")?.value;

  // Derive role — JWT is authoritative, authUser cookie is fallback
  const role = getRoleFromToken(rawToken) || getRoleFromAuthUser(rawUser);

  const isAuthenticated = !!(rawToken || rawUser);

  // --- /login and /register: redirect already-logged-in users to their dashboard ---
  if (pathname === "/login" || pathname === "/register") {
    if (role) {
      return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
    }
    return NextResponse.next();
  }

  // --- Protected routes: require authentication ---
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Role-based access control ---
  if (role) {
    const prefixMap: [string, string[]][] = [
      ["/admin",      ["ADMIN"]],
      ["/tutor",      ["TUTOR", "TRAINER"]],
      ["/trainer",    ["TUTOR", "TRAINER"]],
      ["/institute",  ["INSTITUTE"]],
      ["/mentor",     ["MENTOR"]],
      ["/moderator",  ["MODERATOR"]],
      ["/student",    ["STUDENT"]],
      ["/dashboard",  ["STUDENT"]],
    ];

    for (const [prefix, allowed] of prefixMap) {
      if (pathname.startsWith(prefix) && !allowed.includes(role)) {
        return NextResponse.redirect(new URL(getDashboardUrl(role), request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/tutor/:path*",
    "/trainer/:path*",
    "/institute/:path*",
    "/mentor/:path*",
    "/moderator/:path*",
    "/student/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
