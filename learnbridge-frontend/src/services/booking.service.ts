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
        `${API_V1_URL}/slots?trainerId=${trainerId}&isBooked=false`,
        { cache: "no-store" }
      );
      const data = await res.json();
      return data?.data || [];
    } catch (error) {
      console.error("Error fetching slots:", error);
      return [];
    }
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
