import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

const ENROLLMENTS_ENDPOINT = "/student/enrollments";

class EnrollmentService {
  async enrollCourse(courseId: string) {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_V1_URL}${ENROLLMENTS_ENDPOINT}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ courseId }),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || "Enrollment failed");
    }

    return data;
  }

  async getMyEnrollments() {
    const headers = await getAuthHeaders();

    const res = await fetch(`${API_V1_URL}${ENROLLMENTS_ENDPOINT}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json().catch(() => null);

    return data?.data || data || [];
  }
}

export const enrollmentService = new EnrollmentService();
export { ENROLLMENTS_ENDPOINT };
