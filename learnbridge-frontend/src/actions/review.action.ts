"use server";

import { revalidatePath } from "next/cache";
import { reviewService } from "@/services/review.service";

export const createReviewAction = async (
  tutorId: string,
  bookingId: string | undefined,
  rating: number,
  comment: string
) => {
  try {
    const result = await reviewService.createReview({
      tutorId,
      bookingId,
      rating,
      comment,
    });
    revalidatePath(`/tutors/${tutorId}`);
    revalidatePath("/student/bookings");
    return { success: true, message: "Review submitted!", data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
};

export const getTutorReviewsAction = async (tutorId: string) => {
  return await reviewService.getTutorReviews(tutorId);
};
