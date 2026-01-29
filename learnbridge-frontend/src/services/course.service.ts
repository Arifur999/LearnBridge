import { API_BASE_URL } from "@/lib/config";

class CourseService {
  async getPopularCourses(limit = 3) {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/courses/search?limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data?.data || [];
  }
}

export const courseService = new CourseService();
