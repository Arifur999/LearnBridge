"use server";

import { bookingService, BookSessionPayload } from "@/services/booking.service";
import { getAuthHeaders } from "@/services/auth.server";
import { API_V1_URL } from "@/lib/config";
import { revalidatePath } from "next/cache";

export const getTrainerSlots = async (trainerId: string) => {
  return await bookingService.getTrainerSlots(trainerId);
};

export const bookSlotAction = async (payload: string | BookSessionPayload) => {
  try {
    const result = await bookingService.bookSlot(payload);
    revalidatePath("/tutors/[id]", "page");
    return { success: true, message: "Booking successful!", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to book slot",
    };
  }
};

// Pay with custom card form — Stripe validates card server-side
export const chargeCardAction = async (payload: {
  slotId: string;
  cardNumber: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}): Promise<{ success: true; bookingId: string } | { success: false; message: string }> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/payments/pay`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data?.message ?? "Payment failed" };
    return { success: true, bookingId: data?.data?.bookingId ?? "" };
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : "Payment failed" };
  }
};

// Book slot then create Stripe checkout session — returns Stripe payment URL
export const bookAndPayAction = async (slotId: string): Promise<
  { success: true; stripeUrl: string } | { success: false; message: string }
> => {
  try {
    // Create booking first
    const booking = await bookingService.bookSlot(slotId);
    const bookingData = booking?.data ?? booking;
    const bookingId: string =
      bookingData?.id ??
      bookingData?.booking?.id ??
      bookingData?.bookingId;

    if (!bookingId) throw new Error("Booking created but no bookingId returned");

    // Then create Stripe checkout session
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_V1_URL}/payments/booking/${bookingId}`, {
      method: "POST",
      headers,
      cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message ?? "Failed to create payment session");

    const stripeUrl: string = data?.data?.url ?? data?.url;
    if (!stripeUrl) throw new Error("No payment URL returned from Stripe");

    return { success: true, stripeUrl };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Payment setup failed",
    };
  }
};
