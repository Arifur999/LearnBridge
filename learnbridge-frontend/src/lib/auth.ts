import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId?: string;
  id?: string;
  email?: string;
  role: string;
  name?: string;
  exp?: number;
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

  const cookieUser = parseUserCookie(rawUser);

  if (!token) {
    if (!cookieUser) return null;
    return {
      ...cookieUser,
      role: String(cookieUser.role ?? "student").toLowerCase(),
    };
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

    const id = decoded.userId ?? decoded.id ?? cookieUser?.id ?? "";
    const role = (decoded.role ?? cookieUser?.role ?? "student").toLowerCase();
    const email = decoded.email ?? cookieUser?.email ?? "";
    const name = decoded.name ?? cookieUser?.name ?? "User";

    return { id, email, role, name };
  } catch {
    if (!cookieUser) return null;
    return {
      ...cookieUser,
      role: String(cookieUser.role ?? "student").toLowerCase(),
    };
  }
}
