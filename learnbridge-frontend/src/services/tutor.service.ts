import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class TutorService {
  async getAllTutors(query = "") {
    try {
      const res = await fetch(`${API_V1_URL}/tutors${query}`, {
        cache: "no-store",
      });
      if (!res.ok) return { data: [], meta: null };
      const result = await res.json();
      const raw = result?.data ?? result;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      return {
        data: list,
        meta: result?.meta ?? raw?.meta ?? null,
      };
    } catch {
      return { data: [], meta: null };
    }
  }

  async getTutorById(id: string) {
    try {
      const res = await fetch(`${API_V1_URL}/tutors/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.data ?? data ?? null;
    } catch {
      return null;
    }
  }

  async getTutorOverview() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/tutor/overview`, {
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

  async updateTutorProfile(payload: {
    bio?: string;
    hourlyRate?: number;
    categoryId?: string;
    subjectIds?: string[];
    image?: string;
  }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/tutor/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async getFeaturedTutors() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/admin/featured-tutors`, {
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

  async updateFeaturedTutor(tutorId: string, isFeatured: boolean) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/admin/featured-tutors/${tutorId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isFeatured }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async getMyBookings(page = 1, limit = 20) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_V1_URL}/tutor/bookings?page=${page}&limit=${limit}`,
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
}

export const tutorService = new TutorService();
