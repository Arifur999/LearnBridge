import { API_BASE_URL } from "@/lib/config";

interface LoginPayload {
  email: string;
  password: string;
}

class AuthService {
  async login(payload: LoginPayload) {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  }
}

export const authService = new AuthService();
