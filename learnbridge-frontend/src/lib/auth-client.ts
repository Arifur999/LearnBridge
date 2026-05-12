import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
}

export interface Session {
  user: SessionUser | null;
  isPending: boolean;
}

function parseAuthUser(): SessionUser | null {
  try {
    const raw = Cookies.get("authUser");
    if (!raw) return null;
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded) as SessionUser;
  } catch {
    return null;
  }
}

export function useSession(): Session {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    setUser(parseAuthUser());
    setIsPending(false);
  }, []);

  return { user, isPending };
}

export async function signOut(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } finally {
    Cookies.remove("authUser", { path: "/" });
    window.location.href = "/login";
  }
}

export const authClient = {
  useSession,
  signOut,
  getSession: parseAuthUser,
};
