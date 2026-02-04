import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name?: string;
  exp: number;
}

export async function getCurrentUserFromServer() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("accessToken")?.value;
  const token = rawToken?.startsWith("Bearer ")
    ? rawToken.slice(7)
    : rawToken;

  const rawUser = cookieStore.get("authUser")?.value;

  const parseUserCookie = (value?: string) => {
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
  };

  if (!token) {
    return parseUserCookie(rawUser);
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) return null;

    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name ?? "User",
    };
  } catch {
    return parseUserCookie(rawUser);
  }
}
