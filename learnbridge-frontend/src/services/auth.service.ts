// Auth service — client-side helpers
// Sign-in / Sign-up / Sign-out are handled by BetterAuth:
//   POST /api/auth/sign-in/email
//   POST /api/auth/sign-up/email
//   POST /api/auth/sign-out
//
// Server-side session → getCurrentUserFromServer() in @/lib/auth.ts
// Client-side session → useSession() in @/lib/auth-client.ts

class AuthService {
  async logout(): Promise<void> {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }
}

export const authService = new AuthService();
