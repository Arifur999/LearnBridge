import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

class PaymentService {
  async createBookingPaymentSession(bookingId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/payments/booking`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookingId }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Payment failed");
    return data;
  }

  async createCoursePaymentSession(courseId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/payments/course`, {
      method: "POST",
      headers,
      body: JSON.stringify({ courseId }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Payment failed");
    return data;
  }

  async getMyPayments() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/payments/my`, {
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

  async getTutorPayments() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_V1_URL}/payments/tutor`, {
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

  async getAllPayments(page = 1, limit = 20) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(
        `${API_V1_URL}/admin/payments?page=${page}&limit=${limit}`,
        { headers, cache: "no-store" }
      );
      if (!res.ok) return { data: [], meta: null };
      const result = await res.json();
      return {
        data: result?.data?.data ?? result?.data ?? [],
        meta: result?.data?.meta ?? result?.meta ?? null,
      };
    } catch {
      return { data: [], meta: null };
    }
  }

  async verifyPaymentSession(sessionId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/payments/verify?session_id=${sessionId}`, {
      headers,
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Verification failed");
    return data;
  }
}

export const paymentService = new PaymentService();
