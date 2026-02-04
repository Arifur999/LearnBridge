import { API_BASE_URL } from "@/lib/config";
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
}

interface DecodedToken {
  id: string;
  email: string;
  role: "admin" | "trainer" | "student";
  name?: string;
  exp: number;
}

const extractAccessToken = (data: any) => {
  const token =
    (
    data?.data?.accessToken ??
    data?.data?.token ??
    data?.data?.jwt ??
    data?.accessToken ??
    data?.token ??
    data?.jwt
    );

  if (typeof token === "string" && token.startsWith("Bearer ")) {
    return token.slice(7);
  }

  return token;
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
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
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

    const user = data?.data?.user ?? data?.user;
    if (user) {
      Cookies.set(AUTH_USER_KEY, JSON.stringify(user), {
        expires: 7,
        path: "/",
      });
    }

    return { data, setCookie };
  }

  async signup(payload: SignupPayload) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
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

    const user = data?.data?.user ?? data?.user;
    if (user) {
      Cookies.set(AUTH_USER_KEY, JSON.stringify(user), {
        expires: 7,
        path: "/",
      });
    }

    return { data, setCookie };
  }

  logout() {
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
    } catch (error) {
      return this.parseUserCookie(rawUser);
    }
  }

  isLoggedIn() {
    const token = Cookies.get(TOKEN_KEY);
    return !!token;
  }
}

export const authService = new AuthService();
