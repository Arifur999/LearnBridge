import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

const unwrapData = (value: unknown): unknown => {
  if (!isRecord(value)) return value;
  if (isRecord(value.data) && "data" in value.data) return value.data.data;
  return value.data ?? value;
};

const toArray = (value: unknown): ApiRecord[] => {
  const data = unwrapData(value);
  if (Array.isArray(data)) return data.filter(isRecord);
  if (isRecord(data) && Array.isArray(data.items)) return data.items.filter(isRecord);
  if (isRecord(data) && Array.isArray(data.result)) return data.result.filter(isRecord);
  if (isRecord(data) && Array.isArray(data.bookings)) return (data.bookings as unknown[]).filter(isRecord);
  if (isRecord(data) && Array.isArray(data.sessions)) return (data.sessions as unknown[]).filter(isRecord);
  if (isRecord(data) && Array.isArray(data.slots)) return (data.slots as unknown[]).filter(isRecord);
  return [];
};

const safeFetch = async (path: string, init?: RequestInit) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_V1_URL}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : "Request failed"
    );
  }

  return data;
};

class DashboardService {
  async getStudentDashboard() {
    try {
      return unwrapData(await safeFetch("/student/dashboard"));
    } catch {
      try {
        return unwrapData(await safeFetch("/bookings"));
      } catch {
        return null;
      }
    }
  }

  async getMyBookings() {
    try {
      const data = await safeFetch("/bookings");
      return toArray(data);
    } catch {
      try {
        const data = await safeFetch("/student/dashboard");
        const unwrapped = unwrapData(data);
        return isRecord(unwrapped) ? toArray(unwrapped.bookings) : [];
      } catch {
        return [];
      }
    }
  }

  async getAdminUsers() {
    try {
      return toArray(await safeFetch("/admin/users"));
    } catch {
      return [];
    }
  }

  async getAdminBookings() {
    try {
      return toArray(await safeFetch("/admin/bookings"));
    } catch {
      return [];
    }
  }

  async updateUserStatus(userId: string, status: string) {
    return await safeFetch(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateTutorProfile(payload: ApiRecord) {
    return await safeFetch("/tutors/profile/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async getTutorProfile() {
    try {
      const data = await safeFetch("/tutors/profile/me");
      const raw = unwrapData(data);
      return isRecord(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  async updateTutorAvailability(payload: ApiRecord) {
    return await safeFetch("/slots", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async getTutorSlots() {
    try {
      return toArray(await safeFetch("/tutors/slots/mine"));
    } catch {
      return [];
    }
  }

  async getTutorDashboard() {
    try {
      return unwrapData(await safeFetch("/trainer/dashboard"));
    } catch {
      return null;
    }
  }

  async getTutorBookings() {
    try {
      return toArray(await safeFetch("/tutors/sessions/mine"));
    } catch {
      try {
        return toArray(await safeFetch("/bookings"));
      } catch {
        return [];
      }
    }
  }

  async getTutorCourses() {
    try {
      return toArray(await safeFetch("/tutors/sessions/mine"));
    } catch {
      return [];
    }
  }

  async getAdminDashboard() {
    try {
      return unwrapData(await safeFetch("/admin/dashboard"));
    } catch {
      return null;
    }
  }

  async getCategories() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/categories`, {
        headers,
        cache: "no-store",
      });
      const data = await res.json();
      return toArray(data);
    } catch {
      return [];
    }
  }

  async createCategory(payload: ApiRecord) {
    return await safeFetch("/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async updateCategory(categoryId: string, payload: ApiRecord) {
    return await safeFetch(`/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  async deleteCategory(categoryId: string) {
    return await safeFetch(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }
}

export const dashboardService = new DashboardService();
export { isRecord, toArray, unwrapData };
