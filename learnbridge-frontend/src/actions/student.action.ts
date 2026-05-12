"use server";

import { bookingService } from "@/services/booking.service";
import { reviewService } from "@/services/review.service";
import { tutorService } from "@/services/tutor.service";
import { revalidatePath } from "next/cache";

export interface CreateBookingPayload {
  availabilityId: string;
  tutorId: string;
  subjectId?: string;
}

export interface LeaveReviewPayload {
  bookingId: string;
  rating: number;
  review: string;
}

export const getTutorByIdAction = async (tutorId: string) => {
  const res = await tutorService.getTutorById(tutorId);
  return res;
};

export const createBookingAction = async (data: CreateBookingPayload) => {
  const res = await bookingService.createBooking(data);
  return res;
};

export const leaveReviewAction = async (data: LeaveReviewPayload) => {
  const res = await reviewService.createReview({
    bookingId: data.bookingId,
    rating: data.rating,
    review: data.review,
  });
  revalidatePath("/dashboard/bookings");
  return res;
};

export const cancelBookingAction = async (bookingId: string) => {
  try {
    const res = await bookingService.cancelBooking(bookingId);
    revalidatePath("/dashboard/bookings");
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Failed" };
  }
};

export const getMyBookingsAction = async () => {
  return await bookingService.getAllBookings();
};
