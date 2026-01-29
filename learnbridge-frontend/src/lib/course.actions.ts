import { API_BASE_URL } from "@/lib/config";

export async function getPopularCourses(limit = 3) {
  try {
    const res = await fetch(
      `${API_BASE_URL}api/v1/courses/search?limit=3`,
      {
        cache: "no-store",
      }
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
