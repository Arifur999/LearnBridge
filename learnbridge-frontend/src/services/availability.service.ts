import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class AvailabilityService {
  async getMyAvailabilities() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/tutor/availability`, {
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

  async createAvailability(payload: {
    day: string;
    startTime: string;
    endTime: string;
  }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/tutor/availability`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Create failed");
    return data;
  }

  async updateAvailability(id: string, payload: Partial<{ day: string; startTime: string; endTime: string }>) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/tutor/availability/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }

  async deleteAvailability(id: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/tutor/availability/${id}`, {
      method: "DELETE",
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Delete failed");
    return data;
  }
}

export const availabilityService = new AvailabilityService();
