"use server";

import { setSessionTokenInCookies } from "@/lib/tokenUtils";
import { deleteCookie } from "@/lib/cookiesUtils";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
// Origin header for the server-side relay calls. better-auth's CSRF check
// rejects requests that carry a cookie but no Origin/Referer ("Missing or null
// Origin"). NEXT_PUBLIC_APP_URL is often unset/empty on Vercel, so we fall back
// (with `||`, which also catches empty strings) to BACKEND_URL — the backend's
// own origin is always in its trustedOrigins, so this always passes.
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || BACKEND_URL || "http://localhost:3000";

export interface LoginActionState {
  success:  boolean;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id:     string;
      role:   string;
      email:  string;
      name?:  string;
    };
  };
}

export interface SignupActionState {
  success:  boolean;
  message?: string;
  data?: {
    user?: {
      id:    string;
      role:  string;
      email: string;
      name?: string;
    };
  };
}

export const loginAction = async (
  _prevState: LoginActionState,
  formData:   FormData,
): Promise<LoginActionState> => {
  const email    = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, message: "Email and password are required" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-in/email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ email, password }),
      cache:   "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message ?? data?.error?.message ?? "Login failed",
      };
    }

    const token = data?.token as string | undefined;
    const user  = data?.user;

    if (!token) {
      return { success: false, message: "Login failed: no session token received" };
    }

    await setSessionTokenInCookies(token);

    return {
      success: true,
      data: {
        token,
        user: user
          ? {
              id:    String(user.id    ?? ""),
              email: String(user.email ?? email),
              role:  String(user.role  ?? "student").toLowerCase(),
              name:  String(user.name  ?? "User"),
            }
          : undefined,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Login failed",
    };
  }
};

export const signupAction = async (
  _prevState: SignupActionState,
  formData:   FormData,
): Promise<SignupActionState> => {
  const name     = formData.get("name")?.toString();
  const email    = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirm  = formData.get("confirmPassword")?.toString();
  const rawRole  = formData.get("role")?.toString() ?? "student";
  const role     = rawRole.toUpperCase() === "TUTOR" || rawRole.toUpperCase() === "TRAINER"
    ? "TRAINER"
    : "STUDENT";

  if (!name || !email || !password || !confirm) {
    return { success: false, message: "All fields are required" };
  }
  if (password !== confirm) {
    return { success: false, message: "Passwords do not match" };
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/sign-up/email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ name, email, password, role }),
      cache:   "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message ?? data?.error?.message ?? "Signup failed",
      };
    }

    return {
      success: true,
      message: "Account created successfully! Please log in.",
      data: { user: data?.user },
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Signup failed",
    };
  }
};

export const logoutAction = async () => {
  await deleteCookie("better-auth.session_token");
};

export const sendVerificationOTPAction = async (
  email: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/email-otp/send-verification-otp`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ email }),
      cache:   "no-store",
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { success: false, message: d?.message ?? "Failed to send OTP" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to send OTP" };
  }
};

export const verifyEmailOTPAction = async (
  email: string,
  otp:   string,
): Promise<{ success: boolean; message?: string; token?: string }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/email-otp/verify-email`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ email, otp }),
      cache:   "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, message: data?.message ?? data?.error?.message ?? "Invalid OTP" };
    }
    const token = data?.token as string | undefined;
    if (token) await setSessionTokenInCookies(token);
    return { success: true, token };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Verification failed" };
  }
};

export const forgotPasswordAction = async (
  email: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/forget-password`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ email }),
      cache:   "no-store",
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { success: false, message: d?.message ?? "Failed to send reset email" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Failed to send reset email" };
  }
};

export const resetPasswordAction = async (
  token:       string,
  newPassword: string,
): Promise<{ success: boolean; message?: string }> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Origin": APP_URL },
      body:    JSON.stringify({ token, newPassword }),
      cache:   "no-store",
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { success: false, message: d?.message ?? "Password reset failed" };
    }
    return { success: true };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Password reset failed" };
  }
};
