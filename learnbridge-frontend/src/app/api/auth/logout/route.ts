import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL  = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL      ?? "http://localhost:3000";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  // Tell BetterAuth backend to invalidate the session
  if (sessionToken) {
    try {
      await fetch(`${BACKEND_URL}/api/auth/sign-out`, {
        method:  "POST",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Cookie:        `better-auth.session_token=${sessionToken}`,
          Origin:        FRONTEND_URL,
        },
        cache: "no-store",
      });
    } catch {
      // Ignore — we'll clear the cookie regardless
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("better-auth.session_token", "", { path: "/", maxAge: 0 });
  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("better-auth.session_token", "", { path: "/", maxAge: 0 });
  return response;
}
