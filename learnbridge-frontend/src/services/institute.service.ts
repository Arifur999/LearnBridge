import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class InstituteService {
  async getOverview() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/overview`, {
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

  async getCourses() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/courses`, {
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

  async createCourse(payload: FormData) {
    const headers = await getAuthHeaders();
    const { "Content-Type": _, ...headersWithoutCT } = headers as Record<string, string>;
    const res = await fetch(`${API_V1_URL}/institute/courses`, {
      method: "POST",
      headers: headersWithoutCT,
      body: payload,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Create failed");
    return data;
  }

  async updateCourse(id: string, payload: FormData) {
    const headers = await getAuthHeaders();
    const { "Content-Type": _, ...headersWithoutCT } = headers as Record<string, string>;
    const res = await fetch(`${API_V1_URL}/institute/courses/${id}`, {
      method: "PATCH",
      headers: headersWithoutCT,
      body: payload,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async deleteCourse(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/institute/courses/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Delete failed");
    return data;
  }

  async getMentors() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/mentors`, {
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

  async inviteMentor(email: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/institute/invite-mentor`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Invite failed");
    return data;
  }

  async getStudents() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/students`, {
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

  async getReviews() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/reviews`, {
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

  async getPayments() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/payments`, {
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

  async getProfile() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/institute/profile`, {
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

  async updateProfile(payload: { name?: string; description?: string; logo?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/institute/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }
}

export const instituteService = new InstituteService();
