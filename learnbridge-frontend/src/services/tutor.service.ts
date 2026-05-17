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
      const dataField = result?.data;
      const isObj = dataField && typeof dataField === "object" && !Array.isArray(dataField);
      const list = Array.isArray(dataField)
        ? dataField
        : isObj && Array.isArray(dataField.tutors)
          ? dataField.tutors
          : isObj && Array.isArray(dataField.data)
            ? dataField.data
            : Array.isArray(result)
              ? result
              : [];
      const meta = isObj
        ? (dataField.pagination ?? dataField.meta ?? null)
        : (result?.meta ?? null);
      return { data: list, meta };
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
      const list = data?.data ?? data ?? [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  async updateFeaturedTutor(tutorId: string, isFeatured: boolean) {
    const headers = await getAuthHeaders();
    if (isFeatured) {
      // POST /admin/featured-tutors/:tutorId
      const res = await fetch(`${API_V1_URL}/admin/featured-tutors/${tutorId}`, {
        method: "POST",
        headers,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as Record<string, unknown>)?.message as string || "Failed to add featured");
      return data;
    } else {
      // DELETE /admin/featured-tutors/:tutorId
      const res = await fetch(`${API_V1_URL}/admin/featured-tutors/${tutorId}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as Record<string, unknown>)?.message as string || "Failed to remove featured");
      return data;
    }
  }

  async deleteTutor(tutorId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/admin/users/${tutorId}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as Record<string, unknown>)?.message as string || "Delete failed");
    return data;
  }

  private async safeJson(res: Response) {
    const text = await res.text();
    if (text.trimStart().startsWith("<")) {
      throw new Error(`Endpoint not found (received HTML). Status: ${res.status}`);
    }
    return JSON.parse(text);
  }

  async getMyCourses() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/trainer/courses`, {
        headers,
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await this.safeJson(res);
      const raw = data?.data ?? data ?? [];
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }

  async createCourse(payload: {
    title: string;
    description: string;
    category: string;
    price?: number;
    image?: string;
  }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/trainer/courses`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await this.safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to create course");
    return data?.data ?? data;
  }

  async updateCourse(id: string, payload: {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    image?: string;
  }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/trainer/courses/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await this.safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to update course");
    return data?.data ?? data;
  }

  async deleteCourse(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/trainer/courses/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await this.safeJson(res);
    if (!res.ok) throw new Error(data?.message || "Failed to delete course");
    return data;
  }

  async getMyBookings(page = 1, limit = 20) {
    const paths = [
      `/trainer/bookings?page=${page}&limit=${limit}`,
      `/tutor/bookings?page=${page}&limit=${limit}`,
      `/tutors/sessions/mine?page=${page}&limit=${limit}`,
    ];
    for (const path of paths) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_V1_URL}${path}`, { headers, cache: "no-store" });
        if (!res.ok) continue;
        const result = await res.json();
        const data = result?.data?.data ?? result?.data ?? result ?? [];
        const list = Array.isArray(data) ? data : [];
        if (list.length > 0 || path === paths[paths.length - 1]) {
          return {
            data: list,
            meta: result?.data?.meta ?? result?.meta ?? null,
          };
        }
      } catch { /* try next */ }
    }
    return { data: [], meta: null };
  }
}

export const tutorService = new TutorService();
