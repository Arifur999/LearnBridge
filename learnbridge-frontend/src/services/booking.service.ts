import { API_V1_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";

export interface BookSessionPayload {
  tutorId?: string;
  slotId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}

class BookingService {

  async getTrainerSlots(trainerId: string) {
    try {
      const res = await fetch(
        `${API_V1_URL}/tutors/${trainerId}/slots`,
        { cache: "no-store" }
      );
      if (!res.ok) return [];
      const data = await res.json();
      const raw = data?.data ?? data;
      return Array.isArray(raw) ? raw : (Array.isArray(raw?.slots) ? raw.slots : []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      return [];
    }
  }

  async cancelBooking(bookingId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "CANCELLED" }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Cancel failed");
    return data;
  }

  async completeBooking(bookingId: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/bookings/${bookingId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "COMPLETED" }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Update failed");
    return data;
  }


  async bookSlot(payload: string | BookSessionPayload) {
    const headers = await getAuthHeaders(); 

    const body =
      typeof payload === "string" ? { slotId: payload } : payload;

    const res = await fetch(`${API_V1_URL}/bookings`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Booking failed");
    }

    return data;
  }
}

export const bookingService = new BookingService();
