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
      const raw = await safeFetch("/admin/users");
      const root = isRecord(raw) ? raw : {};
      const inner = isRecord(root.data) ? root.data : root;
      // handle: { data: [...] }, { data: { data: [...] } }, { data: { users: [...] } }, etc.
      for (const key of ["data", "users", "items", "result", "list"]) {
        if (Array.isArray((inner as Record<string, unknown>)[key])) {
          return ((inner as Record<string, unknown>)[key] as unknown[]).filter(isRecord);
        }
      }
      if (Array.isArray(inner)) return (inner as unknown[]).filter(isRecord);
      return toArray(raw);
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
    const paths = [`/admin/users/${userId}/status`, `/admin/users/${userId}`];
    let lastErr: unknown;
    for (const path of paths) {
      try {
        return await safeFetch(path, { method: "PATCH", body: JSON.stringify({ status }) });
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  }

  async updateTutorProfile(payload: ApiRecord) {
    // Backend registers: PUT /api/v1/tutors/profile/me  (tutor.route.ts)
    const attempts: { method: "PATCH" | "PUT" | "POST"; path: string }[] = [
      { method: "PUT",   path: "/tutors/profile/me" },
      { method: "PATCH", path: "/tutors/profile/me" },
      { method: "PUT",   path: "/trainer/profile" },
      { method: "PATCH", path: "/trainer/profile" },
    ];
    const errors: string[] = [];
    for (const { method, path } of attempts) {
      try {
        return await safeFetch(path, { method, body: JSON.stringify(payload) });
      } catch (err) {
        errors.push(`${method} ${path}: ${err instanceof Error ? err.message : "failed"}`);
      }
    }
    const meaningful = errors.find((e) => !e.includes("Request failed") && !e.includes("Cannot"));
    throw new Error(meaningful ?? errors[0] ?? "Failed to save profile");
  }

  async getTutorProfile() {
    for (const path of ["/tutors/profile/me", "/trainer/profile", "/tutor/profile"]) {
      try {
        const data = await safeFetch(path);
        const raw = unwrapData(data) as Record<string, unknown> | null;
        if (!isRecord(raw)) continue;

        // Backend returns { id, name, email, profile: { bio, subjects, … } }
        // Flatten so callers can read bio/subjects/hourlyRate/profileImage directly
        const nested = isRecord(raw.profile) ? raw.profile : {};
        return {
          ...nested,
          ...raw,
          // nested fields win over the top-level stub (except profile key itself)
          bio:          nested.bio          ?? raw.bio,
          subjects:     nested.subjects     ?? raw.subjects,
          hourlyRate:   nested.hourlyRate   ?? raw.hourlyRate,
          profileImage: nested.profileImage ?? raw.profileImage ?? raw.image,
          category:     nested.category     ?? raw.category,
          experience:   nested.experience   ?? raw.experience,
        };
      } catch { /* try next */ }
    }
    return null;
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
