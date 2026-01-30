import { API_BASE_URL } from "@/lib/config";

class CourseService {
  async getPopularCourses(limit = 3) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/courses/search?limit=${limit}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        console.error("Course API failed:", res.status);
        return [];
      }

      const data = await res.json();
      return data?.data || [];
    } catch (error) {
      console.error("Course fetch error:", error);
      return [];
    }
  }

  async getAllCourses(query = "") {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/courses/search${query}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        return { data: [], meta: null };
      }

      const result = await res.json();

      return {
        data: result?.data || [],
        meta: result?.meta || null,
      };
    } catch (error) {
      console.error("Course fetch error:", error);
      return { data: [], meta: null };
    }
  }
}

export const courseService = new CourseService();
