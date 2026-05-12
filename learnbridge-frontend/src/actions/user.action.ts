"use server";

import { bookingService } from "@/services/booking.service";
import { userService } from "@/services/user.service";
import { revalidatePath } from "next/cache";

export const updateProfileAction = async (formData: FormData) => {
  try {
    const payload: { name?: string; image?: string } = {};
    const name = formData.get("name");
    const image = formData.get("image");
    if (name) payload.name = name.toString();
    if (image) payload.image = image.toString();
    const res = await userService.updateProfile(payload);
    revalidatePath("/dashboard/profile");
    revalidatePath("/tutor/profile");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateBookingStatusAction = async (
  status: string,
  bookingId: string
) => {
  try {
    const res =
      status === "CANCELLED"
        ? await bookingService.cancelBooking(bookingId)
        : await bookingService.completeBooking(bookingId);
    revalidatePath("/admin/bookings");
    revalidatePath("/tutor/bookings");
    revalidatePath("/dashboard/bookings");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const updateUserStatusAction = async (
  status: string,
  userId: string
) => {
  try {
    const res = await userService.updateUserStatus(userId, status);
    revalidatePath("/admin/users");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const getProfileAction = async () => {
  return await userService.getProfile();
};
