import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class UserService {
  async getProfile() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/users/profile`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? data ?? null;
    } catch {
      return null;
    }
  }

  async updateProfile(payload: { name?: string; image?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/users/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async getStudentStats() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/students/stats`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? data ?? null;
    } catch {
      return null;
    }
  }

  async getAdminAnalytics() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/admin/analytics`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? data ?? null;
    } catch {
      return null;
    }
  }

  async listUsers(page = 1, limit = 20) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_V1_URL}/admin/users?page=${page}&limit=${limit}`,
        { headers, cache: "no-store" }
      );
      if (!res.ok) return { data: [], meta: null };
      const result = await res.json();
      return {
        data: result?.data?.data ?? result?.data ?? [],
        meta: result?.data?.meta ?? result?.meta ?? null,
      };
    } catch {
      return { data: [], meta: null };
    }
  }

  async updateUserStatus(userId: string, status: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/admin/users/${userId}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async inviteModerator(email: string, name?: string) {
    const headers = await getAuthHeaders();

    // Try primary endpoint first, fall back to alternate paths
    const endpoints = [
      `${API_V1_URL}/admin/invite-moderator`,
      `${API_V1_URL}/admin/moderators/invite`,
      `${API_V1_URL}/admin/invite`,
    ];

    const payload: Record<string, string> = { email, role: "MODERATOR" };
    if (name) payload.name = name;

    let lastError = "Invite failed";
    for (const url of endpoints) {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return data;
      if (res.status === 404) continue; // try next endpoint
      lastError = data?.message || `Request failed (${res.status})`;
      throw new Error(lastError);
    }
    throw new Error(lastError);
  }

  async listModerators() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/admin/moderators`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data?.data ?? data ?? [];
    } catch {
      return [];
    }
  }
}

export const userService = new UserService();
