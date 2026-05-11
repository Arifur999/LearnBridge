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

  async inviteModerator(email: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/admin/invite-moderator`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Invite failed");
    return data;
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
