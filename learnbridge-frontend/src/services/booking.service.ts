import { API_BASE_URL } from "@/lib/config";
import { getAuthHeaders } from "./auth.server";



class BookingService {

  async getTrainerSlots(trainerId: string) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/v1/slots?trainerId=${trainerId}&isBooked=false`,
        { cache: "no-store" }
      );
      const data = await res.json();
      return data?.data || [];
    } catch (error) {
      console.error("Error fetching slots:", error);
      return [];
    }
  }


  async bookSlot(slotId: string) {
    const headers = await getAuthHeaders(); 

    const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ slotId }),
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