import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class MentorService {
  async getOverview() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/mentor/overview`, {
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

  async getAssignedCourses() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/mentor/courses`, {
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

  async getCourseRoster(courseId: string) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/mentor/courses/${courseId}/roster`, {
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
      const res = await fetch(`${API_V1_URL}/mentor/profile`, {
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

  async updateProfile(payload: { bio?: string; specialization?: string; image?: string }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/mentor/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async getStudents() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/mentor/students`, {
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

export const mentorService = new MentorService();
