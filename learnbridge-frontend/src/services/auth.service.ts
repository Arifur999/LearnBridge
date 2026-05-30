// Auth service — client-side helpers (BetterAuth migration)
// Sign-in / Sign-up / Sign-out are now handled by:
//   POST /api/auth/sign-in/email   (backend BetterAuth)
//   POST /api/auth/sign-up/email   (backend BetterAuth)
//   POST /api/auth/sign-out        (backend BetterAuth)
//
// Server-side session → getCurrentUserFromServer() in @/lib/auth.ts
// Client-side session → useSession() / authClient in @/lib/auth-client.ts

export const TOKEN_KEY    = "better-auth.session_token";
export const AUTH_USER_KEY = "better-auth.session_token"; // kept for compat

class AuthService {
  isLoggedIn(): boolean {
    // Client-side: we can only check cookie existence via document.cookie
    // (httpOnly cookies are NOT readable in JS — presence check only)
    if (typeof document === "undefined") return false;
    return document.cookie.includes("better-auth.session_token");
  }

  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }
}

export const authService = new AuthService();
