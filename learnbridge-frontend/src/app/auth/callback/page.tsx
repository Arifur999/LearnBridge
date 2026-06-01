"use client";

/**
 * OAuth Callback Page
 *
 * After Google OAuth completes, BetterAuth redirects here.
 * The backend's session cookie (SameSite=None) is still in the browser,
 * so we cross-fetch /api/auth/get-session to retrieve the token, then
 * set it as a frontend-domain cookie via a server action.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setSessionTokenInCookies } from "@/lib/tokenUtils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const finishAuth = async () => {
      try {
        // The backend cookie (SameSite=None; Secure) is sent cross-site by
        // the browser even though we are on the frontend domain.
        const res = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
          credentials: "include",
          cache:       "no-store",
        });

        if (!res.ok) { setError(true); return; }

        const data  = await res.json();
        const token = data?.session?.token as string | undefined;

        if (!token) { setError(true); return; }

        // Server action — sets an httpOnly cookie on the *frontend* domain
        await setSessionTokenInCookies(token);

        // Redirect to home; middleware will forward to the right dashboard
        router.replace("/");
      } catch {
        setError(true);
      }
    };

    finishAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-white">
        <p className="text-lg font-semibold">Google sign-in failed</p>
        <a href="/login" className="text-sm text-primary underline underline-offset-4">
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-white">
      <svg className="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor" strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
      <p className="text-sm text-white/60">Completing sign-in…</p>
    </div>
  );
}
