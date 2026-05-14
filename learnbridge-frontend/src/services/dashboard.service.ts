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
    let errMsg = "Request failed";
    if (isRecord(data)) {
      if (typeof data.message === "string") errMsg = data.message;
      else if (typeof data.error === "string") errMsg = data.error;
      else if (typeof data.msg === "string") errMsg = data.msg;
      else if (Array.isArray(data.errors) && isRecord(data.errors[0]) && typeof data.errors[0].message === "string")
        errMsg = data.errors[0].message;
    }
    throw new Error(errMsg);
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
    const attempts: { method: "PATCH" | "PUT" | "POST"; path: string }[] = [
      { method: "PATCH", path: "/tutor/profile" },
      { method: "POST",  path: "/tutor/profile" },
      { method: "PUT",   path: "/tutor/profile" },
      { method: "PATCH", path: "/tutors/profile/me" },
      { method: "PUT",   path: "/tutors/profile/me" },
      { method: "POST",  path: "/tutors/profile" },
    ];
    let lastError = "Failed to save profile";
    for (const { method, path } of attempts) {
      try {
        return await safeFetch(path, { method, body: JSON.stringify(payload) });
      } catch (err) {
        // Always try the next endpoint — surface error only after all attempts
        lastError = err instanceof Error ? err.message : "Failed to save profile";
      }
    }
    throw new Error(lastError);
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

  async getAdminCourses() {
    try {
      return toArray(await safeFetch("/admin/courses"));
    } catch {
      return [];
    }
  }

  async getAdminPendingCourses() {
    try {
      return toArray(await safeFetch("/admin/courses/pending"));
    } catch {
      return [];
    }
  }

  async approveCourse(courseId: string) {
    return await safeFetch(`/admin/courses/${courseId}/approve`, { method: "PATCH" });
  }

  async rejectCourse(courseId: string) {
    return await safeFetch(`/admin/courses/${courseId}/reject`, { method: "PATCH" });
  }
}

export const dashboardService = new DashboardService();
export { isRecord, toArray, unwrapData };
