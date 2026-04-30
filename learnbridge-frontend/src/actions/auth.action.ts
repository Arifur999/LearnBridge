"use server";

import { authService } from "@/services/auth.service";
import { cookies } from "next/headers"; 
import { jwtDecode } from "jwt-decode";

export interface LoginActionState {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      role: string;
      email: string;
      name?: string;
    };
  };
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name?: string;
  exp?: number;
}

const isJwt = (value: unknown) => {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value)
  );
};

const isUserLike = (value: unknown) => {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.email === "string" &&
    typeof obj.role === "string"
  );
};

const findJwtInObject = (
  value: unknown,
  depth = 0,
  seen = new Set<unknown>()
): string | null => {
  if (depth > 6) return null;
  if (isJwt(value)) return value as string;
  if (!value || typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJwtInObject(item, depth + 1, seen);
      if (found) return found;
    }
    return null;
  }

  for (const key of Object.keys(value as Record<string, unknown>)) {
    const found = findJwtInObject((value as Record<string, unknown>)[key], depth + 1, seen);
    if (found) return found;
  }

  return null;
};

const findUserInObject = (
  value: unknown,
  depth = 0,
  seen = new Set<unknown>()
): Record<string, unknown> | null => {
  if (depth > 6) return null;
  if (isUserLike(value)) return value as Record<string, unknown>;
  if (!value || typeof value !== "object") return null;
  if (seen.has(value)) return null;
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findUserInObject(item, depth + 1, seen);
      if (found) return found;
    }
    return null;
  }

  for (const key of Object.keys(value as Record<string, unknown>)) {
    const found = findUserInObject((value as Record<string, unknown>)[key], depth + 1, seen);
    if (found) return found;
  }

  return null;
};

const normalizeToken = (token: unknown) => {
  if (typeof token !== "string") return null;
  return token.startsWith("Bearer ") ? token.slice(7) : token;
};

const extractTokenFromSetCookie = (setCookie: string | null) => {
  if (!setCookie) return null;
  const candidates = ["accessToken", "token", "jwt"];
  for (const name of candidates) {
    const match = setCookie.match(new RegExp(`${name}=([^;]+)`));
    if (match?.[1]) {
      const raw = match[1];
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    }
  }
  return null;
};

const extractAccessToken = (result: unknown, setCookie?: string | null) => {
  const root =
    result && typeof result === "object" && !Array.isArray(result)
      ? (result as Record<string, unknown>)
      : {};
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : {};
  const token =
    (
    nested.accessToken ??
    nested.token ??
    nested.jwt ??
    root.accessToken ??
    root.token ??
    root.jwt
    );

  return (
    normalizeToken(token) ??
    normalizeToken(findJwtInObject(result)) ??
    normalizeToken(extractTokenFromSetCookie(setCookie ?? null))
  );
};

const buildUserFromToken = (token: string | null) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded?.email || !decoded?.role) return null;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name ?? "User",
    };
  } catch {
    return null;
  }
};

const buildFallbackUser = (email: string, name?: string) => {
  const safeName = name ?? email.split("@")[0] ?? "User";
  return {
    id: email,
    email,
    role: "student",
    name: safeName,
  };
};

const normalizeRegisterRole = (role: FormDataEntryValue | null) => {
  return role?.toString() === "tutor" ? "tutor" : "student";
};

export const loginAction = async (
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    const result = await authService.login({
      email: email.toString(),
      password: password.toString(),
    });

    const accessToken = extractAccessToken(result?.data, result?.setCookie);

    let user =
      result?.data?.data?.user ??
      result?.data?.user ??
      findUserInObject(result?.data) ??
      buildUserFromToken(accessToken) ??
      null;

    if (!user && process.env.NODE_ENV !== "production") {
      user = buildFallbackUser(email.toString());
    }

    if (typeof accessToken === "string" && accessToken.length > 0) {
      const cookieStore = await cookies();
      
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, 
        sameSite: "strict",
      });

      if (user) {
        cookieStore.set("authUser", encodeURIComponent(JSON.stringify(user)), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "strict",
        });
      }
    } else if (user) {
      const cookieStore = await cookies();
      cookieStore.set("authUser", encodeURIComponent(JSON.stringify(user)), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
      });
    } else {
      return {
        success: false,
        message: "Login failed: access token not found in response",
      };
    }

    return {
      success: true,
      data: {
        ...result.data,
        accessToken: accessToken ?? undefined,
        user: user ?? result?.data?.data?.user ?? result?.data?.user,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Login failed",
    };
  }
};

export interface SignupActionState {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: {
      id: string;
      role: string;
      email: string;
      name?: string;
    };
  };
}

export const signupAction = async (
  _prevState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const role = normalizeRegisterRole(formData.get("role"));

    if (!name || !email || !password || !confirmPassword) {
      return { success: false, message: "All fields are required" };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }

    const result = await authService.signup({
      name: name.toString(),
      email: email.toString(),
      password: password.toString(),
      role,
    });

    const accessToken = extractAccessToken(result?.data, result?.setCookie);
    let user =
      result?.data?.data?.user ??
      result?.data?.user ??
      findUserInObject(result?.data) ??
      buildUserFromToken(accessToken) ??
      null;

    if (!user && process.env.NODE_ENV !== "production") {
      user = buildFallbackUser(email.toString(), name.toString());
    }

    if (typeof accessToken === "string" && accessToken.length > 0) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
      });

      if (user) {
        cookieStore.set("authUser", encodeURIComponent(JSON.stringify(user)), {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "strict",
        });
      }
    } else if (user) {
      const cookieStore = await cookies();
      cookieStore.set("authUser", encodeURIComponent(JSON.stringify(user)), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        sameSite: "strict",
      });
    }

    return {
      success: true,
      message: "Account created successfully",
      data: {
        accessToken: accessToken ?? undefined,
        user: user ?? result?.data?.data?.user ?? result?.data?.user,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Signup failed",
    };
  }
};
