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
      return null;
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
    return await safeFetch("/tutor/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async updateTutorAvailability(payload: ApiRecord) {
    return await safeFetch("/tutor/availability", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }
}

export const dashboardService = new DashboardService();
export { isRecord, toArray, unwrapData };
