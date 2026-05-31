import { useState, useEffect } from "react";

export interface SessionUser {
  id:      string;
  name:    string;
  email:   string;
  role:    string;
  status?: string;
  image?:  string;
}

export interface Session {
  user:      SessionUser | null;
  isPending: boolean;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

async function fetchSession(): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      credentials: "include",
      cache:       "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const u = data?.user;
    if (!u) return null;
    return {
      id:     String(u.id    ?? ""),
      name:   String(u.name  ?? "User"),
      email:  String(u.email ?? ""),
      role:   String(u.role  ?? "student").toLowerCase(),
      status: String(u.status ?? "active").toLowerCase(),
      image:  u.image ?? undefined,
    };
  } catch {
    return null;
  }
}

export function useSession(): Session {
  const [user,      setUser]      = useState<SessionUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetchSession().then((u) => {
      setUser(u);
      setIsPending(false);
    });
  }, []);

  return { user, isPending };
}

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    window.location.href = "/login";
  }
}

export const authClient = {
  useSession,
  signOut,
  getSession: fetchSession,
};
