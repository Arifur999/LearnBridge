"use client";

/**
 * OAuth Callback Page
 *
 * After Google OAuth completes, the backend auth-bridge reads the session
 * server-side (first-party cookie on the backend domain) and redirects here
 * with `?token=...`. We read that token straight from the URL and store it as
 * a frontend-domain cookie — no cross-site / third-party cookie dependency.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setSessionTokenInCookies } from "@/lib/tokenUtils";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const finishAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const role  = (params.get("role") ?? "student").toLowerCase();

        if (!token) { setError(true); return; }

        // Server action — sets an httpOnly cookie on the *frontend* domain
        await setSessionTokenInCookies(token);

        // Bust the Next.js client-side router cache so all layouts re-fetch
        // the session server-side and the navbar reflects the new login state.
        router.refresh();

        // Redirect to the correct dashboard based on role
        if (role === "admin") {
          router.replace("/admin/analytics");
        } else if (role === "trainer" || role === "tutor") {
          router.replace("/tutor/dashboard");
        } else {
          router.replace("/student");
        }
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
