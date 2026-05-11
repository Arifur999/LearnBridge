import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class ReviewService {
  async createReview(payload: {
    tutorId?: string;
    bookingId?: string;
    rating: number | string;
    review?: string;
    comment?: string;
  }) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Review submission failed");
    return data;
  }

  async getTutorReviews(tutorId: string) {
    try {
      const res = await fetch(`${API_V1_URL}/reviews/tutor/${tutorId}`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      const raw = data?.data ?? data;
      return Array.isArray(raw) ? raw : Array.isArray(raw?.reviews) ? raw.reviews : [];
    } catch {
      return [];
    }
  }

  async getMyReviews() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/tutor/reviews`, {
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
}

export const reviewService = new ReviewService();
