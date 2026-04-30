import { API_V1_URL } from "@/lib/config";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "accessToken";
export const AUTH_USER_KEY = "authUser";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: "student" | "tutor";
}

interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "tutor" | "student";
  name?: string;
  exp: number;
}

const getRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

const extractAccessToken = (data: unknown): string | null => {
  const root = getRecord(data);
  const nested = getRecord(root.data);
  const token =
    (
    nested.accessToken ??
    nested.token ??
    nested.jwt ??
    root.accessToken ??
    root.token ??
    root.jwt
    );

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    return token.slice(7);
  }

  return typeof token === "string" ? token : null;
};

class AuthService {
  private parseUserCookie(value?: string) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      // ignore
    }
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      // ignore
    }
    try {
      return JSON.parse(decodeURIComponent(decodeURIComponent(value)));
    } catch {
      return null;
    }
  }

  async login(payload: LoginPayload) {
    const res = await fetch(`${API_V1_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    const accessToken = extractAccessToken(data);
    if (accessToken) {
      Cookies.set(TOKEN_KEY, accessToken, { expires: 7, path: "/" });
    }

    const root = getRecord(data);
    const user = getRecord(root.data).user ?? root.user;
    if (user) {
      Cookies.set(AUTH_USER_KEY, JSON.stringify(user), {
        expires: 7,
        path: "/",
      });
    }

    return { data, setCookie };
  }

  async signup(payload: SignupPayload) {
    const res = await fetch(`${API_V1_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();
    const setCookie = res.headers.get("set-cookie");

    if (!res.ok) {
      throw new Error(data?.message || "Signup failed");
    }

    const accessToken = extractAccessToken(data);
    if (accessToken) {
      Cookies.set(TOKEN_KEY, accessToken, { expires: 7, path: "/" });
    }

    const root = getRecord(data);
    const user = getRecord(root.data).user ?? root.user;
    if (user) {
      Cookies.set(AUTH_USER_KEY, JSON.stringify(user), {
        expires: 7,
        path: "/",
      });
    }

    return { data, setCookie };
  }

  logout() {
    try {
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(AUTH_USER_KEY);
    window.location.href = "/login";
  }

  getCurrentUser() {
    const rawToken = Cookies.get(TOKEN_KEY);
    const token = rawToken?.startsWith("Bearer ")
      ? rawToken.slice(7)
      : rawToken;

    const rawUser = Cookies.get(AUTH_USER_KEY);

    if (!token) {
      return this.parseUserCookie(rawUser);
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        this.logout();
        return null;
      }

      return {
        name: decoded.name || "User",
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return this.parseUserCookie(rawUser);
    }
  }

  isLoggedIn() {
    const token = Cookies.get(TOKEN_KEY);
    return !!token;
  }
}

export const authService = new AuthService();
