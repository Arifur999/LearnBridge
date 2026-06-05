"use server";
import { getCookie } from "./cookiesUtils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export async function getCurrentUserFromServer() {
  const sessionToken = await getCookie("better-auth.session_token");
  if (!sessionToken) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data?.user;
    if (!user) return null;

    return {
      id:            String(user.id    ?? ""),
      email:         String(user.email ?? ""),
      name:          String(user.name  ?? "User"),
      role:          String(user.role  ?? "student").toLowerCase(),
      status:        String(user.status ?? "active").toLowerCase(),
      emailVerified: Boolean(user.emailVerified ?? false),
    };
  } catch {
    return null;
  }
}
